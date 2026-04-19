# Jocril LOJA-ONLINE — Full Store Launch Audit

Date: 2026-04-19 15:46 WEST  
Branch: `codex/finish-launch-gaps`  
Mission: audit-only launch readiness review. No application code fixes were made.

## 1. Executive Summary

Final outcome label: `guardrail-only`

Verification label: `partial verification`

The production build passes when run with the Windows Bun binary, and the public product discovery path is substantially live: `/produtos`, `/pesquisa?q=expositor`, a real PDP, add-to-cart, and cart quantity updates all worked in browser/runtime checks.

The store is **not fully launch-ready**. I found several launch blockers and high-risk gaps:

- The main public `/contacto` route is accidentally protected by Clerk auth because `proxy.ts` protects `/conta(.*)`, which also matches `/contacto`. Header/footer Contact links redirect signed-out users to login.
- The EuPago webhook path is not launch-ready: the callback still needs external registration, and the webhook code selects `customers(name, email)` while the visible customer schema uses `first_name`, `last_name`, `email`, and `tax_id`.
- Admin order detail is still a mock shell with hardcoded customer/items/shipping/timeline. Only the status PATCH uses the route id.
- Storefront PLP filters mostly work, but the material filters are broken against current live data: clicking `Acrílico 3mm` returned zero products even though the UI claims 7.
- Several launch-facing controls are visual-only or partial: header search, PLP pagination, checkout terms consent, admin import/export/bulk order actions, customer/admin settings actions, product editor sections, contact attachments, account sign-out.

## 2. Final Outcome Label

`guardrail-only`

Reason: the session produced audit evidence and report artifacts only. It did not change application behavior.

## 3. Verification Label

`partial verification`

Reason: build and public runtime checks ran, but authenticated admin/customer flows, real payment callbacks, live email sending, and production-only service configuration could not be fully exercised without credentials or external-service authorization.

## 4. Commands Run And Results

| Command / tool | Result | Notes |
|---|---:|---|
| `pwd` | pass | Confirmed `/mnt/c/Users/maria/Desktop/pessoal/jocril/LOJA-ONLINE`. |
| `git status --short --branch` | pass | Branch `codex/finish-launch-gaps`; repo was already very dirty with many modified/untracked project files. |
| `bun --version` | pass | WSL Bun `1.3.12`. |
| `bun run build` | fail | Failed with `next: command not found`; local `node_modules/.bin` contains Windows/Bun shims, not a Linux `next` executable. |
| `which bun` | pass | `/home/maria/.bun/bin/bun`. |
| `ls -la node_modules/.bin` | pass | Confirmed `next.bunx` and `next.exe`, no plain Linux `next`. |
| `cmd.exe /c "where bun"` | pass | `C:\Users\maria\.bun\bin\bun.exe`. |
| `/mnt/c/Users/maria/.bun/bin/bun.exe --version` | pass | Windows Bun `1.3.6`. |
| `/mnt/c/Users/maria/.bun/bin/bun.exe run build` | pass | Next.js 16.2.3 built successfully, TypeScript passed, 53 routes generated. |
| `/mnt/c/Users/maria/.bun/bin/bun.exe run dev` | pass | Dev server ready at `http://localhost:3000`. |
| Required `rg` scans from prompt | pass | Ran TODO/mock/link/env scans across `app components lib supabase`. |
| Route status curl loop | pass | Public routes checked; auth-gated routes returned expected redirects except `/contacto`, which is incorrectly gated. |
| Safe API checks | pass | Invalid payload checks returned expected `400`; admin APIs returned unauthenticated `403`; search API returned 200/60 products. |
| Playwright MCP desktop/mobile | pass | Captured console/network issues and screenshots. |
| Runtime Chrome harness | pass | Output saved to `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/runtime-audit-output.json`. |

## 5. Environment / Tooling Notes

- WSL `bun run build` is not the reliable build path in this checkout because the dependency bin directory contains Windows/Bun shims. The repo-standard build was verified with `C:\Users\maria\.bun\bin\bun.exe`.
- Playwright MCP screenshot writing initially failed when using a relative filename due app resource permissions; screenshots were saved under Codex tmp and copied into the session folder.
- Clerk dev keys are loaded locally. Browser console warns that development Clerk instances should not be used for production.
- Runtime browser checks repeatedly found 404s for `/styles/fonts/geist-sans.woff2` and `/styles/fonts/geist-mono.woff2`.

## 6. Route And Link Inventory Summary

### Public Routes

Runtime status without following redirects:

| Route | Runtime result |
|---|---|
| `/` | 200 OK |
| `/produtos` | 200 OK |
| `/produtos?cat=acrilicos-chao` | 200 OK |
| `/categorias` | 200 OK |
| `/pesquisa` | 200 OK |
| `/pesquisa?q=expositor` | 200 OK |
| `/produtos/bolsa-resistente-a-agua-autoadesivo-a3` | 200 OK |
| `/carrinho` | 200 OK |
| `/contacto` | 307 to `/entrar?redirect_url=.../contacto` — broken for public users |
| `/encomenda/AUDIT-NOT-FOUND` | 200 OK page route, source-level public lookup risk remains |
| `/entrar` | 200 OK |
| `/recuperar-password` | 200 OK |
| `/confirmar-email` | 200 OK |
| `/faq`, `/sobre`, `/processos`, `/portfolio`, `/sitemap`, `/manutencao` | 200 OK |
| `/legais/cookies`, `/legais/devolucoes`, `/legais/envios`, `/legais/privacidade`, `/legais/termos` | 200 OK |

### Auth-Gated Routes

| Route class | Runtime result |
|---|---|
| `/conta` | 307 to `/entrar?...` |
| `/encomendas` | 307 to `/entrar?...` |
| `/admin`, `/admin/produtos`, `/admin/produtos/novo`, `/admin/encomendas`, `/admin/clientes`, `/admin/definicoes` | 307 to `/entrar?...` |
| Admin APIs `/api/admin/*` | 403 unauthenticated JSON |

### Runtime Anchor Crawl

Chrome/Playwright crawled anchors from `/`, `/produtos`, `/pesquisa?q=expositor`, `/carrinho`, `/contacto`, and `/sitemap`. Each public page loaded header/footer/category/product links, but every page also logged the two font 404s.

Important source-level link issues:

- `app/(store)/entrar/page.tsx:193` links register consent to `/termos` and `/privacidade`; runtime status for both is 404. The actual pages are `/legais/termos` and `/legais/privacidade`.
- `app/(store)/sitemap/page.tsx` advertises stale routes such as `/politica-privacidade`, `/termos-condicoes`, `/admin/entrar`, `/admin/escaloes`, and `/admin/produtos/variante`.
- Footer store links include unsupported query conventions such as `/produtos?sort=novidades`, `/produtos?sort=promocoes`, and `/produtos?tier=escaloes`; `app/(store)/produtos/page.tsx` only handles `cat`.

## 7. Broken / Blocked Link Ledger

| Source / class | Target | Classification | Evidence |
|---|---|---|---|
| Header/footer main nav | `/contacto` | broken public route; auth redirect | `curl -i /contacto` returned 307 to `/entrar`; Playwright landed on login page. |
| Register consent | `/termos` | broken 404 | Runtime route status 404; source `app/(store)/entrar/page.tsx:193`. |
| Register consent | `/privacidade` | broken 404 | Runtime route status 404; source `app/(store)/entrar/page.tsx:193`. |
| Sitemap | `/politica-privacidade` and old legal names | broken/stale | Runtime status 404 for `/politica-privacidade`; source `app/(store)/sitemap/page.tsx`. |
| Sitemap/admin docs | `/admin/entrar`, `/admin/escaloes`, `/admin/produtos/variante` | stale/auth redirect or noncanonical | Runtime 307 to login because admin matcher catches them; no matching canonical route. |
| Account/admin/customer/order pages | `/conta`, `/encomendas`, `/admin/*` | auth-gated, not broken | Runtime 307 to `/entrar`; blocked without Clerk login/admin user. |

## 8. Filter / Search / Sort / Control Matrix

| Area | Control | Classification | Evidence |
|---|---|---|---|
| `/produtos` | Sort `Preço ↓` | works | Runtime first prices after sort: `€252,00`, `€236,50`, `€236,50`, `€184,50`, `€140,00`. |
| `/produtos` | Quick filter `Até €50` | works | Runtime card count changed from 100 to 74, first prices <= €50. |
| `/produtos` | Dimension filter `A4` | works | Runtime card count changed from 100 to 14. |
| `/produtos` | Max price range | works | Runtime `maxPrice=20` changed card count from 100 to 51. |
| `/produtos` | Material filters | broken | Runtime `Acrílico 3mm` changed card count to 0, while UI count says 7. Source compares `product.material` to labels `Acrílico 3mm`, but runtime product cards show material `ACRÍLICO`. |
| `/produtos` | Clear filters | works with caveat | Clears filter state, but does not reset sort; source `clearFilters()` does not set `sort`. |
| `/produtos` | Density 3x/4x | works visually | Source changes `cols` state; runtime not deeply measured. |
| `/produtos` | Pagination buttons | visual-only | Source `Pagination()` renders buttons with no page state/handlers. |
| Header | Search field | visual-only / broken | Runtime typing `expositor` + Enter kept URL at `/`; source header input has no submit/navigation handler. |
| `/pesquisa` | Initial query `q=expositor` | works | Runtime 60 product cards; API returned `success: true`, 60 products. |
| `/pesquisa` | Query input | works with caveat | Runtime impossible query updated URL to `/pesquisa?q=zzznadaaudit` and card count to 0. |
| `/pesquisa` | Scope tabs | works with caveat | Source toggles scope; category/help scopes hide product cards, but CTAs are not wired. |
| `/pesquisa` | Category highlight CTA `Ver categoria` | visual-only | Source renders `<Button variant="solid">` without `href`/handler. |
| PDP | Size selector, quantity, add-to-cart | works | Runtime PDP added item to `localStorage` cart; cart increment changed total items 2 -> 3. |
| PDP | Color selector | blocked by data | Source supports color variants, but current PDP has no real color variant buttons beyond theme/favorite titles. |
| PDP | `Ampliar`, `Guardar`, `Pedir amostra`, `Orçamento em grandes quantidades` | visual-only | Source buttons have no handlers/hrefs. |
| Cart | Quantity increment | works | Runtime cart increment updated `jocril-cart.totalItems`. |
| Cart | Promo code | disabled honestly | Source disables input and button with explanatory copy. |
| Checkout | Required field validation | source-verified | `handleFinalizar()` blocks missing required fields before order creation. Runtime click harness did not advance to step 2 reliably. |
| Checkout | Terms/consent gate | missing | Source checkout has no required terms/privacy checkbox before final order submission. |
| Contact | Contact form submit | blocked by `/contacto` auth bug | Source API exists, but signed-out users cannot reach route. |
| Contact | Attachments | visual-only | Source has no file input/upload handler; `Procurar` button is inside a form with no `type="button"`. |
| Account | Sign-out | broken | Source renders `Sair` button with no `onClick`/href. |
| Admin products | Search/filter/sort/pagination | source-wired | Source uses derived `filtered`, `sortKey`, page state. Runtime blocked by auth. |
| Admin products | Import/export | visual-only | Source buttons have no handlers. |
| Admin products | Bulk publish/unpublish/archive | source-wired, auth blocked | Source loops selected IDs through admin API; duplicate remains disabled honestly. |
| Admin orders list | Search/filter/sort | source-wired | Source derives filtered rows from API data. Runtime blocked by auth. |
| Admin orders list | Bulk actions/export/new order/pagination | visual-only | Buttons and static pagination have no handlers. |
| Admin order detail | Detail data | broken/mock | Hardcoded order object drives customer/items/shipping/timeline. |
| Admin customers | Search/filter/sort | source-wired | Source fetches `/api/admin/customers` and derives filtered rows. Runtime blocked by auth. |
| Admin customers | Export/new customer/pagination | visual-only | Buttons/static pager have no handlers. |
| Admin settings | Shipping read-side | source-wired | Fetches `/api/admin/settings/shipping`. Create/import/toggles are visual-only. |
| Admin settings | Discounts/taxes/team/emails/general save | visual-only / mock | Static arrays or inputs, no persistence handlers. |

## 9. Storefront Functional Completeness Matrix

| Capability | Status | Evidence / notes |
|---|---|---|
| Homepage | partial live | Runtime loads; source pulls Supabase featured/categories. Font 404s present. |
| Product listing | partial live | Products load, sort/quick/dimension/price work; material filter broken; pagination visual-only. |
| Category links | partial live | `/produtos?cat=...` returns 200; PLP uses `cat`. Footer sort/tier links unsupported. |
| Search | partial live | Search API and `/pesquisa?q=expositor` work; header search is visual-only. |
| Product detail | partial live | Real PDP route loads from product data; size/quantity/add-to-cart works; several PDP CTAs visual-only; color model not backed by data. |
| Cart | partial live | Add/update cart works with localStorage; promo disabled honestly. |
| Checkout | partial live, not launch-complete | Order creation/payment code exists; validation source present; no checkout terms consent gate; real order/payment not submitted in audit. |
| Contact | blocked | Public route redirects to login due middleware matcher. |
| Account/orders | auth blocked for runtime | Source uses Clerk/current user; not browser-tested without credentials. |
| Legal/support pages | partial | `/legais/*`, FAQ, about, process, portfolio are present; stale legal links remain in sign-in/sitemap. |

## 10. Admin Functional Completeness Matrix

| Capability | Status | Evidence / notes |
|---|---|---|
| Admin auth gate | partial | Runtime redirects `/admin/*` to login; admin APIs return 403 unauthenticated. Could not verify logged-in/admin role. |
| Dashboard | source live-ish | Source calls admin stats API, but auth blocked runtime. |
| Products list | source-wired | Fetches `/api/admin/products`; search/filter/sort/pagination source-wired. Import/export visual-only. |
| Product create/edit | partial | API only receives name/slug/is_active/is_featured/category subset; many UI sections do not persist. |
| Variant create/edit | partial | Persists SKU/format/price/stock/active; technical specs, print area, images, packaging are UI-only. |
| Orders list | source-wired | Fetches `/api/admin/orders`; bulk actions/pagination/export/new order are visual-only. |
| Order detail | broken/mock | Detail content is hardcoded sample order; only status PATCH uses route id. |
| Customers list/detail | source-wired, runtime blocked | APIs exist; export/new/detail actions still partial or visual-only. |
| Settings | mostly mock/read-only | Shipping read-side exists; discounts/taxes/team/emails/general save lack persistence. |

## 11. Backend / API / Schema Readiness Matrix

| Area | Status | Evidence / notes |
|---|---|---|
| Public product search API | live | `GET /api/products/search?q=expositor` returned 200 with 60 products. |
| Order creation API | validation live | Invalid payload returned 400 with schema details. Real creation not executed. |
| Payment APIs | validation live | Invalid MB Way/Multibanco payloads returned 400. Real EuPago calls not executed. |
| EuPago webhook health | live | `GET /api/webhooks/eupago` returned 200 health JSON. |
| EuPago webhook processing | blocker | Source selects `customers(name, email)`, but migrations/API use `first_name`, `last_name`, `email`, `tax_id`; likely callback processing failure. |
| Admin APIs | auth-protected | Unauthenticated `GET /api/admin/products/orders/customers/stats/settings/shipping` returned 403. |
| `price_tiers` schema | drift risk | Code/RPC references `price_tiers`; visible migrations include no `CREATE TABLE price_tiers`. |
| Supabase customer/NIF | partial | Order RPC stores `tax_id`; admin/customer APIs use it. Live DB drift still needs production Supabase confirmation. |
| Environment variables | partial | `.env.local.example` has `ADMIN_EMAILS`, but header admin visibility reads `NEXT_PUBLIC_ADMIN_EMAILS`; EuPago has fallback production URL mismatch risk if `NEXT_PUBLIC_SITE_URL` missing. |

## 12. Payment / Email / Webhook Readiness

- EuPago webhook health route exists and returns 200.
- Manual EuPago webhook registration remains required for production: `https://loja-jocril-qcma.vercel.app/api/webhooks/eupago`.
- Webhook callback processing has a likely schema bug: `customer:customers(name, email)` is inconsistent with the current `customers` table shape.
- Payment APIs returned safe validation errors for missing data. No real payment/order/email was submitted.
- Contact email API validation works, but the public `/contacto` page is currently unreachable for signed-out users.
- Resend success paths were not exercised to avoid sending real email.

## 13. Mobile / Browser / Runtime Findings

Runtime browser evidence:

- Desktop `/produtos` screenshot: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/jocril-produtos-desktop.png`.
- Mobile `/produtos` screenshot: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/jocril-produtos-mobile.png`.
- `/contacto` redirect screenshot: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/jocril-contacto-redirect.png`.
- Runtime JSON: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/runtime-audit-output.json`.

Browser findings:

- `/produtos` desktop and mobile render without a Next error overlay.
- Mobile `/produtos` had no measured horizontal overflow: `scrollWidth=390`, `clientWidth=390`.
- Every browser page checked logged 404s for `/styles/fonts/geist-sans.woff2` and `/styles/fonts/geist-mono.woff2`. The real files exist at `/fonts/...`; `public/styles/colors_and_type.css` references `url("fonts/...")`, which resolves relative to `/styles/`.
- Clerk dev-key warnings appear in browser console.
- `/contacto` browser navigation lands on `/entrar?redirect_url=.../contacto`.

## 14. Mock / Static / Visual-Only Remnants

Confirmed source-level remnants:

- `app/admin/encomendas/[id]/page.tsx` hardcoded order data.
- `components/admin/ProductFormPage.tsx` image/content/SEO/applications/settings sections are local UI only.
- `components/admin/VariantFormPage.tsx` tier rows/specs/print area/technical image are local UI only.
- `app/admin/definicoes/*`, `app/admin/emails/page.tsx`, and `app/admin/escaloes-preco/page.tsx` contain static arrays or fake apply/save flows.
- PLP pagination has no behavioral state.
- Header search has no submit/navigation behavior.
- Footer newsletter is decorative.
- FAQ/about/process CTA buttons are decorative.
- Contact attachment affordance has no file input/upload path.

## 15. Findings Sorted By Severity

### P0 Launch Blockers

1. **`/contacto` is accidentally auth-protected.**  
   Area: public navigation/contact.  
   User-visible impact: main Contact links redirect signed-out users to login; the contact form and support path are unavailable.  
   Evidence: `curl -i /contacto` returned 307 to `/entrar`; Playwright screenshot `jocril-contacto-redirect.png`; `proxy.ts:3-7` protects `/conta(.*)`, which matches `/contacto`.  
   Suggested fix direction: make the account matcher exact for `/conta` and `/conta/...`, without matching `/contacto`.

2. **EuPago webhook callback likely fails on customer schema mismatch.**  
   Area: payments/webhooks/email.  
   User-visible impact: paid orders may not be marked paid/processing; payment-received email may not send.  
   Evidence: `app/api/webhooks/eupago/route.ts:34` selects `customers(name, email)`; `supabase/migrations/20251220112000_create_order_tables.sql` defines `first_name`, `last_name`, `email`, `tax_id`; admin APIs use first/last.  
   Suggested fix direction: select first/last/email and compose a display name consistently.

3. **EuPago webhook registration remains manual and not verified.**  
   Area: payments/operations.  
   User-visible impact: MB Way/Multibanco confirmation will not update orders automatically in production until registered.  
   Evidence: latest handoff lists registration as manual; no runtime evidence of external callback registration.  
   Suggested fix direction: register production callback in EuPago and run a test callback/order-status verification.

4. **Admin order detail is a hardcoded mock shell.**  
   Area: admin fulfillment.  
   User-visible impact: staff opening an order detail would see wrong customer/items/address/timeline, making fulfillment unsafe.  
   Evidence: `app/admin/encomendas/[id]/page.tsx:18-37` hardcodes one order; only `PATCH /api/admin/orders/${orderId}` uses route id.  
   Suggested fix direction: fetch real order detail/items/customer/shipping/payment by route id/order number.

### P1 Launch Risks

5. **Public order detail lookup has no ownership gate in source.**  
   Area: privacy/order detail.  
   Impact: if an order number is known/guessable, order/customer details may be exposed.  
   Evidence: `app/(store)/encomenda/[id]/page.tsx` queries by `order_number`; route is not protected by `proxy.ts`; `/encomenda/AUDIT-NOT-FOUND` returns 200 page route.  
   Fix direction: require signed-in ownership, signed token, or an explicit guest lookup secret.

6. **Checkout has no terms/privacy consent gate before final order creation.**  
   Area: checkout/legal.  
   Impact: customers can submit an order without an explicit acceptance checkbox in checkout.  
   Evidence: `app/(store)/carrinho/page.tsx:85-198` validates fields/payment only; no terms/consent state in checkout.  
   Fix direction: add a required terms/privacy consent gate to checkout submission.

7. **PLP material filters are broken against current product data.**  
   Area: product discovery.  
   Impact: visible material filters can collapse results incorrectly.  
   Evidence: runtime `Acrílico 3mm` returned 0 cards despite UI count 7; source compares filter labels like `Acrílico 3mm` to runtime material `Acrílico`.  
   Fix direction: align material filter values with actual material/attribute data or expose thickness as a separate product field.

8. **Product and variant editors persist only a subset of visible fields.**  
   Area: admin catalog operations.  
   Impact: staff can edit apparent fields that are not saved.  
   Evidence: product save sends only name/slug/is_active/is_featured; variant save sends SKU/format/price/stock/active; image/content/spec/SEO sections are not persisted.  
   Fix direction: either hide/label visual-only sections or wire their backing schema/API.

9. **Price-tier persistence has schema drift risk.**  
   Area: pricing/PDP/admin.  
   Impact: PDP tier pricing/admin price tiers can fail if `price_tiers` does not exist in live DB.  
   Evidence: code/RPC references `price_tiers`; visible migration scan found no `CREATE TABLE price_tiers`.  
   Fix direction: verify live schema and add/reconcile migration if missing.

10. **Header search is visual-only.**  
    Area: product discovery.  
    Impact: customers can type search text in the header and press Enter with no navigation.  
    Evidence: runtime URL stayed `/` after typing `expositor` and Enter; source header input lacks submit handler.  
    Fix direction: wire header input to `/pesquisa?q=...`.

11. **Sign-in/register legal links 404.**  
    Area: auth/legal.  
    Impact: users accepting terms during registration cannot open the terms/privacy targets.  
    Evidence: `/termos` and `/privacidade` runtime 404; source links at `app/(store)/entrar/page.tsx:193`.  
    Fix direction: point links to `/legais/termos` and `/legais/privacidade`.

12. **Admin settings are mostly mock/read-only.**  
    Area: admin operations.  
    Impact: staff can appear to edit store/tax/discount/team/email settings without persistence.  
    Evidence: settings pages contain static arrays and buttons without handlers; shipping read API exists but create/import/toggles are inert.  
    Fix direction: define which settings are launch-critical, hide the rest, and wire only the launch-critical subset.

### P2 Functional Gaps

13. PLP pagination is visual-only. Evidence: `Pagination()` has no state/handlers.
14. Footer product links advertise unsupported sort/tier query params.
15. Contact attachment UI has no file input/upload, and `Procurar` is a default submit button inside the form.
16. Account `Sair` button has no handler.
17. PDP color variants are not backed by current data.
18. PDP `Ampliar`, `Guardar`, `Pedir amostra`, and large-quantity quote buttons are visual-only.
19. Search category/highlight CTAs are visual-only.
20. Admin product import/export buttons are visual-only.
21. Admin orders bulk actions/export/new order/static pagination are visual-only.
22. Admin customer export/new/static pagination are visual-only.
23. Shipping settings import/new/toggles are visual-only.
24. Product image/font fallback shows placeholders for several products with missing imagery.
25. `/admin/login` is itself caught by admin auth middleware; canonical login still works through `/entrar?redirect_url=/admin`, but route-map expectations are muddy.
26. `NEXT_PUBLIC_ADMIN_EMAILS` client visibility and `ADMIN_EMAILS` server/env-example naming are split.
27. Font paths in `public/styles/colors_and_type.css` resolve to `/styles/fonts/...` and 404.

### P3 Polish

28. Footer newsletter button is decorative only.
29. FAQ/about/process CTA buttons are decorative.
30. Product listing count copy appears static in hero (`Referências 32`, `Em stock 24`) while runtime grid has 100 products.
31. Development Clerk warnings and unused preload warnings clutter browser console in local verification.
32. Sitemap advertises stale admin/legal route names.

## 16. Fully Functional Launch Gap List — Smallest Fix Batches

Recommended smallest batches:

1. **Critical route/payment blockers**
   - Fix middleware matcher so `/contacto` is public.
   - Fix EuPago webhook customer select/name composition.
   - Register EuPago webhook in production and verify callback/order status.

2. **Admin fulfillment truth**
   - Replace admin order detail mock with real order/customer/items/shipping/payment data.
   - Hide or disable print/cancel/note/profile actions until wired.

3. **Customer-facing trust/legal**
   - Fix `/termos` and `/privacidade` links.
   - Add checkout terms/privacy consent gate.
   - Decide guest order-detail access model.

4. **Product discovery correctness**
   - Wire header search to `/pesquisa`.
   - Fix PLP material filters.
   - Remove/disable public PLP pagination or implement it.
   - Remove unsupported footer query links or support them.

5. **Admin honesty pass**
   - Label/hide visual-only admin settings/actions.
   - Keep only wired launch-critical admin controls visible.

## 17. Manual Launch Actions

- Register EuPago webhook: `https://loja-jocril-qcma.vercel.app/api/webhooks/eupago`.
- Confirm Vercel production env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `EUPAGO_API_KEY`
  - `NEXT_PUBLIC_SITE_URL`
  - `RESEND_API_KEY`
  - `EMAIL_FROM`
  - `ADMIN_EMAIL`
  - `ADMIN_EMAILS` / `NEXT_PUBLIC_ADMIN_EMAILS` decision
- Confirm live Supabase schema/RPCs, especially `customers.tax_id`, customer name columns, `price_tiers`, shipping tables, product images, and complete order RPC.
- Run authenticated admin smoke in production/preview after deploy.
- Run one test-safe EuPago payment/webhook flow before launch.
- Verify Resend sender/domain and contact/order email delivery.

## 18. Open Questions

- Should `/encomenda/[id]` support guest lookups? If yes, what secret/token should authorize a guest order page?
- Are material filters intended to represent thickness (`3mm`, `4mm`, etc.) or base material (`Acrílico`, `Madeira`, etc.)?
- Which admin settings must be editable for launch, and which should remain read-only?
- Should discount codes exist at launch or remain disabled honestly?
- What are the product duplicate clone rules for templates, variants, images, and price tiers?
- Should contact attachments upload to storage/email at launch, or should the attachment affordance be removed?

## 19. Evidence Appendix

### Saved Evidence Files

- Audit report: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_15-46_full-store-audit.md`
- Runtime harness: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/runtime-audit.mjs`
- Runtime output: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/runtime-audit-output.json`
- Desktop screenshot: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/jocril-produtos-desktop.png`
- Mobile screenshot: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/jocril-produtos-mobile.png`
- Contact redirect screenshot: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/jocril-contacto-redirect.png`

### Key Runtime Evidence

- `/contacto`: 307 to `/entrar?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fcontacto`.
- `/termos`, `/privacidade`, `/politica-privacidade`: 404.
- `/api/products/search?q=expositor`: 200, `success: true`, 60 products.
- `/api/contact` invalid payload: 400, validation details.
- `/api/orders` invalid payload: 400, validation details.
- `/api/payment/mbway` invalid payload: 400.
- `/api/payment/multibanco` invalid payload: 400.
- `/api/admin/products`, `/api/admin/orders`, `/api/admin/customers`, `/api/admin/stats`, `/api/admin/settings/shipping`: 403 unauthenticated.
- PLP runtime:
  - initial cards: 100
  - `Preço ↓` first visible prices: 252, 236.5, 236.5, 184.5, 140
  - `Até €50`: 74 cards
  - `A4`: 14 cards
  - `maxPrice=20`: 51 cards
  - `Acrílico 3mm`: 0 cards
- PDP/cart runtime:
  - PDP path `/produtos/bolsa-resistente-a-agua-autoadesivo-a3`
  - add-to-cart wrote `jocril-cart.totalItems=2`
  - cart quantity increment updated `totalItems=3`
- Mobile runtime:
  - `/produtos` at 390x844 had `scrollWidth=390`, `clientWidth=390`, no measured horizontal overflow.

### Key Source References

- `proxy.ts:3-7` — auth matcher catches `/contacto`.
- `app/api/webhooks/eupago/route.ts:34` — webhook selects stale `customers(name, email)`.
- `supabase/migrations/20251220112000_create_order_tables.sql:2-9` — customer table first/last/tax columns.
- `app/admin/encomendas/[id]/page.tsx:18-37` — hardcoded order detail data.
- `app/(store)/produtos/produtos-client.tsx:64-90` — PLP filtering/sorting logic.
- `app/(store)/produtos/produtos-client.tsx:477-499` — visual-only PLP pagination.
- `components/store/StoreHeader.tsx` — header search input lacks submit navigation.
- `app/(store)/entrar/page.tsx:193` — stale legal links.
- `app/(store)/carrinho/page.tsx:85-198` — checkout validation without consent gate.
- `components/admin/ProductFormPage.tsx:58-108` — limited product save payload.
- `components/admin/VariantFormPage.tsx:118-168` — limited variant save payload.
- `public/styles/colors_and_type.css:13` and `:28` — relative font URLs resolving to `/styles/fonts/...`.
