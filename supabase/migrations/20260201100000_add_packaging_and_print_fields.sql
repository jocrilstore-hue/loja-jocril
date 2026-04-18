-- Migration: Add packaging dimensions and print area fields to product_variants
-- Purpose: Enable shipping cost calculation and support "with print" variant options
-- Date: 2026-02-01

-- =====================================================
-- 1. ADD PACKAGING DIMENSION FIELDS
-- For shipping calculation - each variant has its own box
-- =====================================================
ALTER TABLE product_variants
    ADD COLUMN IF NOT EXISTS packaging_width_mm INTEGER,
    ADD COLUMN IF NOT EXISTS packaging_height_mm INTEGER,
    ADD COLUMN IF NOT EXISTS packaging_depth_mm INTEGER,
    ADD COLUMN IF NOT EXISTS packaging_weight_grams INTEGER;

-- =====================================================
-- 2. ADD PRINT AREA FIELDS
-- For products that have optional print areas (leaflet holders, etc.)
-- =====================================================
ALTER TABLE product_variants
    ADD COLUMN IF NOT EXISTS has_print_area BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS print_width_mm INTEGER,
    ADD COLUMN IF NOT EXISTS print_height_mm INTEGER,
    ADD COLUMN IF NOT EXISTS print_position VARCHAR(20);

-- Valid print positions: top, bottom, center, left, right, custom
COMMENT ON COLUMN product_variants.print_position IS 'Print area position: top, bottom, center, left, right, custom';

-- =====================================================
-- 3. SET DEFAULT VALUES FOR EXISTING DATA
-- Ensure weight_grams has a value for existing variants
-- =====================================================
UPDATE product_variants
SET weight_grams = 0
WHERE weight_grams IS NULL;

-- Set existing products as having no print area by default
UPDATE product_variants
SET has_print_area = false
WHERE has_print_area IS NULL;

-- =====================================================
-- 4. SET STOCK TO ALWAYS IN STOCK (MANUFACTURED TO ORDER)
-- Since products are manufactured on demand, stock is irrelevant
-- =====================================================
UPDATE product_variants
SET
    stock_status = 'in_stock',
    stock_quantity = 9999;

-- =====================================================
-- 5. ADD HELPFUL COMMENTS
-- =====================================================
COMMENT ON COLUMN product_variants.packaging_width_mm IS 'Shipping box width in mm';
COMMENT ON COLUMN product_variants.packaging_height_mm IS 'Shipping box height in mm';
COMMENT ON COLUMN product_variants.packaging_depth_mm IS 'Shipping box depth in mm';
COMMENT ON COLUMN product_variants.packaging_weight_grams IS 'Empty shipping box weight in grams';
COMMENT ON COLUMN product_variants.has_print_area IS 'Whether this variant has an optional print area';
COMMENT ON COLUMN product_variants.print_width_mm IS 'Print area width in mm';
COMMENT ON COLUMN product_variants.print_height_mm IS 'Print area height in mm';
COMMENT ON COLUMN product_variants.weight_grams IS 'Product weight in grams (required for shipping)';
