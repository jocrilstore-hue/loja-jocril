-- =====================================================
-- Atomic Order Creation RPC
-- Creates a complete order in a single transaction
-- Prevents orphaned orders, inventory drift, and race conditions
-- =====================================================

CREATE OR REPLACE FUNCTION create_complete_order(
  p_customer jsonb,
  p_shipping_address jsonb,
  p_order jsonb,
  p_items jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id INTEGER;
  v_shipping_address_id INTEGER;
  v_order_id INTEGER;
  v_order_number TEXT;
  v_item RECORD;
  v_variant RECORD;
  v_first_name TEXT;
  v_last_name TEXT;
  v_name_parts TEXT[];
BEGIN
  -- =====================================================
  -- 1. CUSTOMER UPSERT
  -- Find by email, update if exists, create if not
  -- =====================================================

  -- Parse name into first/last
  v_name_parts := string_to_array(TRIM(p_customer->>'name'), ' ');
  v_first_name := COALESCE(v_name_parts[1], '');
  v_last_name := COALESCE(array_to_string(v_name_parts[2:], ' '), '');

  -- Try to find existing customer by email
  SELECT id INTO v_customer_id
  FROM customers
  WHERE email = LOWER(TRIM(p_customer->>'email'));

  IF v_customer_id IS NOT NULL THEN
    -- Update existing customer
    UPDATE customers SET
      first_name = v_first_name,
      last_name = v_last_name,
      phone = p_customer->>'phone',
      company_name = NULLIF(p_customer->>'company', ''),
      tax_id = NULLIF(p_customer->>'nif', ''),
      auth_user_id = COALESCE(NULLIF(p_customer->>'auth_user_id', ''), auth_user_id),
      updated_at = NOW()
    WHERE id = v_customer_id;
  ELSE
    -- Create new customer
    INSERT INTO customers (
      first_name,
      last_name,
      email,
      phone,
      company_name,
      tax_id,
      auth_user_id
    ) VALUES (
      v_first_name,
      v_last_name,
      LOWER(TRIM(p_customer->>'email')),
      p_customer->>'phone',
      NULLIF(p_customer->>'company', ''),
      NULLIF(p_customer->>'nif', ''),
      NULLIF(p_customer->>'auth_user_id', '')
    )
    RETURNING id INTO v_customer_id;
  END IF;

  -- =====================================================
  -- 2. SHIPPING ADDRESS INSERT
  -- =====================================================

  INSERT INTO shipping_addresses (
    customer_id,
    address_line_1,
    address_line_2,
    city,
    postal_code,
    country,
    is_default
  ) VALUES (
    v_customer_id,
    p_shipping_address->>'address',
    NULLIF(p_shipping_address->>'address2', ''),
    p_shipping_address->>'city',
    p_shipping_address->>'postal_code',
    COALESCE(p_shipping_address->>'country', 'Portugal'),
    FALSE
  )
  RETURNING id INTO v_shipping_address_id;

  -- =====================================================
  -- 3. GENERATE ORDER NUMBER
  -- Format: JCR-{timestamp}-{random}
  -- =====================================================

  v_order_number := 'JCR-' ||
    EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT || '-' ||
    UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 9));

  -- =====================================================
  -- 4. CREATE ORDER
  -- =====================================================

  INSERT INTO orders (
    customer_id,
    order_number,
    status,
    subtotal_excluding_vat,
    subtotal_including_vat,
    shipping_cost_excluding_vat,
    shipping_cost_including_vat,
    total_amount_excluding_vat,
    total_amount_with_vat,
    shipping_address_id,
    payment_method,
    notes
  ) VALUES (
    v_customer_id,
    v_order_number,
    'pending',
    (p_order->>'subtotal')::NUMERIC / 1.23,
    (p_order->>'subtotal')::NUMERIC,
    (p_order->>'shipping_cost')::NUMERIC / 1.23,
    (p_order->>'shipping_cost')::NUMERIC,
    ((p_order->>'subtotal')::NUMERIC + (p_order->>'shipping_cost')::NUMERIC) / 1.23,
    (p_order->>'total')::NUMERIC,
    v_shipping_address_id,
    NULLIF(p_order->>'payment_method', ''),
    NULLIF(p_order->>'notes', '')
  )
  RETURNING id INTO v_order_id;

  -- =====================================================
  -- 5. PROCESS ITEMS: LOCK STOCK, VALIDATE, DECREMENT, INSERT
  -- This is the critical section that prevents race conditions
  -- =====================================================

  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
    variant_id INTEGER,
    quantity INTEGER,
    unit_price NUMERIC,
    total_price NUMERIC,
    product_name TEXT,
    product_sku TEXT,
    size_format TEXT
  )
  LOOP
    -- Lock the variant row to prevent concurrent modifications
    -- This is the key to preventing race conditions
    SELECT
      id,
      stock_quantity,
      sku,
      size_format_id
    INTO v_variant
    FROM product_variants
    WHERE id = v_item.variant_id
    FOR UPDATE;

    -- Check if variant exists
    IF v_variant.id IS NULL THEN
      RAISE EXCEPTION 'Produto não encontrado (ID: %)', v_item.variant_id
        USING ERRCODE = 'P0002'; -- no_data_found
    END IF;

    -- Check stock availability
    IF COALESCE(v_variant.stock_quantity, 0) < v_item.quantity THEN
      RAISE EXCEPTION 'Stock insuficiente para o produto % (disponível: %, solicitado: %)',
        COALESCE(v_item.product_sku, v_variant.sku, v_item.variant_id::TEXT),
        COALESCE(v_variant.stock_quantity, 0),
        v_item.quantity
        USING ERRCODE = 'P0001'; -- insufficient_stock (custom)
    END IF;

    -- Decrement stock
    UPDATE product_variants
    SET
      stock_quantity = GREATEST(0, COALESCE(stock_quantity, 0) - v_item.quantity),
      updated_at = NOW()
    WHERE id = v_item.variant_id;

    -- Insert order item with snapshot data
    INSERT INTO order_items (
      order_id,
      product_variant_id,
      quantity,
      unit_price_excluding_vat,
      unit_price_with_vat,
      line_total_excluding_vat,
      line_total_with_vat,
      product_name,
      product_sku,
      size_format
    ) VALUES (
      v_order_id,
      v_item.variant_id,
      v_item.quantity,
      v_item.unit_price / 1.23,
      v_item.unit_price,
      v_item.total_price / 1.23,
      v_item.total_price,
      v_item.product_name,
      COALESCE(v_item.product_sku, v_variant.sku),
      v_item.size_format
    );
  END LOOP;

  -- =====================================================
  -- 6. RETURN SUCCESS
  -- Transaction commits automatically if we reach here
  -- =====================================================

  RETURN jsonb_build_object(
    'success', TRUE,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'customer_id', v_customer_id
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Transaction automatically rolls back on exception
    -- Re-raise with context for API to handle
    RAISE EXCEPTION '%', SQLERRM
      USING
        ERRCODE = SQLSTATE,
        HINT = 'Transaction rolled back. No data was modified.';
END;
$$;

-- Grant execute to service_role (admin operations use this)
GRANT EXECUTE ON FUNCTION create_complete_order(jsonb, jsonb, jsonb, jsonb) TO service_role;

-- Also grant to authenticated for potential future use with proper RLS
GRANT EXECUTE ON FUNCTION create_complete_order(jsonb, jsonb, jsonb, jsonb) TO authenticated;

-- Grant to anon for guest checkout
GRANT EXECUTE ON FUNCTION create_complete_order(jsonb, jsonb, jsonb, jsonb) TO anon;

-- Add comment documenting the function
COMMENT ON FUNCTION create_complete_order IS
'Atomically creates a complete order with customer, shipping address, order, and items.
Uses row-level locking (FOR UPDATE) to prevent race conditions on stock.
Rolls back entire transaction if stock is insufficient or any error occurs.
Returns: { success: true, order_id, order_number, customer_id }
Errors: P0001 = insufficient stock, P0002 = product not found';
