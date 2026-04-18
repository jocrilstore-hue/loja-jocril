# M5 Handoff — Jocril LOJA-ONLINE
**Date:** 2026-04-18  
**Branch:** feature/jocril-port  
**Milestone:** M5 — Integration & Polish

---

## Goal
Finish-line pass: links, responsive, theme, metadata, sitemap, robots, build, Lighthouse, A11y quick wins.

---

## Completed

### 1. Link audit
- Grepped all `.html` hrefs — zero found. All navigation uses `next/link` with Portuguese paths.

### 2. Responsive audit
- **Root cause found and fixed:** React renders inline styles as `property:value` (no space after colon). All CSS attribute selectors in `store-responsive.css` used `"property: value"` (with space) — silently failing.
- Added comprehensive patch block at end of `public/styles/store-responsive.css`:
  - Grid collapse selectors with no-space format
  - Footer tag selectors (footer != section)
  - `1.4fr repeat(4, 1fr)` footer grid variant
  - Cascade order corrected (mobile 640px block after tablet 1024px block)
- Verified: home page `scrollWidth ≤ innerWidth` at 510px — zero horizontal overflow.

### 3. Theme audit
- Confirmed `data-theme="dark"` on `<html>` root, all CSS custom properties resolve correctly.

### 4. Portuguese QA
- Strings preserved verbatim. No untranslated text found.

### 5. Metadata
- `app/layout.tsx`: added `title.template: '%s | Jocril'`, `title.default: 'Jocril — Loja Online'`, favicon icons, LCP preload.
- `app/(store)/page.tsx`: `title: { absolute: 'Jocril — Loja Online' }` (bypasses template for home).
- `app/(store)/sobre/page.tsx`: segment metadata added.
- **8 segment `layout.tsx` files** created (server components wrapping 'use client' pages) for:
  - produtos, contacto, portfolio, processos, faq, carrinho, pesquisa, categorias

### 6. Sitemap
- `app/sitemap.ts` — 13 storefront routes, proper priorities and changeFrequency.

### 7. Robots
- `app/robots.ts` — disallows: /admin/, /conta/, /carrinho/, /entrar/, /pesquisa/, /recuperar-password/, /confirmar-email/, /newsletter-confirmado/

### 8. Image optimization — DEFERRED
- `next/image` conversion explicitly deferred by user. Background-image CSS on sized divs is correct for the faithful-port philosophy. Revisit when Supabase wiring reshapes the data-fetch layer.

### 9. Build
- `npm run build` — clean, 41 routes, zero TypeScript errors.

### 10. Lighthouse
| Page | Perf | A11y | SEO | LCP |
|------|------|------|-----|-----|
| Home | 79 | 96 | 100 | 5.2s |
| PDP | 65 | 85→91* | 100 | 8.2s |
| Admin | 87 | 95 | 100 | 4.1s |

*A11y improved after M5 A11y fixes (below). Perf bottleneck on store pages is background-image LCP — unfixable without next/image (deferred).

### 11. A11y quick wins (PDP)
Fixed in `app/(store)/produtos/[slug]/page.tsx`:
- `button-name` (5): Added `aria-label={`Ver imagem ${i + 1}`}` to 5 thumbnail buttons in Gallery
- `heading-order` (1): Changed "Da mesma família" from `h3` → `h2`
- `label` (1): Added `aria-label="Quantidade"` to qty stepper input

Remaining A11y: `color-contrast` (55 elements) — design system issue, deferred. Requires design token changes.

---

## Files Modified / Created

| File | Change |
|------|--------|
| `app/layout.tsx` | metadata template + favicon + LCP preload |
| `app/(store)/page.tsx` | metadata absolute title |
| `app/(store)/sobre/page.tsx` | metadata |
| `app/(store)/produtos/layout.tsx` | NEW — segment metadata |
| `app/(store)/contacto/layout.tsx` | NEW — segment metadata |
| `app/(store)/portfolio/layout.tsx` | NEW — segment metadata |
| `app/(store)/processos/layout.tsx` | NEW — segment metadata |
| `app/(store)/faq/layout.tsx` | NEW — segment metadata |
| `app/(store)/carrinho/layout.tsx` | NEW — segment metadata |
| `app/(store)/pesquisa/layout.tsx` | NEW — segment metadata |
| `app/(store)/categorias/layout.tsx` | NEW — segment metadata |
| `app/sitemap.ts` | NEW — 13 routes |
| `app/robots.ts` | NEW — crawler rules |
| `public/styles/store-responsive.css` | responsive patch — React no-space format |
| `app/(store)/produtos/[slug]/page.tsx` | A11y: aria-label + h2 + input label |

---

## Must NOT Be Broken
- Build: `npm run build` must stay clean at 41 routes
- Responsive: home page no horizontal overflow at 375/510/768px
- Metadata: each page renders correct `<title>` tag
- Sitemap: `/sitemap.xml` returns valid XML
- Robots: `/robots.txt` disallows admin routes

---

## Next Step (M6 — Supabase Integration)
Per `plans/write-down-a-plan-quiet-ember.md` §6:
1. Wire real product data from Supabase (PLP + PDP)
2. Auth flow (login, conta, session)
3. Cart + checkout (Stripe or MBWay)
4. Admin CRUD (produtos, encomendas)
5. At that point: revisit `next/image` conversion (deferred from M5)

## Deferred Items (carry forward)
- `next/image` conversion — requires Supabase wiring to be done first
- Color contrast A11y (55 elements) — design token decision needed
- Real search (pesquisa) — currently mock UI
- Payment integration
- Email transactional flows
