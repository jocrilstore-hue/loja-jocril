# Codex Prompt - Full Jocril Store Audit

Recommended execution mode: autonomous bounded audit.

Recommended orchestration:

- Main audit lane: `gpt-5.4`, reasoning effort `high`.
- Route/link explorer lane: `gpt-5.4-mini`, reasoning effort `medium`.
- Storefront behavior explorer lane: `gpt-5.4-mini`, reasoning effort `medium`.
- Admin/backend readiness explorer lane: `gpt-5.4-mini`, reasoning effort `medium`.
- Verification/browser lane: `gpt-5.4-mini`, reasoning effort `medium`.

Why: this is a broad audit, not an implementation sprint. Use one strong main lane for synthesis and final judgement, with cheap bounded side lanes for route inventory, browser evidence, source scans, and admin/backend facts. Do not create worker agents for fixes unless Maria explicitly changes the mission from audit to implementation.

## Mission

You are in:

`/mnt/c/Users/maria/Desktop/pessoal/jocril/LOJA-ONLINE`

Audit the entire Jocril online store for launch readiness. Be detailed, evidence-based, and extensive.

The audit must answer at minimum:

1. Does every reachable internal link work?
2. Does every filter/search/sort control actually affect the rendered results?
3. Is the store missing anything it needs to be fully functional for a real launch?
4. Which issues are true launch blockers, which are launch risks, and which are lower-priority polish?

This is an audit-only mission. Do not implement fixes. Do not edit application code. You may write the audit report and any optional audit evidence files only.

## Read First

Read these before auditing:

1. `AGENTS.md`
2. `AI.md`
3. `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md`
4. `AI_OS/AI_DECISION_LOG.md`
5. `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_FULL-PROJECT-STATUS.md`
6. `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_15-14_finish-launch-gaps_handoff.md`

Respect the repo rules:

- Do not touch `_design_src/`.
- Preserve Portuguese copy.
- Do not add libraries.
- Do not run destructive git commands.
- Do not revert, reset, clean, or overwrite unrelated changes.
- If any code change would be needed, record it as a finding instead of making it.

## Start Here

Run:

```bash
pwd
git status --short --branch
bun --version
bun run build
```

If `bun run build` fails, continue the audit where possible, but label verification honestly. Do not fix the failure unless Maria explicitly asks.

If the build passes, start the dev server for browser verification:

```bash
bun run dev
```

Use Playwright MCP, agent-browser, or another available browser tool to inspect the app. If a preferred browser tool is unavailable, use the next credible method and report the downgrade.

## Execution Discipline

- Identify the first behavior-changing audit step before doing setup work. For this mission, the first goal-moving step is route and link inventory, not writing a report skeleton.
- Name scaffolding-only tasks as scaffolding.
- Do not spend the session only on setup, documentation, or tool preparation.
- If browser verification is blocked, keep auditing through source/API inspection and label the coverage gap precisely.
- Final outcome must be exactly one of: `setup-only`, `guardrail-only`, `behavior-changing`, `blocked`.
- For this audit-only mission, the expected final outcome is `guardrail-only` unless you are blocked before meaningful audit work.
- Final verification label must be exactly one of: `repo-standard verified`, `partial verification`, or `unverified`.
- Use `repo-standard verified` only if the build runs successfully and the audit checklist is completed for all reachable public/local flows.
- Use `partial verification` if authenticated, payment, email, production-only, or external-service flows cannot be fully exercised.
- Use `unverified` only if the intended build/browser checks cannot run at all.

## Delegation Rules

Use sub-agents only if available and useful. The main agent remains responsible for final judgement.

Suggested bounded lanes:

1. Route/link explorer, `gpt-5.4-mini`, effort `medium`
   - Build a route inventory from `app/`.
   - Scan internal `href` usage, redirects, dynamic routes, header/footer/sidebar links, product links, account links, admin links, legal links, and transactional links.
   - Report likely broken links, duplicate canonical paths, and links requiring dynamic sample data.

2. Storefront behavior explorer, `gpt-5.4-mini`, effort `medium`
   - Inspect storefront pages, search, product list filters, sort, product detail interactions, cart, checkout, account, order detail, contact, and legal/support pages.
   - Identify controls that only update state, are disabled, are hardcoded, or rely on mock data.

3. Admin/backend readiness explorer, `gpt-5.4-mini`, effort `medium`
   - Inspect admin routes, admin APIs, settings pages, product/order/customer management, emails, payments, webhooks, Supabase migrations/RPCs, and environment assumptions.
   - Identify missing backing tables, static mock arrays, fake handlers, and launch-time manual actions.

4. Verification/browser lane, `gpt-5.4-mini`, effort `medium`
   - Run browser checks across desktop and mobile viewports where possible.
   - Capture console errors, network failures, 404s, error overlays, broken images/fonts, and obvious layout blockers.

Do not wait on a sub-agent unless the next main-path audit step depends on its result. Do not duplicate work across lanes.

## Audit Scope

Audit both source and runtime behavior. A link or filter only counts as working if the runtime behavior proves it.

### Public Storefront Pages

Inspect at least:

- `/`
- `/produtos`
- `/pesquisa`
- `/pesquisa?q=expositor`
- Product detail pages using real sample product slugs/ids from the app or API.
- `/carrinho`
- Checkout route(s), using non-destructive checks only unless clearly local/test-safe.
- `/encomenda/[id]` using safe sample data if available.
- `/contacto`
- Account/auth entry routes such as `/conta`, `/entrar`, and any register/logout flows present.
- Static/legal/support pages reachable from header, footer, cart, checkout, or transactional pages.

### Admin Pages

Inspect at least:

- `/admin`
- `/admin/produtos`
- Product create/edit/detail routes if present.
- `/admin/encomendas`
- Order detail routes if present.
- `/admin/clientes`
- `/admin/clientes/[id]`
- `/admin/definicoes` and nested settings pages.
- Any admin marketing/content/pages/email routes present.

If Clerk/admin auth blocks runtime inspection, audit source/API behavior and record the exact auth blocker.

### APIs and Backend Readiness

Inspect at least:

- Product list/search/detail APIs.
- Cart/checkout/order creation APIs.
- Customer/account/order APIs.
- Admin products/orders/customers/stats/settings APIs.
- Contact/email sending path.
- EuPago webhook route.
- Supabase migrations/RPCs needed by checkout, orders, customers, products, shipping, pricing, and admin settings.
- Environment variable assumptions for Supabase, Clerk, Resend, EuPago, Vercel, and admin authorization.

## Link Audit Requirements

Create a link inventory from both:

1. Static source scan:
   - `next/link` `href` values.
   - Plain `<a href=...>`.
   - Router pushes/replaces.
   - Redirects.
   - Dynamic route builders.

2. Runtime crawl:
   - Header links.
   - Footer links.
   - Homepage CTAs.
   - Category/product cards.
   - Search result links.
   - Cart/checkout/account/order links.
   - Admin navigation/sidebar/action links.
   - Legal/support links.

For each link class, record:

- Source page/component.
- Target href.
- Whether it is static, dynamic, auth-gated, external, or manual-only.
- Runtime result: OK, 404, redirect OK, auth redirect OK, broken, blocked, or untested.
- Evidence: command, browser URL, status code, screenshot path, or file reference.

Do not claim "every link works" unless you have runtime or direct route-map evidence for every reachable internal link category.

## Filter, Search, Sort, and Control Audit

For each interactive control, prove whether it changes visible behavior.

### Storefront Controls

Check:

- Product list filters by material, dimensions, color/text, stock, max price, quick filters, and any other visible filter.
- Product list sort options.
- Filter combinations.
- Clear/reset behavior.
- No-results behavior.
- Search page query changes.
- Search result category filters if present.
- Product cards link to correct detail pages.
- Product detail variant/image/quantity controls if present.
- Add-to-cart behavior.
- Cart quantity increment/decrement/remove.
- Promo code UI behavior.
- Checkout form validation.
- Shipping/billing/NIF/company fields.
- Terms/consent gates.
- Contact form validation and success/error behavior.
- Newsletter or other forms if present.

### Admin Controls

Check:

- Product search/filter/sort/pagination.
- Product status actions and bulk actions.
- Product create/edit/delete/archive affordances.
- Orders search/filter/sort/status transitions.
- Customer search/filter/sort/detail navigation.
- Dashboard date ranges or KPI cards if interactive.
- Settings forms and save buttons.
- Any export, import, duplicate, publish, unpublish, archive, refund, resend, or print buttons.

For every control, classify:

- `works`
- `works with caveat`
- `disabled honestly`
- `visual-only`
- `broken`
- `blocked by auth/data/external service`

## Functional Completeness Audit

Assess whether the store is fully functional for launch. Cover:

- Product discovery: homepage, categories, PLP, search, product detail, related products.
- Product data: images, prices, variants, stock, SKU/reference, dimensions/materials/colors, descriptions.
- Cart: add/update/remove, totals, persistence, empty state.
- Checkout: customer data, addresses, NIF, shipping, payment handoff, validation, terms, order creation.
- Payments: EuPago route, webhook, idempotency, status mapping, manual registration.
- Orders: confirmation, order detail, account order history, admin order management.
- Customers: account data, profile ownership, addresses, B2B/B2C/company/NIF.
- Admin: products, variants, stock, orders, customers, settings, content, permissions.
- Email: contact, order confirmation, payment status emails, admin notifications.
- Legal/compliance: terms, privacy, cookie/privacy messaging if present, invoices/NIF path.
- Operational readiness: env vars, production URL assumptions, Clerk configuration, Supabase schema drift, Vercel deployment settings.
- UX readiness: loading states, empty states, error states, mobile behavior, inaccessible controls, broken images/fonts.
- Technical readiness: build, console errors, network failures, hydration/runtime errors, 404s, mock-data remnants.

## Source Scans To Run

Use `rg` or equivalent. At minimum scan for:

```bash
rg -n "TODO|FIXME|mock|hardcoded|placeholder|console\\.log|alert\\(|disabled|onClick=\\{\\(\\) => \\{\\}\\}|href=\"#\"|javascript:" app components lib supabase
rg -n "ORDERS|RESULTS|MOCK|fake|dummy|sample" app components lib
rg -n "redirect\\(|router\\.push|router\\.replace|href=" app components
rg -n "process\\.env|NEXT_PUBLIC_|SUPABASE|CLERK|RESEND|EUPAGO|ADMIN" app lib supabase
```

These scans are discovery aids, not conclusions. Verify findings before marking them as issues.

## Browser Verification Requirements

Use at least two viewports if browser tools work:

- Desktop: around `1440x900`.
- Mobile: around `390x844`.

Record:

- Console errors.
- Network 4xx/5xx.
- Next.js error overlays.
- Broken image/font requests.
- Obvious layout blockers.
- Controls hidden or unusable on mobile.

For filters, sort, and search, record before/after visible result evidence. Examples:

- product count before/after
- first 5 product names/prices before/after
- URL/query state before/after if relevant
- visible no-results state

## Safety Rules

- Do not submit real payments.
- Do not send real emails unless Maria explicitly authorizes it.
- Do not create real production orders unless Maria explicitly authorizes it.
- Prefer invalid-payload/API validation checks for forms that would send emails.
- For checkout, use source inspection and non-destructive browser validation unless a clearly local/test-safe path exists.
- If a flow requires credentials, mark it blocked by auth and list exactly what credential/access is needed.

## Severity Model

Use these severities:

- `P0 launch blocker`: prevents purchase, payment, order creation, legal invoicing, admin fulfillment, or basic navigation.
- `P1 launch risk`: does not fully block launch but can cause bad customer/admin outcomes.
- `P2 functional gap`: incomplete or misleading behavior that should be fixed soon.
- `P3 polish`: visual, wording, or low-risk cleanup.

For each finding include:

- Severity.
- Area.
- User-visible impact.
- Evidence.
- Likely source file(s).
- Suggested fix direction, without implementing it.
- Whether it is verified runtime behavior, source-level evidence, or an inference.

## Required Deliverable

Create a dated audit report at:

`AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/YYYY-MM-DD_HH-MM_full-store-audit.md`

Use the actual current date/time. Include:

1. Executive summary.
2. Final outcome label: exactly one of `setup-only`, `guardrail-only`, `behavior-changing`, `blocked`.
3. Verification label: exactly one of `repo-standard verified`, `partial verification`, `unverified`.
4. Commands run and results.
5. Environment/tooling notes.
6. Route and link inventory summary.
7. Broken/blocked link ledger.
8. Filter/search/sort/control matrix.
9. Storefront functional completeness matrix.
10. Admin functional completeness matrix.
11. Backend/API/schema readiness matrix.
12. Payment/email/webhook readiness.
13. Mobile/browser/runtime findings.
14. Mock/static/visual-only remnants.
15. P0/P1/P2/P3 findings, sorted by severity.
16. "Fully functional launch gap list" with the smallest recommended fix batches.
17. Manual launch actions.
18. Open questions that materially affect implementation.
19. Evidence appendix with screenshots/logs/file references where applicable.

In the final chat response, return:

1. The Windows absolute path to the saved audit report first.
2. The final outcome label.
3. The verification label.
4. The count of P0/P1/P2/P3 findings.
5. The top 10 highest-risk findings.
6. The exact commands run and whether they passed.
7. Any flows that could not be tested and why.

## What Does Not Count As Success

- Only reading code without runtime link/control checks where browser verification is possible.
- Only testing the homepage and product list.
- Saying "all links work" without a link inventory.
- Saying "filters work" when a control only updates state or UI text.
- Treating auth-gated or external-service flows as working without evidence.
- Treating mock arrays or visual-only controls as acceptable without explicitly classifying them.
- Producing only a chat summary without saving the audit report.
- Fixing code instead of auditing and reporting.

## Critical Assumptions

- Bun is available in WSL; use `bun` directly.
- The repo may already be dirty. Do not revert unrelated work.
- Some authenticated/admin/payment/email flows may need credentials or production configuration. If access is missing, report the exact blocked coverage instead of guessing.
- The audit should be broad and deep, but still evidence-based. Separate facts, inferences, assumptions, and open questions.
