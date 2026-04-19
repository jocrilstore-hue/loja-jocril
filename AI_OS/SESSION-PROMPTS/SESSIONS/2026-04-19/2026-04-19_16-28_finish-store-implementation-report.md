# Jocril Finish Store Implementation Report

Date: 2026-04-19 16:28 WEST
Branch: `codex/finish-launch-gaps`
Source prompt: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_15-56_my-precious-codex-finish-store.md`

## Outcome

Final outcome label: `behavior-changing`

Verification label: `partial verification`

Reason for partial verification: the production build and signed-out storefront/admin guard checks passed, but authenticated customer/admin order-detail flows were not runtime-tested because no valid Clerk/admin session or credentials were available in this execution context.

## Files Changed In This Mission

- `proxy.ts`
- `app/(store)/entrar/page.tsx`
- `components/store/StoreHeader.tsx`
- `public/styles/colors_and_type.css`
- `app/(store)/carrinho/page.tsx`
- `app/api/orders/route.ts`
- `app/(store)/encomenda/[id]/page.tsx`
- `app/(store)/conta/page.tsx`
- `app/(store)/produtos/page.tsx`
- `app/(store)/produtos/produtos-client.tsx`
- `components/store/StoreFooter.tsx`
- `app/api/admin/orders/[id]/route.ts`
- `app/admin/encomendas/[id]/page.tsx`
- `components/admin/ProductFormPage.tsx`
- `components/admin/VariantFormPage.tsx`
- `supabase/migrations/20251220125000_create_price_tiers.sql`
- `components/admin/styles.ts`
- `components/admin/SettingsHelpers.tsx`
- `app/admin/definicoes/page.tsx`
- `app/admin/definicoes/descontos/page.tsx`
- `app/admin/definicoes/envios/page.tsx`
- `app/admin/definicoes/equipa/page.tsx`
- `app/admin/definicoes/escaloes/page.tsx`
- `app/admin/definicoes/impostos/page.tsx`
- `app/admin/emails/page.tsx`
- `app/admin/escaloes-preco/page.tsx`
- `app/api/webhooks/eupago/route.ts`
- `app/(store)/sitemap/page.tsx`

## Behavior Changed By Batch

Batch 1 - Public blockers and broken links:
- Fixed the auth matcher so `/contacto` is public while `/conta` and `/conta/...` remain protected.
- Corrected legal links to `/legais/termos` and `/legais/privacidade`.
- Wired header search to `/pesquisa?q=...`.
- Fixed font URLs to `/fonts/geist-*.woff2`.
- Corrected stale sitemap links for legal pages and obvious route examples.

Batch 2 - Checkout trust and order privacy:
- Added required terms/privacy consent to checkout before order creation.
- Added API schema validation for `legalConsent === true`.
- Removed the public full order-detail lookup path from `/api/orders?order_number=...`.
- Made `/encomenda/[id]` require sign-in and match the order customer owner before showing details.
- Wired account page sign-out with Clerk.

Batch 3 - Product discovery correctness:
- Derived PLP material options/counts from loaded products instead of hardcoded fake values.
- Removed false pagination controls.
- Preserved sort, max-price, quick price, and dimension filters.
- Corrected unsupported footer product query links.

Batch 4 - Admin fulfillment truth:
- Added authenticated admin order detail GET for real order/customer/items/shipping/payment data.
- Updated admin order status PATCH to accept numeric id or order number.
- Replaced hardcoded admin order detail page data with live API fetch.
- Disabled unsupported invoice/guide/cancel actions.

Batch 5 - Admin catalog and settings honesty:
- Narrowed product and variant forms to only fields backed by current save payloads.
- Made unsupported product/variant fields hidden instead of apparently editable.
- Added the missing `price_tiers` table migration needed by PDP/RPC code.
- Marked admin settings and email pages as read-only where persistence is not implemented.
- Stopped `/admin/escaloes-preco` from simulating a global save; it is now an explicit preview-only tool until the persistence route exists.

Batch 6 - Code-side EuPago only:
- Fixed the EuPago webhook customer select to use `first_name`, `last_name`, `company_name`, and `email`.
- Composes a safe display name before sending the payment-received email.
- No EuPago panel registration, live callback, payment, or email side effect was performed.

## Commands Run

- `bun run build` - failed with the known WSL shim issue: `next: command not found`.
- `cmd.exe /c "cd /d C:\Users\maria\Desktop\pessoal\jocril\LOJA-ONLINE && C:\Users\maria\.bun\bin\bun.exe run build"` - passed.
- Same Windows Bun build rerun after the final sitemap code change - passed.
- Route curl checks - passed:
  - `/`, `/produtos`, `/pesquisa?q=expositor`, `/produtos/bolsa-resistente-a-agua-autoadesivo-a3`, `/carrinho`, `/contacto`, `/legais/termos`, `/legais/privacidade`, `/api/webhooks/eupago`, fonts, `/sitemap` returned 200.
  - `/encomenda/AUDIT-NOT-FOUND` returned 307 to `/entrar?...`.
  - `/admin` and admin pages returned 307 to login.
  - `/api/admin/orders`, `/api/admin/orders/123`, `/api/admin/settings/shipping` returned 403 signed out.
- `rg` stale legal-link check - passed for the corrected app/component paths.
- `git diff --check` - not clean because the worktree has broad existing CRLF/trailing-whitespace diff noise across many previously modified files; not corrected in this mission to avoid unrelated churn.

## Browser Checks

Playwright MCP checks:
- `/contacto` signed-out access: pass.
- Header search from `/` to `/pesquisa?q=expositor`: pass.
- PLP material option from real data: pass (`Acrílico` only, count 100).
- PLP A4 dimension filter: pass, product links reduced to 14.
- PLP quick price/range/sort interactions: pass.
- False numeric pagination controls: pass, none found.
- PDP add-to-cart: pass, cart changed to 10 items.
- Cart quantity update: pass, quantity changed from 10 to 11.
- Checkout finalization without terms/privacy consent: pass, blocked with `ACEITE OS TERMOS E A POLÍTICA DE PRIVACIDADE ANTES DE FINALIZAR A ENCOMENDA.`
- Mobile `/produtos` at 390x844: pass, no horizontal overflow.
- Browser console errors: pass, zero errors; no font 404s observed.

## Not Fully Tested

- Authenticated `/conta`, `/encomenda/[id]`, and account sign-out flows were not runtime-tested because no customer session was available.
- Authenticated admin order detail page and status update were not runtime-tested because no admin session was available.
- Supabase migrations were not applied to a live or local database in this mission.
- EuPago webhook POST was not exercised with live callback payloads to avoid payment/email side effects.

## Remaining Manual Action

Maria still needs to register or confirm the EuPago callback URL in the EuPago panel. That external panel step was explicitly excluded from this coding mission.

## Unresolved Decisions

- Whether guest order success/detail access should exist after checkout. Current safe behavior requires sign-in for full order details; the public payment-status polling route remains available for payment state only.
- Whether `/admin/escaloes-preco` should be wired to the existing `admin_apply_price_tiers(jsonb)` RPC in a later mission, with real variant reads and real result reporting.
- Whether to normalize the broad CRLF/trailing-whitespace churn currently visible in the worktree. This should be a separate formatting-only decision, not mixed into launch behavior fixes.
