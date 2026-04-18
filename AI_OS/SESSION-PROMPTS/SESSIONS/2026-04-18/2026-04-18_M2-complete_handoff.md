# M2 Complete Handoff — 2026-04-18

## Goal
Port all storefront pages (M2a shopping spine, M2b account spine, M2c content spine) from prototype JSX to Next.js 16 TSX. Faithful 1:1 port, inline styles, CSS custom properties, Portuguese strings preserved.

## Completed

### M2a — Shopping spine (commit: prior session)
- `app/(store)/produtos/[slug]/page.tsx` — PDP, full client component
- `app/(store)/carrinho/page.tsx` — Cart + checkout flow
- `app/(store)/pesquisa/page.tsx` — Search with filter/scope tabs

### M2b — Account spine (commit: prior session)
- `app/(store)/conta/page.tsx` — 5-tab account dashboard
- `app/(store)/conta/encomenda/[id]/page.tsx` — Order detail with timeline
- `app/(store)/entrar/page.tsx` — Login/register split-screen
- `app/(store)/recuperar-password/page.tsx` — Password reset 3-stage flow
- `app/(store)/confirmar-email/page.tsx` — Email verification with cooldown
- `app/(store)/newsletter-confirmado/page.tsx` — Newsletter confirmed (server)

### M2c — Content spine (commit: 91702ac)
- `app/(store)/categorias/page.tsx` — Category hub, 3 groups × 3 cards, hover effects
- `app/(store)/sobre/page.tsx` — About page, server component, stats + alternating process rows
- `app/(store)/processos/page.tsx` — Processes deep-dive, sticky tab nav, spec tables
- `app/(store)/portfolio/page.tsx` — Portfolio grid, 12-col masonry, sector filter
- `app/(store)/faq/page.tsx` — FAQ with left-rail nav + accordion
- `app/(store)/contacto/page.tsx` — Contact form + map tile + info block
- `app/(store)/sitemap/page.tsx` — Design handoff sitemap with real Next.js routes

## Build state
`npm run build` → **clean, 18 routes**, 0 TypeScript errors, 0 warnings.

Route list:
```
/ ○  /carrinho ○  /categorias ○  /confirmar-email ○  /conta ○
/conta/encomenda/[id] ƒ  /contacto ○  /entrar ○  /faq ○
/newsletter-confirmado ○  /pesquisa ○  /portfolio ○  /processos ○
/produtos ○  /produtos/[slug] ƒ  /recuperar-password ○  /sitemap ○  /sobre ○
```

## Must NOT break
- All 18 routes compile and render
- `npm run build` passes clean
- Inline styles preserved (no Tailwind conversion)
- CSS custom properties: `var(--color-*)`, `var(--font-geist-*)`
- Portuguese copy verbatim
- `'use client'` on: Categorias, Processos, Portfolio, FAQ, Contacto, Sitemap, Conta, Entrar, RecuperarPassword, ConfirmarEmail, Carrinho, Pesquisa, Produtos[slug]
- Server components: Sobre, NewsletterConfirmado, OrderDetail (no useState)

## Port conventions locked in
- `../../assets/` → `/assets/`
- `<a onClick>` → `<button>` (accessibility)
- `<a href="...html">` → `<Link href="/pt-route">`
- Button `variant="primary"` → maps to `solid`, `variant="secondary"` → maps to `outline` (Button.tsx handles this)
- Data arrays at module level (not inside component) to avoid re-creation
- Explicit TypeScript union types for discriminated string fields (e.g. `ProjSize`, `Stage`, `Status`)
- `Array.find()!` with non-null assertion when initial state guarantees a match
- `Math.random()` forbidden — static mock data only

## Shared components (do not touch without reading)
- `components/store/Button.tsx` — variants: solid, outline, pill, ghost, primary(→solid), secondary(→outline); accepts `href` prop
- `components/store/Badge.tsx` — size: xs, sm, md
- `components/store/FooterCTA.tsx` — standalone section, included AFTER `</main>` in pages that need it
- `components/store/ProductCard.tsx` — exports ProductMock type, STOCK_MAP, default ProductCard
- `app/(store)/layout.tsx` — wraps all (store) pages with StoreThemeProvider + StoreHeader + StoreFooter; pages must NOT re-add these

## Next step — M3: Admin spine
See `prompt-M3-admin.md` for the full session prompt.

Admin pages to port:
- `app/(admin)/layout.tsx` — AdminShell wrapper
- `app/(admin)/entrar/page.tsx` — Admin login
- `app/(admin)/page.tsx` — Dashboard
- `app/(admin)/encomendas/page.tsx` — Orders list
- `app/(admin)/encomendas/[id]/page.tsx` — Order detail
- `app/(admin)/produtos/page.tsx` — Products list
- `app/(admin)/produtos/novo/page.tsx` — Product form
- `app/(admin)/produtos/variante/page.tsx` — Variant form
- `app/(admin)/escaloes/page.tsx` — Price tiers
- `app/(admin)/clientes/page.tsx` — Customers
- `app/(admin)/clientes/[id]/page.tsx` — Customer detail
- `app/(admin)/definicoes/*` — Settings hub + 6 sub-pages
- `app/(admin)/componentes/page.tsx` — Component showcase
- `app/(admin)/emails/page.tsx` — Email templates gallery

## Open questions
- None blocking M3.
- Legal pages (M4) and integration (M5) remain after admin.
