# Handoff — B1 complete: storefront read-path fully live

**Date:** 2026-04-19
**Branch:** `main`
**Commits in this session:** B1d+B1e, B1c, B1b (+ handoff)

---

## What shipped today

All storefront read pages now serve live Supabase data through adapters:

| Page | Wired via | Runtime check |
|---|---|---|
| `/` homepage featured | `listFeaturedProducts(8)` → FeaturedProducts prop | real products render |
| `/` homepage categories | `listCategoriesWithCounts()` + `CATEGORY_META` → CategoriesBlock prop | 6 DB cats (sliced) |
| `/categorias` | `listCategoriesWithCounts()` + GROUP_ORDER | 3 groups, 6 cats, 183 total refs |
| `/produtos` | `listProducts()` + follow-up join (sku, material) | 100 products render, SKUs like `J-T4P3FK` |
| `/produtos?cat=<slug>` | `getCategoryBySlug` → filtered `listProducts` | 4 products for `acrilicos-chao` |
| `/produtos/[slug]` | `getPDPBySlug` (5-query fetch) | real name, prices, 4 related links |

---

## Architecture snapshot

```
app/(store)/
├── page.tsx                     [server] fetches featured + categories
├── categorias/page.tsx          [server] groups DB cats by slug→meta map
├── produtos/
│   ├── page.tsx                 [server] PLP wrapper
│   ├── produtos-client.tsx      [client] filter UI, renders ProductCard[]
│   └── [slug]/
│       ├── page.tsx             [server] PDP wrapper
│       └── pdp-client.tsx       [client] gallery, variant selectors, tiers

lib/
├── adapters/
│   └── product-adapter.ts       DB→UI shape: mapStockStatus, toUIProductFromSearch, toUIProductFromVariant
├── data/
│   └── category-groups.ts       slug → {group, img, desc}; GROUP_ORDER
├── queries/
│   ├── products.ts              listProducts, listFeaturedProducts, listCategories(WithCounts), getCategoryBySlug
│   └── pdp.ts                   getPDPBySlug (5-query fetch, composes PDPProduct)
└── supabase/
    ├── server.ts, client.ts, admin.ts
```

---

## Key decisions locked

1. **Adapter pattern** (not rewriting UI types) — honoured everywhere.
2. **Clerk deferred** (B2) — no auth work yet.
3. **Same prod Supabase** — new project reads from the same DB as the old store.
4. **Hardcoded slug→group map** (`lib/data/category-groups.ts`) — not a DB column.
5. **search_products RPC gap solved via follow-up join** — RPC only returns `variant_id, template_name, size_name, category_name, base_price_including_vat, main_image_url, url_slug, stock_status, relevance_score`. We do a second `product_variants → materials` select keyed on variant_ids to fill sku + material.

---

## What MUST NOT be broken

- Inline style port philosophy — no shadcn, no form libs introduced.
- `/` homepage hero, processes strip, footer CTA — untouched.
- Admin routes still work on mock data (not yet wired).
- Dark/light theme, responsive, Portuguese copy — untouched.
- Old store at `SITES/loja-jocril` continues to run on same DB.

---

## Gotchas discovered

- **`categories.image_url` doesn't exist** — dropped from selects. Images now come from CATEGORY_META only.
- **`variant.url_slug` is the canonical PDP key** — not template slug.
- **DB has no color dimension** — `product.variants.color` is always `[]`. The UI renders an empty swatch row, no crash.
- **Price tier column names** — `price_tiers` table uses `price_per_unit` and `discount_percentage` (not `unit` and `discount` as the mock had). Adapter remaps.
- **Stock label enum** in DB: `in_stock`, `low_stock`, `made_to_order` → mapped to UI `'in' | 'low' | 'made'`.
- **Dev server zombie port 3000** — if `npm run dev` says "Another next dev server is already running," kill the PID it reports with `taskkill /PID <pid> /F` before restarting. Happened twice this session.

---

## What's deferred (next sessions)

### Storefront polish (low priority)
- Filter sidebar on PLP (materials, dims, colors, rating) — currently visual-only, not wired to URL params.
- Real product count in PLP header stats (currently shows `products.length` / `totalInCategory` — no real per-category aggregation yet beyond category products).
- `/pesquisa` search page — not wired.
- SEO `generateMetadata` per dynamic route (PDP title = product name) — not wired.

### B2 — Clerk auth (ready to start any time)
- Middleware `proxy.ts` + `@clerk/nextjs` install.
- Wire `/entrar`, `/registar`, password reset to Clerk headless API.
- Admin gate for `/admin/*`.
- User gate for `/conta`, `/encomendas`.

### B3 — Cart state
- Port `contexts/cart-context.tsx` from old project.
- Replace mock cart count in StoreHeader.

### B4 — Checkout + Eupago
- Port `lib/payments/eupago.ts`, `/api/payment/*`, `/api/webhooks/eupago`.
- Wire `create_complete_order` RPC consumer.

### B5 — Customer account
### B6 — Admin products/variants/tiers writes
### B7 — Admin ops + emails
### B8 — Deploy

---

## How to resume

1. New session. Read this handoff + the master plan.
2. `git log --oneline` to confirm B0, B1a, B1b, B1c, B1d, B1e all landed.
3. Typical next step: B2 (Clerk) — blocks nothing, unblocks `/conta`, `/encomendas`, `/admin/*`.
4. If Maria prefers cart/checkout first, B3 → B4 is also unblocked.

---

## Session commits (newest first)

- `B1b: PDP wired to live DB`
- `B1c: PLP wired to live DB + category filter + follow-up join`
- `B1d+B1e: homepage CategoriesBlock + /categorias wired to live DB`
- `docs: B0+B1a handoff with RPC gap + GROUPS decision flagged` (prior session)
- `B1a: homepage featured products wired to live DB` (prior session)
- `B0: backend wiring foundation` (prior session)

All on `main`.
