-- =====================================================
-- Admin Product Template Save RPC
-- Atomically saves a product template with its applications
-- Prevents data loss on partial failures
-- =====================================================

CREATE OR REPLACE FUNCTION admin_save_product_template(
  p_template jsonb,
  p_application_ids int[]
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_template_id bigint;
  v_existing_id bigint;
BEGIN
  -- =====================================================
  -- 1. UPSERT PRODUCT TEMPLATE
  -- If p_template.id exists and is valid -> UPDATE
  -- Else -> INSERT
  -- =====================================================

  -- Check if we have an existing template ID
  v_existing_id := (p_template->>'id')::bigint;

  IF v_existing_id IS NOT NULL THEN
    -- UPDATE existing template
    UPDATE product_templates SET
      name = COALESCE(p_template->>'name', name),
      slug = COALESCE(p_template->>'url_slug', p_template->>'slug', slug),
      sku_prefix = NULLIF(p_template->>'sku_prefix', ''),
      reference_code = NULLIF(p_template->>'reference_code', ''),
      category_id = (p_template->>'category_id')::integer,
      material_id = NULLIF((p_template->>'material_id')::text, '')::integer,
      orientation = COALESCE((p_template->>'orientation')::orientation_type, orientation),
      has_lock = COALESCE((p_template->>'has_lock')::boolean, has_lock),
      is_double_sided = COALESCE((p_template->>'is_double_sided')::boolean, is_double_sided),
      is_adhesive = COALESCE((p_template->>'is_adhesive')::boolean, is_adhesive),
      short_description = NULLIF(p_template->>'short_description', ''),
      full_description = NULLIF(p_template->>'full_description', ''),
      advantages = NULLIF(p_template->>'advantages', ''),
      specifications_text = NULLIF(p_template->>'specifications_text', ''),
      care_instructions = NULLIF(p_template->>'care_instructions', ''),
      faq = CASE
        WHEN p_template->'faq' IS NOT NULL THEN p_template->'faq'
        ELSE faq
      END,
      specifications_json = CASE
        WHEN p_template->'specifications_json' IS NOT NULL THEN p_template->'specifications_json'
        ELSE specifications_json
      END,
      seo_title_template = NULLIF(p_template->>'seo_title_template', ''),
      seo_description_template = NULLIF(p_template->>'seo_description_template', ''),
      has_quantity_discounts = COALESCE((p_template->>'has_quantity_discounts')::boolean, has_quantity_discounts),
      min_order_quantity = COALESCE((p_template->>'min_order_quantity')::integer, min_order_quantity),
      is_customizable = COALESCE((p_template->>'is_customizable')::boolean, is_customizable),
      is_active = COALESCE((p_template->>'is_active')::boolean, is_active),
      is_featured = COALESCE((p_template->>'is_featured')::boolean, is_featured),
      display_order = COALESCE((p_template->>'display_order')::integer, display_order),
      updated_at = NOW()
    WHERE id = v_existing_id
    RETURNING id INTO v_template_id;

    -- Verify the update succeeded
    IF v_template_id IS NULL THEN
      RAISE EXCEPTION 'Template não encontrado (ID: %)', v_existing_id
        USING ERRCODE = 'P0002';
    END IF;
  ELSE
    -- INSERT new template
    INSERT INTO product_templates (
      name,
      slug,
      sku_prefix,
      reference_code,
      category_id,
      material_id,
      orientation,
      has_lock,
      is_double_sided,
      is_adhesive,
      short_description,
      full_description,
      advantages,
      specifications_text,
      care_instructions,
      faq,
      specifications_json,
      seo_title_template,
      seo_description_template,
      has_quantity_discounts,
      min_order_quantity,
      is_customizable,
      is_active,
      is_featured,
      display_order,
      created_at,
      updated_at
    ) VALUES (
      p_template->>'name',
      COALESCE(p_template->>'url_slug', p_template->>'slug'),
      NULLIF(p_template->>'sku_prefix', ''),
      NULLIF(p_template->>'reference_code', ''),
      (p_template->>'category_id')::integer,
      NULLIF((p_template->>'material_id')::text, '')::integer,
      COALESCE((p_template->>'orientation')::orientation_type, 'vertical'),
      COALESCE((p_template->>'has_lock')::boolean, false),
      COALESCE((p_template->>'is_double_sided')::boolean, false),
      COALESCE((p_template->>'is_adhesive')::boolean, false),
      NULLIF(p_template->>'short_description', ''),
      NULLIF(p_template->>'full_description', ''),
      NULLIF(p_template->>'advantages', ''),
      NULLIF(p_template->>'specifications_text', ''),
      NULLIF(p_template->>'care_instructions', ''),
      p_template->'faq',
      p_template->'specifications_json',
      NULLIF(p_template->>'seo_title_template', ''),
      NULLIF(p_template->>'seo_description_template', ''),
      COALESCE((p_template->>'has_quantity_discounts')::boolean, true),
      COALESCE((p_template->>'min_order_quantity')::integer, 1),
      COALESCE((p_template->>'is_customizable')::boolean, false),
      COALESCE((p_template->>'is_active')::boolean, true),
      COALESCE((p_template->>'is_featured')::boolean, false),
      COALESCE((p_template->>'display_order')::integer, 0),
      NOW(),
      NOW()
    )
    RETURNING id INTO v_template_id;
  END IF;

  -- =====================================================
  -- 2. SYNC APPLICATIONS ATOMICALLY
  -- Delete all existing, then insert new ones
  -- This is safe because we're in a transaction
  -- =====================================================

  -- Delete existing applications for this template
  DELETE FROM product_applications
  WHERE product_template_id = v_template_id;

  -- Insert new applications (if any provided)
  IF p_application_ids IS NOT NULL AND array_length(p_application_ids, 1) > 0 THEN
    INSERT INTO product_applications (product_template_id, application_id)
    SELECT v_template_id, unnest(p_application_ids);
  END IF;

  -- =====================================================
  -- 3. RETURN SUCCESS
  -- Transaction commits automatically if we reach here
  -- =====================================================

  RETURN v_template_id;

EXCEPTION
  WHEN unique_violation THEN
    -- Handle duplicate slug/sku
    RAISE EXCEPTION 'Slug ou SKU já existe: %', SQLERRM
      USING ERRCODE = '23505';
  WHEN foreign_key_violation THEN
    -- Handle invalid category_id, material_id, or application_id
    RAISE EXCEPTION 'Referência inválida (categoria, material ou aplicação): %', SQLERRM
      USING ERRCODE = '23503';
  WHEN OTHERS THEN
    -- Transaction automatically rolls back on exception
    RAISE EXCEPTION '%', SQLERRM
      USING
        ERRCODE = SQLSTATE,
        HINT = 'Transaction rolled back. No data was modified.';
END;
$$;

-- Grant execute to service_role (admin operations)
GRANT EXECUTE ON FUNCTION admin_save_product_template(jsonb, int[]) TO service_role;

-- Grant to authenticated (admins use authenticated role with RLS)
GRANT EXECUTE ON FUNCTION admin_save_product_template(jsonb, int[]) TO authenticated;

-- Add documentation comment
COMMENT ON FUNCTION admin_save_product_template IS
'Atomically saves a product template with its applications.
Performs UPSERT on product_templates and syncs product_applications.
Rolls back entire transaction if any operation fails.
Returns: template_id (bigint)
Errors: P0002 = template not found, 23505 = duplicate slug/sku, 23503 = invalid reference';
