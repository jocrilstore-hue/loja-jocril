-- =====================================================
-- Site Content Table Migration
-- Structured JSON content for FAQ, Terms, Privacy, etc.
-- =====================================================

-- =====================================================
-- 1. SITE CONTENT TABLE
-- Stores structured JSON content keyed by slug
-- =====================================================
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,                -- 'faq', 'terms', 'privacy', 'about-services', 'contact-info'
    content_type TEXT NOT NULL,               -- 'faq_sections', 'legal_text', 'services_list', 'contact_info'
    content JSONB NOT NULL,                   -- Structured content (validated by application)
    meta JSONB,                               -- Optional metadata (author, version, notes)
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_site_content_slug ON site_content(slug);
CREATE INDEX IF NOT EXISTS idx_site_content_type ON site_content(content_type);
CREATE INDEX IF NOT EXISTS idx_site_content_active ON site_content(is_active) WHERE is_active = true;

-- =====================================================
-- 3. TRIGGER FOR updated_at
-- Uses existing update_updated_at_column() function
-- =====================================================
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. RLS POLICIES
-- Public read for active content, service role full access
-- =====================================================
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for admin editing)
DROP POLICY IF EXISTS "Service role has full access to site_content" ON site_content;
CREATE POLICY "Service role has full access to site_content"
    ON site_content FOR ALL
    USING (true)
    WITH CHECK (true);

-- Public read access for active content only
DROP POLICY IF EXISTS "Public can read active site content" ON site_content;
CREATE POLICY "Public can read active site content"
    ON site_content FOR SELECT
    USING (is_active = true);

-- =====================================================
-- 5. COMMENTS
-- Document the table and columns
-- =====================================================
COMMENT ON TABLE site_content IS 'Structured JSON content for storefront pages (FAQ, Terms, Privacy, About, Contact)';
COMMENT ON COLUMN site_content.slug IS 'Unique identifier for content lookup (e.g., "faq", "terms", "contact-info")';
COMMENT ON COLUMN site_content.content_type IS 'Type of content for validation routing (e.g., "faq_sections", "legal_text")';
COMMENT ON COLUMN site_content.content IS 'JSONB content validated by application Zod schemas';
COMMENT ON COLUMN site_content.meta IS 'Optional metadata: author, version, last_reviewed_at, notes';
COMMENT ON COLUMN site_content.is_active IS 'Whether content is published and visible on storefront';
