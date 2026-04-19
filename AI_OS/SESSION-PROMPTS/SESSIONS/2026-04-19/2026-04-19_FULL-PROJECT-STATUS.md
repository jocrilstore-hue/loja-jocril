# Jocril LOJA-ONLINE — Full Project Status
**Date:** 2026-04-19 | **Branch:** main @ b393197 | **Build:** 48 routes, 0 errors, Bun 1.3.6
**Live:** https://loja-jocril-qcma.vercel.app | **Repo:** https://github.com/jocrilstore-hue/loja-jocril.git

---

## What was built (all sessions)

### Infrastructure
- Next.js 16.2.3, React 19, TypeScript strict, Turbopack, Bun
- CSS custom properties design system (`public/styles/colors_and_type.css`)
- Geist Sans + Geist Mono self-hosted fonts
- Supabase: `createClient()` (server/client), `createAdminClient()` (service role)
- Clerk: `useUser()`, `auth()`, `currentUser()`, middleware, `getAdminContext()`
- Eupago: MB Way + Multibanco via `lib/payments/eupago.ts`
- Resend: `lib/email/send.ts` (3 email types)
- Cart: localStorage context (`CartContext`)
- Deployed to Vercel, GitHub connected

---

## Storefront routes — status

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ Live | Featured products + categories from Supabase |
| `/produtos` | ⚠️ Partial | Products load from Supabase; **filters + sort don't work** (state not applied to array) |
| `/produtos/[slug]` | ✅ Live | PDP from Supabase, add to cart works |
| `/categorias` | ✅ Live | From Supabase |
| `/carrinho` | ✅ Live | Cart + checkout step 1-3, MB Way polling, Multibanco panel |
| `/pesquisa` | ❌ Mock | Hardcoded `RESULTS[]` — RPC exists, not wired |
| `/conta` | ⚠️ Partial | Profile = real Clerk; orders tab = **hardcoded mock `ORDERS[]`** |
| `/encomendas` | ✅ Live | Server component, real Supabase data |
| `/encomenda/[id]` | ✅ Live | Full order detail, Multibanco pending block |
| `/conta/encomenda/[id]` | ⚠️ Old route | Existed before B5 — may conflict with `/encomenda/[id]`, review |
| `/entrar` | ✅ Live | Clerk sign-in (PT URL) |
| `/recuperar-password` | ✅ Live | Clerk password reset |
| `/confirmar-email` | ✅ Live | Clerk email confirmation |
| `/newsletter-confirmado` | ✅ Static | No backend needed |
| `/faq` | ✅ Static | |
| `/sobre` | ✅ Static | |
| `/processos` | ✅ Static | |
| `/portfolio` | ✅ Static | |
| `/contacto` | ✅ Static | No form submission backend |
| `/sitemap` | ✅ Static | |
| `/legais/*` (5 routes) | ✅ Static | |
| `/manutencao` | ✅ Static | |

---

## Admin routes — status

| Route | Status | Notes |
|-------|--------|-------|
| `/admin` (dashboard) | ❌ Mock | No API, hardcoded stats |
| `/admin/login` | ✅ Live | Clerk |
| `/admin/produtos` | ✅ Live | Wired to Supabase; **pagination static** |
| `/admin/produtos/novo` | ✅ Live | Creates via `POST /api/admin/products` |
| `/admin/produtos/[id]` | ✅ Live | Edit via `PATCH /api/admin/products/[id]` |
| `/admin/produtos/[id]/variante/novo` | ✅ Live | Creates via POST variants endpoint |
| `/admin/produtos/[id]/variante/[vid]` | ✅ Live | Edit via PATCH variants endpoint |
| `/admin/encomendas` | ✅ Live | Wired to Supabase |
| `/admin/encomendas/[id]` | ✅ Live | Status update wired; **bulk actions on list page not wired** |
| `/admin/clientes` | ❌ Mock | No `GET /api/admin/customers` endpoint exists |
| `/admin/clientes/[id]` | ❌ Mock | No API |
| `/admin/escaloes-preco` | ❌ Mock | No API |
| `/admin/emails` | ❌ Mock | No API |
| `/admin/definicoes/*` (6 routes) | ❌ Mock | All static |
| `/admin/componentes` | ✅ Static | UI library, by design |

---

## API routes — status

| Endpoint | Status | Notes |
|----------|--------|-------|
| `POST /api/orders` | ✅ Live | Creates order, triggers Eupago, fires emails |
| `GET /api/orders/[orderNumber]/status` | ✅ Live | MB Way polling |
| `POST /api/payment/mbway` | ✅ Live | Eupago MB Way |
| `POST /api/payment/multibanco` | ✅ Live | Eupago Multibanco |
| `POST /api/webhooks/eupago` | ✅ Live | Payment confirm + emails; **webhook URL not yet registered in Eupago** |
| `GET /api/admin/products` | ✅ Live | |
| `POST /api/admin/products` | ✅ Live | |
| `PATCH /api/admin/products/[id]` | ✅ Live | |
| `DELETE /api/admin/products/[id]` | ✅ Live | Soft-delete |
| `POST /api/admin/products/[id]/variants` | ✅ Live | |
| `PATCH /api/admin/products/[id]/variants/[variantId]` | ✅ Live | |
| `DELETE /api/admin/products/[id]/variants/[variantId]` | ✅ Live | Soft-delete |
| `GET /api/admin/orders` | ✅ Live | |
| `PATCH /api/admin/orders/[id]` | ✅ Live | Status update |
| `GET /api/admin/customers` | ❌ Missing | Needed for /admin/clientes |
| `GET /api/admin/stats` | ❌ Missing | Needed for admin dashboard |

---

## Known gaps — prioritised

### 🔴 Must fix before launch

**1. PLP filters + sort broken** — `app/(store)/produtos/produtos-client.tsx`
Filter checkboxes and sort dropdown update state but the state is never applied to the `products` array. Customers see all products regardless of what they select.
Fix: add `useMemo` that filters `products` by `activeMaterials`, `activeDims`, `activeCors`, `activeStock` and sorts by `sort` value.

**2. NIF not saved to DB** — `app/(store)/carrinho/page.tsx`
NIF (número de contribuinte) field exists in checkout form. Portuguese law requires storing it for B2B invoicing. Verify whether `nif` is in the `orders` table and passed through the `create_order` RPC. Almost certainly not — needs a DB column + RPC update + checkout payload update.

**3. Eupago webhook not registered** — manual step, Monday
Until done: all MB Way / Multibanco payment confirmations are silent. Orders are created but never marked paid automatically.
URL to register: `https://loja-jocril-qcma.vercel.app/api/webhooks/eupago`

### 🟡 High priority (customer-facing)

**4. `/conta` orders tab still mock**
`app/(store)/conta/page.tsx` lines 11, 105, 175, 181 — hardcoded `ORDERS[]`.
Fix: fetch `GET /api/orders` (already exists), replace mock array. The separate `/encomendas` page is already real.

**5. `/pesquisa` results are mock**
`app/(store)/pesquisa/page.tsx` — hardcoded `RESULTS[]`.
Fix: wire `searchParams.q` to the `search_products` Supabase RPC (already used in the header).

**6. Product images in admin list hardcoded**
`app/admin/produtos/page.tsx` `mapProduct()` line 51 — all products show the same `/assets/portfolio/carm-premium.avif`.
Fix: verify `product_templates` has `main_image_url` column, wire it.

### 🟠 Operational (admin tooling)

**7. Admin dashboard is static**
`/admin` shows hardcoded numbers. Needs `GET /api/admin/stats` aggregating order counts, revenue, low-stock alerts.

**8. Admin `/clientes` is mock**
No `GET /api/admin/customers` endpoint. Page has no live data.

**9. Admin products pagination is static**
`app/admin/produtos/page.tsx` — hardcoded page buttons. Fix: add `page` state, slice `filtered`.

**10. Admin bulk actions not wired**
Publicar / Despublicar / Duplicar / Arquivar buttons in the products selection bar have no `onClick` handlers.

### ℹ️ Minor

**11. `/contacto` form has no backend** — form inputs exist but no submission handler or email/DB target.

**12. Promo codes field in checkout has no backend** — input exists in step 2, nothing validates it.

**13. `/conta` profile edit not wired** — `{/* TODO: B5b */}` — form for editing name/address not connected to Clerk.

**14. `/conta/encomenda/[id]` vs `/encomenda/[id]`** — two overlapping routes. Review whether the old nested one can be removed.

**15. Admin definicoes/* (6 routes)** — all static. Shipping zones, tax rates, discount tiers, team management — no APIs.

---

## Env vars required in Vercel

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
EUPAGO_API_KEY
NEXT_PUBLIC_SITE_URL          → https://loja-jocril-qcma.vercel.app
RESEND_API_KEY
EMAIL_FROM                    → e.g. noreply@jocril.pt
ADMIN_EMAIL                   → order notification recipient
```

---

## DB tables in use

| Table | Used by |
|-------|---------|
| `product_templates` | PLP, PDP, admin products |
| `product_variants` | PDP add-to-cart, admin variants |
| `categories` | PLP filter, admin products |
| `orders` | Checkout, /encomendas, admin orders |
| `order_items` | /encomenda/[id], admin order detail |
| `customers` | /encomendas, order creation |

---

## Session commit log

```
b393197  docs: session-end handoff + full audit
a45171f  chore: migrate from npm to Bun
63b5371  B5+B6+B7: customer account, admin mutations, transactional emails
fbb624d  B4b: checkout UI wired — MB Way polling, Multibanco panel
3cf2e63  B4a: Eupago backend + order API — 5 routes, zod, webhook
efa74a0  B3: cart state — localStorage context + PDP add + /carrinho live
1f7ff8a  B2: Clerk auth wired — headless hooks on PT URLs
a9024e2  docs: B1 complete handoff — storefront read-path live
[earlier] M0–M5: scaffold, design port, admin spine, legal pages
```
