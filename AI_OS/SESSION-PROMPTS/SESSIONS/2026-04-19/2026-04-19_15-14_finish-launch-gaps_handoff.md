# Jocril LOJA-ONLINE — Finish Launch Gaps Handoff

Date: 2026-04-19 15:14 Europe/Lisbon  
Branch: `codex/finish-launch-gaps`  
Final outcome label: `behavior-changing`  
Verification label: `partial verification`

## Summary

Implemented the direct code paths from `2026-04-19_CODEX-FINISH-LAUNCH-GAPS.md` without touching `_design_src/` or adding libraries.

The repo-standard production build passes using the explicit Windows Bun binary:

```bash
/mnt/c/Users/maria/.bun/bin/bun.exe run build
```

Runtime smoke with Playwright loaded public changed routes and APIs. Admin/customer authenticated flows were not fully browser-smoked because Clerk/admin auth blocks those pages locally.

## Gap Ledger

1. [done] PLP filters/sort actually apply.
   - `app/(store)/produtos/produtos-client.tsx` now derives `filteredProducts` from material, dimensions, color text match, stock, price, quick filters, and sort. The grid renders the derived array.

2. [done] NIF legal path verified and visible where needed.
   - Write path already persisted checkout `customer.nif` into `customers.tax_id`.
   - Canonical `/encomenda/[id]` now selects `customer:customers(... tax_id)` and shows NIF in `Faturação`.
   - Admin customer APIs include `tax_id`.
   - Production DB drift still needs live Supabase confirmation before launch.

3. [manual] Eupago webhook registration.
   - Manual production action remains: register `https://loja-jocril-qcma.vercel.app/api/webhooks/eupago`.
   - Local GET health returned `{ status: "ok", service: "EuPago Webhook" }`.

4. [done] `/conta` orders tab uses live orders.
   - `app/(store)/conta/page.tsx` fetches `GET /api/orders`, renders live order count/list, and links to canonical `/encomenda/[order_number]`.

5. [done] `/pesquisa` uses live search results.
   - Added server wrapper, client component, and `GET /api/products/search` backed by existing `listProducts()` / `search_products` RPC flow.

6. [done] Admin product list uses real product images.
   - `GET /api/admin/products` now returns variant `main_image_url`.
   - `app/admin/produtos/page.tsx` maps first available variant image, falling back to placeholder.

7. [done] Admin dashboard uses live stats.
   - Added `GET /api/admin/stats`.
   - `/admin` fetches live KPIs, recent orders, top products, and low stock rows.

8. [done] `/admin/clientes` list/detail use live data.
   - Added `GET /api/admin/customers` and `GET /api/admin/customers/[id]`.
   - List/detail pages now fetch those endpoints and include NIF/customer order data.

9. [done] Admin product pagination is real.
   - Client-side page state, page slicing, next/previous, and page buttons now drive the rendered rows.

10. [blocked] Admin product bulk actions.
   - Bulk publish, unpublish, and archive are wired through existing per-product PATCH/DELETE routes.
   - Duplicate remains blocked because clone rules for template, variants, and images are not defined.

11. [done] `/contacto` form has a backend action.
   - Added `POST /api/contact`, validation, and `sendContactMessage()` via Resend to `ADMIN_EMAIL`.
   - Form submits with success/error state. Full success path was not executed locally to avoid sending a real email.

12. [blocked] Promo codes field.
   - No discount/coupon table, RPC, or business rules found.
   - UI is disabled and explicitly states discounts await configuration.

13. [blocked] `/conta` profile edit.
   - Clerk owns name/email, but phone/company/NIF/address ownership is unresolved between Clerk and Supabase customer/shipping records.
   - Save path is disabled and explicitly marked pending data ownership.

14. [done] Overlapping order detail routes are resolved.
   - `/encomenda/[id]` remains canonical.
   - `/conta/encomenda/[id]` now redirects to `/encomenda/[id]`.

15. [blocked] Admin `definicoes/*`.
   - `definicoes/envios` read-side is wired to existing shipping tables through `GET /api/admin/settings/shipping`.
   - Discounts, taxes, and team management have no visible backing model/RPC.
   - Price tiers are referenced by RPC/query code, but a table-creation migration was not found in the visible repo, so full settings completion remains blocked.

## Changed Files By Area

Storefront/customer:
- `app/(store)/produtos/produtos-client.tsx`
- `app/(store)/pesquisa/page.tsx`
- `app/(store)/pesquisa/pesquisa-client.tsx`
- `app/api/products/search/route.ts`
- `app/(store)/conta/page.tsx`
- `app/(store)/encomenda/[id]/page.tsx`
- `app/(store)/conta/encomenda/[id]/page.tsx`
- `app/(store)/carrinho/page.tsx`
- `app/(store)/contacto/page.tsx`
- `app/api/contact/route.ts`
- `lib/email/send.ts`

Admin/API:
- `app/admin/page.tsx`
- `app/api/admin/stats/route.ts`
- `app/api/admin/products/route.ts`
- `app/admin/produtos/page.tsx`
- `app/api/admin/customers/route.ts`
- `app/api/admin/customers/[id]/route.ts`
- `app/admin/clientes/page.tsx`
- `app/admin/clientes/[id]/page.tsx`
- `app/admin/clientes/[id]/cliente-detail-client.tsx`
- `app/api/admin/orders/route.ts`
- `app/admin/encomendas/page.tsx`
- `app/api/admin/settings/shipping/route.ts`
- `app/admin/definicoes/envios/page.tsx`

Session artifact:
- `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_15-14_finish-launch-gaps_handoff.md`

## Verification

Commands and checks run:

```bash
bun run build
```

Result: failed in WSL because `bun` is not on PATH.

```bash
powershell.exe -NoProfile -Command "bun --version"
```

Result: failed because Windows PowerShell also does not have `bun` on PATH.

```bash
cmd.exe /c "where bun"
```

Result: found `C:\Users\maria\.bun\bin\bun.exe`.

```bash
/mnt/c/Users/maria/.bun/bin/bun.exe run build
```

Result: pass.
- Next.js 16.2.3 compiled successfully.
- TypeScript finished successfully.
- Static generation completed for 53 routes.
- New routes included `/api/admin/customers`, `/api/admin/settings/shipping`, `/api/admin/stats`, `/api/contact`, and `/api/products/search`.

Dev smoke:

```bash
/mnt/c/Users/maria/.bun/bin/bun.exe run dev
```

Playwright results:
- `/` loaded, body text present, no Next error overlay.
- `/produtos` loaded, 100 product cards, sort dropdown present; price-desc smoke produced descending first prices: `252, 236.5, 236.5, 184.5, 140`.
- `/pesquisa?q=expositor` loaded, no Next error overlay.
- `GET /api/products/search?q=expositor` returned 200 with `success: true` and 60 products.
- `GET /api/webhooks/eupago` returned 200 health JSON.
- `POST /api/contact` with invalid payload returned 400 with expected validation keys; success path was not run to avoid sending email.

Observed runtime warnings/not-launch blockers:
- Dev server logged Clerk development-key warnings and an infinite token refresh warning, likely environment-key related.
- Font requests for `/styles/fonts/geist-sans.woff2` and `/styles/fonts/geist-mono.woff2` returned 404 during smoke. This appears pre-existing and outside this launch-gap pass, but should be checked before final visual QA.
- Authenticated admin pages were build-verified but not browser-verified after login.

## Manual Launch Actions

- Register Eupago webhook: `https://loja-jocril-qcma.vercel.app/api/webhooks/eupago`.
- Confirm Vercel production env vars.
- Confirm Clerk production origins, redirects, and admin metadata.
- Confirm live Supabase has expected schema/RPCs, especially `customers.tax_id`, shipping tables, `product_variants.main_image_url`, and any `price_tiers` table.
- Run authenticated admin smoke checks in production/preview after deploy.
- Decide discount-code model before enabling promo validation.
- Decide profile-data ownership before enabling `/conta` profile persistence.
- Decide product duplicate clone rules before enabling bulk duplicate.
