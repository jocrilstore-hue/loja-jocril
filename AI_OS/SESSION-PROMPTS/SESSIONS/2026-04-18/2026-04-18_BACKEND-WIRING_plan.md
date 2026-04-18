# Plan — Wiring LOJA-ONLINE (new UI) to the existing store backend

**Date:** 2026-04-18
**Status:** DRAFT — needs sign-off on 5 decision points before any code.
**Authors:** Maria + Claude
**Target project:** `C:\Users\maria\Desktop\pessoal\jocril\LOJA-ONLINE`
**Source project (legacy):** `C:\Users\maria\Desktop\pessoal\jocril\SITES\loja-jocril`

---

## 0. TL;DR

The old store is **functionally complete** (Clerk auth, Supabase DB with 16 migrations, Eupago payments, Resend emails, shipping calculator, admin SEO tools). The new project is **visually complete** (31 routes, inline-style port) but has **zero data layer**.

The schemas don't match. The UI was designed against **flat PT types** (`Product { preco, stock: enum }`). The DB is **template/variant split, English snake_case** (`product_templates` + `product_variants` with `base_price_including_vat`, `stock_quantity`).

This plan proposes an **adapter-based wiring** across 10 milestones (B0–B9), carefully preserving the port philosophy (inline styles, no shadcn, no new UI libs). The first three milestones (B0–B2) are reversible if a decision proves wrong; B3 onward depends on the decisions below.

---

## 1. Five decisions needed before code

### D1 — Auth: **Keep Clerk** or switch to Supabase Auth?

| Option | Pros | Cons |
|---|---|---|
| **Keep Clerk** (recommended) | Real users exist. pt-PT localization already done. `proxy.ts` middleware pattern proven. Admin role via `publicMetadata` works today. | Adds Clerk dep to the new project. Clerk UI (`<SignIn/>`) is a styled island — will visually clash with the port unless we skin it or use Clerk's headless `useSignIn()`. |
| **Switch to Supabase Auth** | Single-vendor stack. RLS can become real (long-term win). | Invalidates existing logins. Users must re-register. Lose pt-PT localization work. New dep anyway. |

→ **My recommendation:** Keep Clerk. Use the headless form path so the storefront `/login`/`/registar` pages (already built in M2) stay visually consistent.

### D2 — Type shapes: **Adapter layer** or rewrite UI types?

| Option | Pros | Cons |
|---|---|---|
| **A. Adapter layer** (recommended) | Honours CLAUDE.md rule "do only what was asked." UI files untouched. Mappers live in `lib/adapters/`. | Every DB query needs a `toUIProduct()`/`toUIOrder()` step. Two shapes to reason about. |
| **B. Rewrite `lib/types.ts` to DB shape** | One shape. `select *` maps directly. | Touches every storefront page (17 routes) and admin form (18 routes). Breaks the faithful-port invariant. High regression surface. |

→ **My recommendation:** A. Keep UI types as-is. Build a `lib/adapters/` directory: `product-adapter.ts`, `order-adapter.ts`, `customer-adapter.ts`.

### D3 — Database: **Point at existing prod Supabase** or create a new/dev instance?

Your message says "pull the old store info." That's ambiguous:
- **Same DB:** new project uses the same Supabase project as the old one. Old store keeps working while the new one comes online. Cutover = DNS switch.
- **New DB:** migrate schema + seed data into a fresh Supabase project. Safer for experiments but now you have two DBs to keep in sync until cutover.

→ **My recommendation:** Same DB. The old store is your source of truth — treat it as read-mostly during the wiring phase. We connect to the existing `NEXT_PUBLIC_SUPABASE_URL`. The old project becomes "legacy, do not deploy further" but keeps serving customers until we flip.

### D4 — Admin scope: **Port everything** or defer the heavier tools?

Old admin has features the new UI doesn't show:
- **SEO admin** (scan/auto-fix/apply) — 3 API routes + UI
- **User role management** — `/admin/users/[userId]/role`
- **Shipping zones/rates/classes** — new UI has a generic "Settings — Envios" page; old has a full matrix editor
- **Template images** — multi-image uploader tied to `product_template_images`
- **Product curator / price-tier tools**

→ **My recommendation:** Defer SEO tools, user-role UI, shipping zone matrix, and template-image uploader to **B10 (post-launch)**. B5/B6 wire the admin surfaces that *already exist in the new UI* (products, variants, tiers, orders, customers, settings, emails). If the business needs the deferred features, add a plan for each.

### D5 — Migrations: **Copy to new repo** or leave in old project?

Schema lives in `SITES/loja-jocril/supabase/migrations/`. Options:
- **Copy migrations** into `LOJA-ONLINE/supabase/migrations/`. Future schema changes flow from the new repo. Old repo freezes.
- **Leave in old repo.** New project points at the same DB but doesn't own schema.

→ **My recommendation:** Copy them into `LOJA-ONLINE/supabase/migrations/` at B0. Old repo becomes read-only reference. From B0 forward, any schema change is authored in the new repo.

---

## 2. Dependencies to add (batch approval request)

CLAUDE.md says "No new libraries without approval." Approving these now avoids four separate interruptions later:

| Package | Version | Reason | Milestone used |
|---|---|---|---|
| `@supabase/supabase-js` | ^2.x | Core client | B0 |
| `@supabase/ssr` | ^0.5.x | SSR cookie-bound client (same pattern as old project) | B0 |
| `@clerk/nextjs` | latest | Auth (assumes D1 = Keep Clerk) | B2 |
| `zod` | ^3.x | Input validation on API routes (old project already uses this) | B4 |
| `resend` | latest | Transactional emails | B6/B7 |

**Not re-adding:** shadcn/ui, Radix, react-hook-form, framer-motion. Old project had them; the port philosophy rejects them.

---

## 3. Milestone plan (B-series for Backend)

Each milestone ends with a working build, a commit, and a handoff file. We can stop after any milestone and the site still works.

### B0 — Foundation (est. 1 session)
- Copy `supabase/migrations/` from old → new.
- Create `lib/supabase/server.ts`, `client.ts`, `admin.ts` (direct port from old project — the files are tiny and proven).
- Add `.env.local.example` with all required keys.
- Install `@supabase/supabase-js`, `@supabase/ssr`.
- Create empty `lib/adapters/` directory.
- **Verification:** `npm run build` clean. No UI changes visible.

### B1 — Read-only storefront (est. 1 session)
- Wire `/produtos` (PLP) to `product_templates`+`product_variants` via adapter.
- Wire `/produtos/[slug]` (PDP) — use the canonical template+variant shape.
- Wire `/categorias` and `/categorias/[slug]`.
- Wire homepage featured products (`is_featured` filter).
- Storefront becomes data-backed; no writes yet.
- **Verification:** click through 10 products on the new site matches what the old site shows.

### B2 — Auth + admin gate (est. 1 session, assumes D1 = Clerk)
- Add `@clerk/nextjs`, wire `proxy.ts` (middleware) with the same protected routes.
- Port `lib/auth/permissions.ts` (admin check via publicMetadata / `ADMIN_EMAILS`).
- Wire `/login` + `/registar` forms to Clerk headless API so the existing port UI stays intact.
- Gate `/admin/*` and `/conta`, `/encomendas`.
- **Verification:** admin user can hit `/admin`; non-admin gets redirected.

### B3 — Cart state (est. 0.5 session)
- Port `contexts/cart-context.tsx` (localStorage, hydration-safe). Replace the mocked `[{qty:3}]` in the storefront layout.
- Rewire `StoreHeader` cart badge to real count.
- Cart page (`/carrinho`) reads from the context.
- **Verification:** add to cart → refresh → items persist. No backend writes yet.

### B4 — Checkout + payments (est. 2 sessions)
- Port `lib/payments/eupago.ts` (Multibanco + MBWay) 1:1.
- Port `app/api/payment/mbway/route.ts`, `app/api/payment/multibanco/route.ts`, `app/api/webhooks/eupago/route.ts`.
- Port `create_complete_order` RPC consumer. The RPC itself is already in migrations (copied B0).
- Wire checkout flow: `/carrinho` → `/checkout` → `/checkout/sucesso`.
- **Verification:** sandbox Eupago payment end-to-end, order appears in `orders` table with correct items, webhook updates status.

### B5 — Customer account (est. 1 session)
- `/conta` reads profile from `customers` (joined on `auth_user_id`).
- `/encomendas` lists the logged-in customer's orders.
- `/encomenda/[id]` — order detail for the customer.
- **Verification:** a logged-in customer sees their orders; another customer can't see them.

### B6 — Admin: products, variants, tiers (est. 2 sessions)
- Port `app/api/admin/products/route.ts` + variants CRUD.
- Port `app/api/admin/price-tiers/apply/route.ts`.
- Port `app/api/admin/validation/{sku,slug}/route.ts`.
- Wire the existing product form (all 6 tabs already built) to these APIs.
- Wire admin PLP (products list) and the variant form.
- **Verification:** create a product + variant, edit, delete, confirm visible on storefront.

### B7 — Admin: orders, customers, settings, emails (est. 1.5 sessions)
- Port `app/api/orders/[orderNumber]/status/route.ts` — admin status updates.
- Wire admin orders list + detail to real data.
- Wire customers list + detail.
- Port `lib/email/resend.ts` + templates (`order-confirmation`, `payment-received`, `admin-notification`).
- Wire the 6 settings pages to `admin_settings` table (or equivalent). If the settings schema isn't there, we stop and plan it.
- **Verification:** change an order status → customer email fires.

### B8 — Search + SEO metadata (est. 1 session)
- Wire `/pesquisa` to the existing `improve_search_function` Postgres function.
- Real `generateMetadata` for PDP (by slug), category page, order detail.
- Sitemap.ts pulls real slugs from DB.
- **Verification:** search "expositor" returns real products; `/produtos/[slug]` has real OG tags.

### B9 — Deployment (est. 1 session)
- Vercel project + env vars.
- DNS decision (loja.jocril.pt vs. jocril.pt — coordinate with marketing site).
- Clerk production keys, Eupago production mode flag.
- Smoke test, monitoring.

### B10 — Deferred (separate future plans)
- SEO admin tools (scan/auto-fix/apply).
- User role UI (`/admin/users/[userId]/role`).
- Shipping zones matrix editor.
- Template-image uploader (`product_template_images`).
- Product curator tool.
- RLS refactor (move off service-role-bypass to real RLS).

---

## 4. The adapter pattern in concrete terms

Example for `Product`:

```ts
// lib/adapters/product-adapter.ts
import type { Product, StockStatus } from "@/lib/types";

// Input: row from `product_templates` joined with default variant
type DBTemplate = { /* ... matches DB schema ... */ };

export function toUIProduct(t: DBTemplate): Product {
  return {
    id: String(t.id),
    sku: t.default_variant.sku,
    slug: t.slug,
    nome: t.name,
    categoria: t.category?.name ?? "",
    material: t.material ?? undefined,
    preco: Number(t.default_variant.base_price_including_vat),
    precoAntigo: t.default_variant.old_price_including_vat ?? undefined,
    stock: mapStockStatus(t.default_variant.stock_status),
    status: t.is_active ? "ativo" : "arquivado",
    destaque: t.is_featured,
    imagens: t.images?.map(i => i.url) ?? [],
    variantesCount: t.variants_count,
  };
}

function mapStockStatus(db: string): StockStatus {
  switch (db) {
    case "in_stock": return "em-stock";
    case "low_stock": return "ultimas-unidades";
    case "made_to_order": return "producao-por-encomenda";
    default: return "esgotado";
  }
}
```

Every DB query ends with `.map(toUIProduct)`. Writes go through the reverse (`fromUIProduct`) at API-route boundaries.

---

## 5. What this plan does NOT do

- **Does not refactor the UI.** Zero JSX changes except where a component needs a real prop instead of a mock (StoreHeader cart badge, PLP product list, admin product form).
- **Does not touch the marketing site.** Separate project, separate deployment.
- **Does not re-author the schema.** Migrations are copied as-is.
- **Does not introduce a component library.** Inline styles remain inline. Forms keep using the M1 primitives (Field, FieldSelect, ToggleSwitch).
- **Does not rewrite the port.** If a milestone requires UI rework, we stop and plan it separately.

---

## 6. Risks

| Risk | Mitigation |
|---|---|
| Schema has changed since the old project's last migration (drift between migrations folder and live DB) | Before B1, run `list_tables` against live Supabase, diff against migrations. Adjust adapters to match reality. |
| Clerk user IDs don't map to `customers.auth_user_id` cleanly | Check the existing join pattern in old project before B2. If the join is fragile, we add a backfill step. |
| The `_design_src/` prototypes assumed visual shapes that don't exist in DB (e.g. `precoAntigo` / "sale price") | Flag at adapter-build time. Options: add DB column, or drop the UI field. Decide case-by-case. |
| Eupago sandbox vs. production key swap breaks webhooks in test | Use the old project as the live environment until B9 cutover; new project runs against Eupago sandbox until go-live. |
| Copying migrations confuses Supabase about schema ownership | New project runs `supabase link` to the same project ref. Migrations are idempotent (already applied). We do NOT re-run them. |

---

## 7. Next step

Maria to mark each decision `D1`–`D5` with a choice (or "need to discuss"), and confirm the batch dependency install. Once that's signed, I open B0 as a new session with the handoff file already seeded.

No code gets written in this session.
