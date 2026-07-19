-- =====================================================
-- Create the "Expositores" and "Sinalética" categories
-- =====================================================
-- DRAFT — Maria's Gate 0 decision (2026-07-19): the storefront nav links to
-- ?cat=expositores and ?cat=sinaletica, which did not exist in the DB (the
-- links silently showed ALL products). Decision: create the categories.
-- Products remain unassigned until Maria classifies them in /admin/produtos —
-- until then these category pages show an empty listing, which is honest.
--
-- Schema matches the live `categories` table (probed 2026-07-19):
-- id, name, slug, parent_id, description, meta_title, meta_description,
-- display_order, is_active, created_at, updated_at.
-- Unique constraint on categories.slug CONFIRMED live 2026-07-19 (PostgREST
-- upsert with onConflict:'slug' succeeded) — ON CONFLICT (slug) is valid.
-- display_order continues after the existing 6 categories.

INSERT INTO public.categories
  (name, slug, description, meta_title, meta_description, display_order, is_active)
VALUES
  (
    'Expositores',
    'expositores',
    'Expositores e displays para ponto de venda em acrílico e madeira.',
    'Expositores | Displays para Ponto de Venda',
    'Expositores e displays para ponto de venda em acrílico e madeira. Fabrico próprio, precisão industrial.',
    7,
    true
  ),
  (
    'Sinalética',
    'sinaletica',
    'Sinalética e identificação para espaços comerciais e hotelaria.',
    'Sinalética | Identificação para Espaços Comerciais',
    'Sinalética e identificação em acrílico e madeira para espaços comerciais e hotelaria. Fabrico próprio.',
    8,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Post-apply verification:
--   SELECT slug FROM public.categories ORDER BY display_order;
--   -- expect the 6 existing + expositores + sinaletica
--   Storefront: /produtos?cat=expositores renders the (empty) category page
--   with the category name, not "Todos os produtos".
