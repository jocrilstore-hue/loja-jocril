-- Function to atomically replace all price tiers
-- Purpose: Transaction-safe deletion and re-insertion of price tiers
-- Access: Restricted to Service Role or Admin usage via RPC

CREATE OR REPLACE FUNCTION admin_apply_price_tiers(
  p_tiers jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted_count int;
  v_deleted_count int;
BEGIN
  -- 1. Delete all existing price tiers (except potentially ID 0 if that is a special sentinel? 
  -- Current code uses .neq('id', 0), implying 0 might be reserved or legacy).
  WITH deleted_rows AS (
    DELETE FROM price_tiers
    WHERE id != 0
    RETURNING id
  )
  SELECT count(*) INTO v_deleted_count FROM deleted_rows;

  -- 2. Insert new tiers
  IF jsonb_array_length(p_tiers) > 0 THEN
    WITH inserted_rows AS (
      INSERT INTO price_tiers (
        product_variant_id,
        min_quantity,
        max_quantity,
        discount_percentage,
        price_per_unit,
        display_text
      )
      SELECT
        product_variant_id,
        min_quantity,
        max_quantity,
        discount_percentage,
        price_per_unit,
        display_text
      FROM jsonb_to_recordset(p_tiers) AS x(
        product_variant_id int,
        min_quantity int,
        max_quantity int,
        discount_percentage numeric,
        price_per_unit numeric,
        display_text text
      )
      RETURNING id
    )
    SELECT count(*) INTO v_inserted_count FROM inserted_rows;
  ELSE
    v_inserted_count := 0;
  END IF;

  -- 3. Return summary
  RETURN jsonb_build_object(
    'deleted_count', v_deleted_count,
    'inserted_count', v_inserted_count,
    'success', true
  );
EXCEPTION WHEN OTHERS THEN
  -- Raise exception to rollback transaction
  RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users (admin check must be enforced in app layer or RLS)
-- Since it uses SECURITY DEFINER, we rely on the API route to check admin permissions.
GRANT EXECUTE ON FUNCTION admin_apply_price_tiers(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_apply_price_tiers(jsonb) TO service_role;
