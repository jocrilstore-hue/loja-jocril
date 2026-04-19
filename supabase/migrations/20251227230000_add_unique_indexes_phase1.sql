-- =============================================================================
-- PHASE 1: Lock Invariants at the Database Level
-- =============================================================================
--
-- Purpose:
--   These indexes enforce invariants that are ALREADY enforced at the
--   application and API layer. This migration adds database-level constraints
--   as a defensive measure to guarantee data integrity.
--
-- Pre-migration audit confirmed:
--   - Zero duplicate values exist in any of these columns
--   - Zero NULL values exist in any of these columns
--   - Application code already validates uniqueness before insert/update
--
-- Note on CONCURRENTLY:
--   Supabase migrations run inside transactions, which prevents CONCURRENTLY.
--   For production tables with high traffic, run these via `supabase db execute`
--   outside of migrations. For this codebase, standard index creation is fine.
--
-- =============================================================================

-- Unique index on product_templates.slug
-- Ensures each product template has a unique URL-friendly identifier
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_templates_slug_unique
ON product_templates (slug);

-- Unique index on product_variants.sku
-- Ensures each product variant has a unique stock keeping unit
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_sku_unique
ON product_variants (sku);

-- Unique index on product_variants.url_slug
-- Ensures each product variant has a unique URL path for direct linking
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_url_slug_unique
ON product_variants (url_slug);
