# Session Handoff — 2026-04-19 (end of day)

## What was completed this session

### B5 — Customer account
- `/conta` — wired to Clerk `useUser()`, shows real name/email/since date
- `/encomendas` — server component, queries Supabase by `auth_user_id` → `customer_id`
- `/encomenda/[id]` — full order detail, Multibanco pending block uses real columns (`eupago_entity`, `eupago_reference`, `payment_deadline`)

### B6 — Admin mutations
- `GET/POST /api/admin/products` — list + create product templates
- `PATCH/DELETE /api/admin/products/[id]` — update + soft-delete
- `POST /api/admin/products/[id]/variants` — create variant
- `PATCH/DELETE /api/admin/products/[id]/variants/[variantId]` — update + soft-delete
- `GET /api/admin/orders` — new endpoint, returns orders with customer join + item count
- `PATCH /api/admin/orders/[id]` — status update (sets `paid_at` on first paid transition)
- `ProductFormPage.tsx` + `VariantFormPage.tsx` wired to real APIs
- Admin `/admin/produtos` list wired to real Supabase data
- Admin `/admin/encomendas` list wired to real Supabase data
- Admin `/admin/encomendas/[id]` status dropdown wired to real API

### B7 — Transactional emails
- `lib/email/send.ts` — `sendOrderConfirmation`, `sendAdminNotification`, `sendPaymentReceived`
- Wired in `app/api/orders/route.ts` (order create) and `app/api/webhooks/eupago/route.ts` (payment received)
- Fire-and-forget via Resend; uses `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`

### B8 — Deploy
- Migrated from npm to Bun (1.3.6, `bun.lock` committed)
- Pushed to `https://github.com/jocrilstore-hue/loja-jocril.git`
- Vercel: live at `https://loja-jocril-qcma.vercel.app`
- Clerk redirect URLs added for both Vercel domains

### Pending (manual, Monday)
- Register Eupago webhook: `https://loja-jocril-qcma.vercel.app/api/webhooks/eupago`
- Until then: MB Way / Multibanco payment confirmations won't fire (orders still created)

---

## Full audit — what's still broken or mock

### 🔴 Broken (confirmed)

**1. PLP filters — `app/(store)/produtos/produtos-client.tsx`**
Filter checkboxes (material, dimensions, colour, stock) and sort dropdown update React state but that state is **never applied to the `products` array**. Products render in full regardless of what's checked. Fix: wire `useMemo` to filter/sort `products` by active filter state.

**2. PLP sort — same file**
`sort` state is tracked but `products` is passed through unsorted. Fix: apply sort inside the same `useMemo`.

---

### 🟡 Still mock / not wired

**3. `/conta` orders tab — `app/(store)/conta/page.tsx` lines 11, 105, 175, 181**
Uses hardcoded `ORDERS` array. The separate `/encomendas` page IS real, but the orders preview + full list inside `/conta` still uses mock data. Fix: fetch from `/api/orders` (already exists) and replace `ORDERS`.

**4. `/pesquisa` — `app/(store)/pesquisa/page.tsx` line 9**
`RESULTS: ProductMock[]` is hardcoded mock. Supabase search RPC exists (`search_products`) and is used in the header search. Fix: wire `searchParams.q` to the same RPC.

**5. Admin `/clientes` — `app/admin/clientes/page.tsx`**
No `GET /api/admin/customers` endpoint exists. Page is likely static mock. Fix: create endpoint querying `customers` table + wire page.

**6. Admin products pagination — `app/admin/produtos/page.tsx` lines 267–272**
Static HTML buttons `["‹", "1", "2", "3", "…", "16", "›"]`. Not functional. Fix: add page state + slice `filtered` array.

**7. Admin bulk actions — same file lines 191–197**
Publicar / Despublicar / Duplicar / Arquivar buttons exist in the selection bar but have no `onClick` handlers wired to backend.

**8. Product images in admin list — `mapProduct()` line 51**
All products hardcoded to `/assets/portfolio/carm-premium.avif`. Fix: `product_templates` needs a `main_image_url` column (check schema); if it exists, wire it.

**9. Promo codes — `app/(store)/carrinho/page.tsx` line 558**
Input field exists in checkout UI but no backend validation/application logic.

---

### 🟠 Legal / compliance gap

**10. NIF (número de contribuinte)**
Field exists in checkout form (optional, "Introduza para receber factura com IVA"). Portuguese law requires storing this for B2B invoicing. Check: is `nif` being saved to the `orders` table? Likely not — verify the `create_order` RPC includes it. If not, add column + pass from checkout payload.

---

### ℹ️ Minor / cosmetic

- `/conta` profile edit section has `{/* TODO: B5b — profile edit form wired to Clerk */}` — not wired
- `/conta` order count + tier progress not wired (`{/* TODO: B5b — order count + tier progress */}`)
- `VariantFormPage.tsx` max order quantity input has no `name` binding (data not submitted)

---

## Next session priorities (suggested order)

1. **PLP filters + sort** — broken, visible to customers, quick fix
2. **NIF to DB** — legal compliance, must verify before real orders come in
3. **`/conta` orders tab** — customers will notice mock data
4. **`/pesquisa`** — UX gap
5. **Admin pagination + bulk actions** — operational tooling
6. **Monday: Eupago webhook** — payment confirmations blocked until this is done

---

## Build state
- 48 routes, 0 TypeScript errors
- Bun 1.3.6, `bun run build` clean
- Branch: `main` @ `a45171f`
