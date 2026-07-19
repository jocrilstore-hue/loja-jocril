// Single source of truth for the public site URL — consumed by EuPago
// callbacks, metadataBase, robots.txt and sitemap.xml. Canonical production
// domain confirmed by Maria (2026-07-19): loja.jocril.pt.
// Prefer NEXT_PUBLIC_SITE_URL; fall back to the canonical production domain.
const DEFAULT_SITE_URL = "https://loja.jocril.pt";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  // Normalize: strip trailing slashes so `${getSiteUrl()}/path` never doubles.
  return raw.replace(/\/+$/, "");
}
