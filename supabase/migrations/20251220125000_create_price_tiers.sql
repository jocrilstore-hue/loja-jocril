-- Price tiers used by PDP quantity pricing and admin_apply_price_tiers()

CREATE TABLE IF NOT EXISTS price_tiers (
  id SERIAL PRIMARY KEY,
  product_variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL CHECK (min_quantity > 0),
  max_quantity INTEGER CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
  discount_percentage NUMERIC(5, 2) DEFAULT 0 CHECK (discount_percentage >= 0),
  price_per_unit NUMERIC(12, 2) NOT NULL CHECK (price_per_unit >= 0),
  display_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_tiers_variant_quantity
ON price_tiers(product_variant_id, min_quantity);

DROP TRIGGER IF EXISTS update_price_tiers_updated_at ON price_tiers;
CREATE TRIGGER update_price_tiers_updated_at
  BEFORE UPDATE ON price_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
