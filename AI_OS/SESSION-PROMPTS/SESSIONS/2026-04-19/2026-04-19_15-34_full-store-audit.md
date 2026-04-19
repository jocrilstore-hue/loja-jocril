# Jocril LOJA-ONLINE - Full Store Audit

Date: 2026-04-19 15:34 WEST

Final outcome: guardrail-only
Verification label: unverified

## Executive Summary

This is a source-level route and internal-link inventory only. I did not edit files. I did not do runtime/browser verification because `bun run build` failed immediately with `next: command not found`, so there was no safe verification path beyond source inspection.

The route surface is broadly present, but there are a few clear source-level mismatches:

1. The registration flow links to `/termos` and `/privacidade`, but the actual legal pages live under `/legais/termos` and `/legais/privacidade`.
2. The sitemap page advertises several stale or non-existent paths, including `/politica-privacidade`, `/termos-condicoes`, `/politica-envios`, `/politica-devolucoes`, `/politica-cookies`, `/admin/entrar`, `/admin/escaloes`, `/admin/produtos/variante`, `/nao-encontrado`, and `/erro`.
3. Several CTA-looking buttons are inert or manual-only in source, so they read like navigation but do not navigate.

## Commands Run

- `git status --short --branch` - passed
- `bun --version` - passed, `1.3.12`
- `bun run build` - failed, `next` binary not found
- `date '+%Y-%m-%d %H:%M %Z'` - passed, `2026-04-19 15:34 WEST`

## Environment / Tooling Notes

- Current working directory matched the target repo: `/mnt/c/Users/maria/Desktop/pessoal/jocril/LOJA-ONLINE`
- Workspace is dirty with many unrelated edits already present; I did not touch them.
- Build verification is blocked by missing installed dependencies/tooling in this workspace, not by a code-level TypeScript/Next error.

## Route and Link Inventory Summary

### Public storefront

- Home: `/` from `app/(store)/page.tsx:18-42`
- Catalog: `/produtos` from `components/store/StoreHero.tsx:82-88`, `components/store/FeaturedProducts.tsx:82-85`, `components/store/FooterCTA.tsx:63-68`
- Category browse: `/categorias` from `components/store/CategoriesBlock.tsx:51-61`, `components/store/StoreHeader.tsx:183-195`
- Search: `/pesquisa` and `/pesquisa?q=...` from `app/(store)/pesquisa/page.tsx:8-18` and `app/(store)/pesquisa/pesquisa-client.tsx:51-62`
- PDP: `/produtos/[slug]` from `components/store/ProductCard.tsx:29-32`, `app/(store)/produtos/[slug]/page.tsx:7-15`
- Cart / checkout flow: `/carrinho` from `components/store/StoreHeader.tsx:348-381`, `app/(store)/carrinho/page.tsx:35-63`
- Contact: `/contacto` from `components/store/StoreHeader.tsx:21-25`, `components/store/FooterCTA.tsx:63-68`, `app/(store)/encomenda/[id]/page.tsx:274-282`
- Company/content pages: `/sobre`, `/processos`, `/portfolio`, `/faq` from `components/store/StoreFooter.tsx:25-40`
- Account/auth: `/entrar`, `/conta`, `/encomendas`, `/encomenda/[id]`, `/recuperar-password`, `/confirmar-email`, `/newsletter-confirmado`
- Legal/support: `/legais/envios`, `/legais/devolucoes`, `/legais/termos`, `/legais/privacidade`, `/legais/cookies`

### Admin

- Admin shell nav: `/admin`, `/admin/encomendas`, `/admin/produtos`, `/admin/clientes`, `/admin/escaloes-preco`, `/admin/definicoes/*`, `/admin/login` from `components/admin/AdminShell.tsx:182-448`
- Admin dashboard: `/admin` from `app/admin/page.tsx:54-187`
- Products list/detail/create/variant: `/admin/produtos`, `/admin/produtos/novo`, `/admin/produtos/[id]`, `/admin/produtos/[id]/variante/novo`, `/admin/produtos/[id]/variante/[vid]`
- Orders list/detail: `/admin/encomendas`, `/admin/encomendas/[id]`
- Customers list/detail: `/admin/clientes`, `/admin/clientes/[id]`
- Settings hub and subpages: `/admin/definicoes`, `/admin/definicoes/envios`, `/admin/definicoes/descontos`, `/admin/definicoes/equipa`, `/admin/definicoes/escaloes`, `/admin/definicoes/impostos`
- Admin library/showcase: `/admin/componentes`, `/admin/emails`, `/admin/escaloes-preco`

### API routes that matter to navigation and transaction flows

- `/api/products/search`
- `/api/orders`
- `/api/orders/[orderNumber]/status`
- `/api/payment/multibanco`
- `/api/payment/mbway`
- `/api/contact`
- `/api/webhooks/eupago`
- `/api/admin/stats`
- `/api/admin/orders`
- `/api/admin/orders/[id]`
- `/api/admin/customers`
- `/api/admin/customers/[id]`
- `/api/admin/products`
- `/api/admin/products/[id]`
- `/api/admin/products/[id]/variants`
- `/api/admin/products/[id]/variants/[variantId]`
- `/api/admin/settings/shipping`

## Broken / Blocked Internal Targets

### P1

1. Legal consent links in registration point to missing routes.
   - Evidence: `app/(store)/entrar/page.tsx:190-194` links to `/termos` and `/privacidade`.
   - Actual legal pages exist at `app/(store)/legais/termos/page.tsx:1-120` and `app/(store)/legais/privacidade/page.tsx:1-120`.
   - Impact: the registration flow exposes dead legal targets at the moment users are asked to accept them.

### P2

2. Sitemap/internal index contains multiple stale paths that do not match the current route tree.
   - Evidence: `app/(store)/sitemap/page.tsx:6-65`.
   - Examples of stale targets: `/politica-privacidade`, `/termos-condicoes`, `/politica-envios`, `/politica-devolucoes`, `/politica-cookies`, `/admin/entrar`, `/admin/escaloes`, `/admin/produtos/variante`, `/nao-encontrado`, `/erro`.
   - Actual paths in the app differ: `/legais/*`, `/admin/login`, `/admin/escaloes-preco`, and Next special files for `error` / `not-found`.

3. Several CTA-style controls are source-level no-ops and read like navigation even though they do not route anywhere.
   - Evidence:
     - `app/(store)/sobre/page.tsx:81-87` - `Pedir orçamento →` is a button with no `href` or `onClick`.
     - `app/(store)/processos/page.tsx:119-122` - `Pedir orçamento →` / `Ver casos de uso` are inert buttons.
     - `app/(store)/faq/page.tsx:77-80` - `Contactar-nos` is inert.
     - `app/(store)/pesquisa/pesquisa-client.tsx:180-215` - `Ver categoria →` / `Pedir orçamento →` are inert.
     - `app/(store)/conta/page.tsx:112-113` - `Terminar sessão` is present but not wired.
     - `app/admin/clientes/[id]/cliente-detail-client.tsx:107-108` and `app/admin/encomendas/[id]/page.tsx:206-207` - `Ver todas →` / `Ver perfil do cliente →` are anchors without destinations.
   - Impact: these are visually navigational but functionally manual-only.

## Dynamic Links Needing Sample Data

- `/produtos/[slug]` from `components/store/ProductCard.tsx:29-32` and `app/(store)/produtos/[slug]/page.tsx:7-15`
  - sample slug comes from product data or DB `url_slug`
- `/produtos?cat=${slug}` from `app/(store)/page.tsx:24-33` and `app/(store)/categorias/page.tsx:91-100`
  - needs real category slugs such as `acrilicos-chao`
- `/encomenda/${order_number}` from `app/(store)/conta/page.tsx:146-159`, `app/(store)/conta/page.tsx:226-237`, `app/(store)/encomendas/page.tsx:118-135`
  - needs sample order numbers from real data
- `/admin/produtos/${sku-or-id}` from `app/admin/produtos/page.tsx:289-300`
- `/admin/clientes/${id}` from `app/admin/clientes/page.tsx:174-184`
- `/admin/encomendas/${order_number}` from `app/admin/encomendas/page.tsx:225-233`
- `/admin/produtos/${productId}/variants/${variantId}` and `/admin/produtos/${productId}/variants` from `components/admin/VariantFormPage.tsx:123-162`
- `/entrar?redirect_url=...` from `lib/auth/admin.ts:33-44`, `app/admin/login/page.tsx:1-5`, and `app/(store)/entrar/page.tsx:37-40`

## Auth-Gated Links

- Admin access link only appears for signed-in users who satisfy the admin check in `components/store/StoreHeader.tsx:469-640`.
- Admin gating is enforced server-side by `lib/auth/admin.ts:13-44`.
- `app/admin/login/page.tsx:1-5` immediately redirects to `/entrar?redirect_url=/admin`.
- `app/(store)/conta/encomenda/[id]/page.tsx:1-9` redirects to the public order detail route.
- `app/(store)/encomenda/[id]/page.tsx:95-149` checks auth and order ownership before exposing the full record.
- `app/(store)/encomendas/page.tsx:49-77` is auth-aware and only loads customer orders when a Clerk user is present.

## External Links

- `https://jocril.pt` in `components/store/StoreHeader.tsx:70-77` and `components/store/FooterCTA.tsx:63-68`
- `mailto:dpo@jocril.pt` in `components/legal/LegalPage.tsx:216-223`
- `mailto:geral@jocril.pt` and `mailto:${data.customerEmail}` in `lib/email/send.ts:36-36`, `lib/email/send.ts:82-82`, `lib/email/send.ts:115-115`
- `https://tile.openstreetmap.org/...` background image in `app/(store)/contacto/page.tsx:156-163`

## Control Matrix

- Works in source: PLP filters, sort, density toggle, clear/reset, cart quantity stepper, checkout validation, checkout payment choice, admin list filters, admin sort/pagination, settings toggles, admin status update select.
- Works with caveat: several flows are data-dependent and need sample DB rows/orders to confirm route targets.
- Disabled honestly: checkout `card` and `wire` options are explicitly blocked in `app/(store)/carrinho/page.tsx:92-99`.
- Visual-only / manual-only: the inert CTAs and anchors listed above.
- Blocked by auth/data/external service: admin pages, order detail ownership checks, payment and contact API paths, and EuPago webhook handling.

## Storefront Functional Completeness

- Discovery: present at source level.
- Cart: present at source level, including quantity/update/remove and checkout submission.
- Checkout: present at source level with MBWay and Multibanco only.
- Orders: present at source level for `/encomendas` and `/encomenda/[id]`.
- Legal/support: present, but the registration flow points at the wrong legal route namespace.
- Runtime proof: not available in this session.

## Admin Functional Completeness

- Product list, product edit/create, variant create/edit, order list/detail, customer list/detail, settings hub, emails, and component showcase are all present at source level.
- Some actions are still buttons without actual navigation or persistence.
- Runtime proof: not available in this session.

## Backend / API / Schema Readiness

- Source points to Supabase RPCs and tables for search, orders, customers, products, shipping, stats, and checkout.
- EuPago payment and webhook routes are present.
- I did not verify the RPCs/migrations at runtime because the build path was blocked.

## Payment / Email / Webhook Readiness

- Multibanco and MBWay checkout routes are wired in source.
- Contact form POST is wired to `/api/contact`.
- Order confirmation / admin notification / payment received email paths exist in `lib/email/send.ts` and webhook handling exists in `app/api/webhooks/eupago/route.ts`.
- Runtime verification not attempted because the build did not complete.

## Mobile / Browser / Runtime Findings

- No browser verification was performed.
- No console or network evidence was collected.
- Build verification was blocked by the missing `next` executable.

## Mock / Static / Visual-Only Remnants

- `app/(store)/sobre/page.tsx:86-87` and `app/(store)/processos/page.tsx:119-122` use CTA buttons without destinations.
- `app/(store)/faq/page.tsx:79-80` uses an inert support button.
- `app/(store)/pesquisa/pesquisa-client.tsx:181-215` uses inert buttons for category and quote actions.
- `app/(store)/conta/page.tsx:112-113` has a logout button with no handler.
- `app/admin/clientes/[id]/cliente-detail-client.tsx:107-108` and `app/admin/encomendas/[id]/page.tsx:206-207` have label-only anchors.

## Findings by Severity

### P1

1. Broken legal consent targets in sign-up flow - `app/(store)/entrar/page.tsx:190-194`

### P2

1. Stale sitemap / route index entries - `app/(store)/sitemap/page.tsx:6-65`
2. Multiple navigational CTAs are inert or manual-only - `app/(store)/sobre/page.tsx:81-87`, `app/(store)/processos/page.tsx:119-122`, `app/(store)/faq/page.tsx:77-80`, `app/(store)/pesquisa/pesquisa-client.tsx:180-215`, `app/(store)/conta/page.tsx:112-113`, `app/admin/clientes/[id]/cliente-detail-client.tsx:107-108`, `app/admin/encomendas/[id]/page.tsx:206-207`

### P3

1. External-support and compliance affordances are text/button based rather than linked in-place - `app/(store)/contacto/page.tsx:141-145`, `app/(store)/faq/page.tsx:50-52`
2. Admin component showcase includes demo-only controls by design - `app/admin/componentes/page.tsx:156-216`
3. Search and PDP back-navigation rely on local state / history rather than explicit routes - `app/(store)/pesquisa/pesquisa-client.tsx:42-74`, `app/(store)/produtos/[slug]/pdp-client.tsx:68-73`

## Fully Functional Launch Gap List

1. Fix the legal route namespace mismatch in the sign-up flow.
2. Replace stale sitemap targets with actual current routes or remove them.
3. Either wire or relabel inert CTA controls so they do not look like dead navigation.
4. Confirm the admin path aliases, especially `/admin/login` vs `/admin/entrar` and `/admin/escaloes-preco` vs `/admin/escaloes`.
5. Re-run build verification once `next` is available in the workspace.

## Manual Launch Actions

- Confirm `ADMIN_EMAILS` and `NEXT_PUBLIC_ADMIN_EMAILS` are aligned before launch.
- Confirm Clerk redirect URLs for `/entrar?redirect_url=/admin` and `/sso-callback`.
- Confirm Supabase RPCs and payment/webhook secrets are present in the deployment environment.
- Confirm the real legal route namespace and update the sign-up copy accordingly.

## Open Questions

- Should the legal routes stay under `/legais/*`, or should the site also expose root aliases like `/termos` and `/privacidade`?
- Are `/admin/entrar` and `/admin/escaloes` meant to be legacy aliases, or should the sitemap be rewritten to current paths?
- Should the inert CTAs be wired, removed, or relabeled as non-navigational actions?

## Evidence Appendix

- `git status --short --branch` showed a dirty worktree with many pre-existing modifications; I did not revert any of them.
- `bun --version` returned `1.3.12`.
- `bun run build` failed with `next: command not found`.
- Route and link evidence came from source files only, notably:
  - `components/store/StoreHeader.tsx`
  - `components/store/StoreFooter.tsx`
  - `components/store/ProductCard.tsx`
  - `components/store/CategoriesBlock.tsx`
  - `components/store/FeaturedProducts.tsx`
  - `components/store/FooterCTA.tsx`
  - `components/admin/AdminShell.tsx`
  - `components/admin/SettingsHelpers.tsx`
  - `components/admin/ProductFormPage.tsx`
  - `components/admin/VariantFormPage.tsx`
  - `components/legal/LegalPage.tsx`
  - `app/(store)/page.tsx`
  - `app/(store)/produtos/page.tsx`
  - `app/(store)/produtos/[slug]/page.tsx`
  - `app/(store)/produtos/[slug]/pdp-client.tsx`
  - `app/(store)/pesquisa/page.tsx`
  - `app/(store)/pesquisa/pesquisa-client.tsx`
  - `app/(store)/categorias/page.tsx`
  - `app/(store)/carrinho/page.tsx`
  - `app/(store)/entrar/page.tsx`
  - `app/(store)/conta/page.tsx`
  - `app/(store)/encomenda/[id]/page.tsx`
  - `app/(store)/encomendas/page.tsx`
  - `app/(store)/recuperar-password/page.tsx`
  - `app/(store)/contacto/page.tsx`
  - `app/(store)/sitemap/page.tsx`
  - `app/(store)/legais/*/page.tsx`
  - `app/admin/*`
  - `lib/auth/admin.ts`
  - `lib/queries/products.ts`
  - `lib/queries/pdp.ts`
  - `app/api/*`
