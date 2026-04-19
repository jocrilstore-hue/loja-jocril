# Handoff — M2 partial (home page done)

**Date:** 2026-04-18
**Branch:** `feature/jocril-port` @ `7b572a4`
**Status:** ⏳ Partial — home page done, 16 storefront pages remaining.

## Completed in this session

- `app/(store)/layout.tsx` — wraps `StoreThemeProvider + StoreHeader + StoreFooter`
- `app/(store)/page.tsx` — **home** (at `/`) composing StoreHero, CategoriesBlock, FeaturedProducts, ProcessesStrip, FooterCTA
- `components/store/StoreHero.tsx` — hero with Expositor A3 tile
- `components/store/CategoriesBlock.tsx` — 6 dashed category cards
- `components/store/ProcessesStrip.tsx` — 4 process cards
- `components/store/FeaturedProducts.tsx` — 8 product cards + category filter

All verified with `npm run build`. Home page fully renders.

## Verified pattern (copy for remaining pages)

Every storefront page follows:
1. File lives inside `app/(store)/.../page.tsx` to inherit the store layout.
2. Top of file: `import` prototype-specific components from `@/components/store/...` and/or inline mock data.
3. Return `<main id="main">...</main>` wrapping the page content.
4. `'use client'` only if the page itself uses hooks (most don't — home doesn't).
5. Portuguese verbatim, hrefs → PT Next.js routes.

## Remaining M2 pages (16) — see prompt file

`AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/prompt-M2-continuation.md`

Splits into:
- **M2a** shopping spine (5): PLP, PDP, Cart, Search, plus home ✅
- **M2b** account spine (6): Conta, OrderDetail, Login, PasswordReset, ConfirmarEmail, NewsletterConfirmado
- **M2c** content spine (7): Categorias, Sobre, Processos, Portfolio, FAQ, Contacto, Sitemap

## What must NOT regress

- `app/(store)/layout.tsx` wraps ALL storefront pages — do not wrap individual pages with StoreHeader/StoreFooter again.
- `app/page.tsx` was moved to `app/(store)/page.tsx`. Do NOT create a new `app/page.tsx` — that would conflict.
- Home is currently at `/` via the `(store)` route group. The layout at `app/layout.tsx` is the html/body shell; `app/(store)/layout.tsx` adds the store chrome.

## Next step

Paste `prompt-M2-continuation.md` into a fresh Claude Code session to continue porting pages.
