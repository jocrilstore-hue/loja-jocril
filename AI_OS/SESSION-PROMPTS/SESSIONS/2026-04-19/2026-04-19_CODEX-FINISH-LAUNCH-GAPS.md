# Codex Prompt - Finish Jocril Launch Gaps

Recommended model: `gpt-5.4`
Recommended reasoning effort: `high` for the main agent, `medium` for implementation workers, `low` or `medium` for explorer/verification subagents.

Why: this is a mixed repository, database, admin, checkout, auth, and launch-ops mission. It needs strong coding plus enough judgement to avoid inventing risky schema or breaking working checkout/payment paths.

## Mission

You are in:

`/mnt/c/Users/maria/Desktop/pessoal/jocril/LOJA-ONLINE`

Finish the launch gaps listed in:

`AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_FULL-PROJECT-STATUS.md`

Maria does not want to babysit routine implementation. Proceed autonomously on reversible code changes, but stop for destructive git, missing access, external-service actions, or a schema/business decision that materially changes the outcome.

## Read First

Read these before editing:

1. `AGENTS.md`
2. `AI.md`
3. `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md`
4. `AI_OS/AI_DECISION_LOG.md`
5. `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_FULL-PROJECT-STATUS.md`

Respect these repo rules:

- Do not touch `_design_src/`.
- Preserve Portuguese copy verbatim.
- Keep inline styles and CSS custom properties.
- Do not add libraries without approval.
- After any code change, run `bun run build` before claiming completion.
- Stop after 2 failed fix attempts on the same issue.
- Do not run destructive git commands.

## Execution Discipline

- Identify the first behavior-changing step that directly advances the real goal before doing setup work.
- Name any scaffolding-only tasks as scaffolding.
- Do not spend the session only on setup, documentation, coordination artifacts, or guardrails.
- If the first behavior-changing step is blocked, stop and report the blocker instead of substituting adjacent useful work.
- Prefer the smallest direct goal-moving lane over broad refactors.
- Final outcome must be exactly one of: `setup-only`, `guardrail-only`, `behavior-changing`, `blocked`.
- Final verification label must be exactly one of: `repo-standard verified`, `partial verification`, or `unverified`.

## Coding Discipline

- Surface material assumptions before editing. Ask only if ambiguity would materially change the result.
- Prefer the smallest direct implementation. Do not add speculative features, abstractions, options, or framework changes.
- Keep edits surgical: touch only files needed for the current gap, match local style, and avoid drive-by cleanup or formatting.
- Clean up only unused code introduced or orphaned by your own change.
- Do not treat static docs, plans, or comments as implementation progress.

## Git Safety

Start with:

```bash
git status --short --branch
```

The working tree may already be dirty. Do not revert, reset, clean, stash-drop, or overwrite unrelated changes. Work with existing changes.

If branch creation is safe in the current environment, create a working branch named:

`codex/finish-launch-gaps`

If branch creation is blocked or the branch already exists, continue on the current branch and report that choice. Do not stop only because the tree is dirty.

## Orchestration

Use one strong main lane plus bounded subagents if available.

Main agent:

- Model: `gpt-5.4`
- Effort: `high`
- Owns the critical path, database/API judgement, integration, final build, and final report.

Explorer subagents:

- Model: `gpt-5.4-mini`
- Effort: `medium`
- Use for read-only facts, schema checks, affected-file mapping, and verification summaries.

Worker subagents:

- Model: `gpt-5.4` for database/API or multi-file coding.
- Model: `gpt-5.4-mini` only for very small mechanical edits.
- Give each worker a disjoint write scope.
- Tell workers they are not alone in the codebase, must not revert others' edits, and must adapt to existing changes.

Good worker splits if needed:

1. Storefront worker: `app/(store)/produtos/produtos-client.tsx`, `app/(store)/pesquisa/page.tsx`, `app/(store)/conta/page.tsx`, route cleanup links.
2. Admin data worker: `app/api/admin/stats/route.ts`, `app/admin/page.tsx`, customer endpoints, `app/admin/clientes/*`.
3. Admin product tooling worker: `app/api/admin/products/*`, `app/admin/produtos/page.tsx`.

Do not delegate the next blocking step. Do not create overlapping write scopes.

## Gap Ledger

Maintain this checklist while working. Each item must end as `[done]`, `[manual]`, or `[blocked]` with evidence.

1. PLP filters/sort actually apply.
2. NIF legal path verified and visible where needed.
3. Eupago webhook registration handled as a manual launch action.
4. `/conta` orders tab uses live orders.
5. `/pesquisa` uses live search results.
6. Admin product list uses real product images.
7. Admin dashboard uses live stats.
8. `/admin/clientes` list/detail use live data.
9. Admin product pagination is real.
10. Admin product bulk actions have real handlers.
11. `/contacto` form has a backend action.
12. Promo codes field has backend-backed behavior or is explicitly blocked by missing discount model.
13. `/conta` profile edit is wired to a real persistence path or explicitly blocked by profile-data ownership.
14. Overlapping order detail routes are resolved.
15. Admin `definicoes/*` routes are wired where backing tables exist and explicitly classified where schema/business backing is missing.

## Known Evidence To Verify, Not Ignore

NIF may already be persisted:

- `app/(store)/carrinho/page.tsx` sends `customer.nif`.
- `app/api/orders/route.ts` forwards `customer.nif` into `p_customer`.
- `supabase/migrations/20251220112000_create_order_tables.sql` defines `customers.tax_id`.
- `supabase/migrations/20251227200000_create_complete_order_rpc.sql` writes `p_customer->>'nif'` into `customers.tax_id`.

Do not blindly add a duplicate NIF column. First verify whether the real missing piece is read-side visibility in admin/customer/order views or production DB drift.

Admin product images:

- Do not assume `product_templates.main_image_url`.
- Inspect existing image backing first. Current evidence points to `product_variants.main_image_url` and/or `product_template_images.image_url`.

Settings routes:

- Existing likely backing: `shipping_zones`, `shipping_classes`, `shipping_rates`, `shipping_settings`, `price_tiers`, `admin_apply_price_tiers`, `site_content`.
- Likely missing backing: discount codes, tax settings, team management.
- If a setting has no clear table/API and would require business decisions, mark it `[blocked]` with the exact missing decision instead of inventing a large system.

## Implementation Order

### Wave 1 - Launch blockers and customer path

1. Fix PLP filters/sort in `app/(store)/produtos/produtos-client.tsx`.
2. Verify NIF persistence. If it already writes to `customers.tax_id`, expose/confirm it in the admin/customer/order read path needed for invoicing. If it does not persist in the actual code/schema, add the smallest migration and RPC/API change needed.
3. Mark Eupago webhook registration as `[manual]` with the exact production URL: `https://loja-jocril-qcma.vercel.app/api/webhooks/eupago`.
4. Wire `/conta` orders tab to existing `GET /api/orders`.
5. Resolve `/conta/encomenda/[id]` vs `/encomenda/[id]`; prefer `/encomenda/[id]` as canonical unless local code proves otherwise. Use a redirect/shim if safer than deletion.
6. Wire `/pesquisa` to the existing live search flow/RPC.

Run `bun run build`.

### Wave 2 - Admin essentials

1. Add `GET /api/admin/stats` and wire `/admin`.
2. Add customer list/detail APIs and wire `/admin/clientes` plus `/admin/clientes/[id]`.
3. Fix admin product thumbnails by selecting existing image data.
4. Wire client-side admin product pagination.
5. Wire bulk publish, unpublish, and archive using existing product routes if possible.
6. Implement duplicate only if the product template, variants, and image clone path is clear. Otherwise mark duplicate `[blocked]` with the exact missing clone decision.

Run `bun run build`.

### Wave 3 - Minor customer/admin gaps

1. Add `/contacto` backend using the smallest existing email path. Prefer email to `ADMIN_EMAIL`; do not create a database table unless clearly needed.
2. Promo codes: if a discount model already exists, wire it. If no discount table/RPC exists, either create the smallest durable discount-code model or mark `[blocked]` if the business rules are missing. Do not fake validation.
3. Profile edit: wire name/profile fields to Clerk where Clerk owns them; wire address/company/NIF fields to Supabase customer/shipping records if existing schema supports it. If ownership is ambiguous, mark the specific fields `[blocked]`.
4. Admin `definicoes/*`: wire pages backed by existing tables first, especially shipping and price tiers. For discounts/taxes/team pages with no clear backing, mark `[blocked]` with precise required decisions.

Run `bun run build`.

### Wave 4 - Verification and handoff

Run the strongest feasible verification:

```bash
bun run build
```

If a dev server is needed for browser checks:

```bash
bun run dev
```

Then check the changed user flows:

- `/produtos`: filters and sort change rendered products.
- `/pesquisa?q=...`: results are live, not the hardcoded array.
- `/conta`: logged-in orders tab is live and links to canonical details.
- `/encomenda/[id]`: canonical detail route works.
- `/admin`: stats are live.
- `/admin/clientes`: list/detail are live.
- `/admin/produtos`: thumbnails, pagination, and bulk actions work.
- `/contacto`: backend submission returns a real success/error state.
- `/carrinho`: NIF and promo behavior match the final implemented/backend-backed path.
- `/api/webhooks/eupago`: GET returns the expected health response if implemented that way.

If auth or production credentials block a check, label it `partial verification` and state exactly what was blocked.

## What Does Not Count As Success

- Filters/sort that only update state but do not change rendered results.
- Mock arrays still driving `/conta`, `/pesquisa`, `/admin`, or `/admin/clientes`.
- A NIF duplicate column added without first verifying `customers.tax_id`.
- A promo code UI that accepts input without backend validation.
- Admin bulk buttons that only clear selection or log to console.
- Settings pages described as complete while still fully static.
- Docs-only or handoff-only work described as implementation.

## External Manual Launch Actions

These are manual unless you have authenticated tooling that can safely perform them:

- Register Eupago webhook:
  `https://loja-jocril-qcma.vercel.app/api/webhooks/eupago`
- Confirm Vercel production env vars.
- Confirm Clerk production origins, redirects, and admin metadata.
- Confirm live Supabase has the expected schema/RPCs.
- Run live smoke checks after deploy.

## Final Report Format

Return:

1. Final outcome label: `setup-only`, `guardrail-only`, `behavior-changing`, or `blocked`.
2. Verification label: `repo-standard verified`, `partial verification`, or `unverified`.
3. Gap ledger with all 15 items marked `[done]`, `[manual]`, or `[blocked]`.
4. Changed files grouped by area.
5. Exact verification commands run and their results.
6. Manual launch actions still required.
7. A dated handoff file path under `AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`.

Do not claim launch readiness unless code verification and the manual launch actions are both complete or clearly separated.
