# My Precious Codex - Finish Jocril Store From Launch Audit

Date: 2026-04-19 15:56 WEST
Project: Jocril LOJA-ONLINE
Target surface: Codex desktop / Codex CLI in the existing repository
Source audit: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_15-46_full-store-audit.md`

## Recommended Execution Mode

Autonomous bounded implementation mission.

Use `gpt-5.4` with high reasoning for the main lane because this is high-risk launch completion work touching auth routing, checkout, privacy, admin fulfillment, schema/API consistency, and browser verification.

Use sub-agents sparingly and only for independent side lanes. Do not create a giant unmanaged swarm. Use a bounded swarm with one main agent plus at most three active side lanes at a time.

## Critical Assumptions

- External EuPago panel registration is excluded from this coding mission. Maria will access the EuPago panel and place the required callback information there.
- Code-side EuPago defects are not the same as panel setup. If source inspection still confirms the webhook customer schema mismatch, fix the local code because that is application behavior.
- The mission goal is launch readiness, not redesign. Prefer making controls truthful and working over expanding scope.
- No new libraries unless Maria explicitly approves.
- Do not touch `_design_src/`.
- Preserve Portuguese URLs and Portuguese user-facing strings unless the change is a broken link correction.
- Keep the inline-style port. Do not convert to Tailwind, CSS modules, shadcn, react-hook-form, zod, or framer-motion.

## Real User Goal

Finish the Jocril online store enough to remove the launch blockers and high-risk gaps identified in the full store audit, excluding the manual EuPago panel registration step.

The work should turn the audit from `guardrail-only` into a real `behavior-changing` implementation session.

## First Behavior-Changing Step

Before doing any docs, handoffs, broad cleanup, or new planning, fix the public `/contacto` auth bug:

- inspect `proxy.ts`
- change the matcher so `/conta` and `/conta/...` remain protected
- ensure `/contacto` is public
- verify `/contacto` no longer redirects signed-out users to `/entrar`

If this first step is unexpectedly blocked, stop and report the blocker instead of substituting another useful task.

## Execution Discipline

- Identify the first behavior-changing step that directly advances the real goal before doing setup work.
- Name any scaffolding-only tasks as scaffolding.
- Do not spend the session only on setup, documentation, coordination artifacts, or guardrails.
- If the first behavior-changing step is blocked, stop and report the blocker instead of substituting adjacent useful work.
- Prefer the smallest direct goal-moving lane over the cleanest documentation or coordination lane.
- Stop after two failed fix attempts on the same issue and report options.
- Final result must be classified as exactly one of: `setup-only`, `guardrail-only`, `behavior-changing`, `blocked`.

## Coding Discipline

- Surface material assumptions before editing. Ask if ambiguity would materially change the outcome; otherwise choose the smallest reversible path and state it.
- Prefer the smallest direct implementation. Do not add speculative features, abstractions, options, or framework changes.
- Keep edits surgical: touch only files needed for this request, match local style, and avoid drive-by cleanup or formatting.
- Clean up only unused code introduced or orphaned by your own change.
- Define concrete success criteria before claiming completion, then verify with the lightest credible repo-standard check.

## Orchestration Plan

### Main Agent - Launch Integrator

Model: `gpt-5.4`
Reasoning: high

Owns:

- critical path and sequencing
- first behavior-changing step
- deciding which open questions require Maria
- integrating side-lane work
- final build/browser verification
- final report and handoff

The main agent must not delegate final integration judgment or final verification signoff.

### Explorer Lane A - Route, Link, And Storefront Map

Model: `gpt-5.4-mini`
Reasoning: medium

Read-only. Find exact source locations and expected behavior for:

- `/contacto` auth matcher
- stale legal links `/termos` and `/privacidade`
- header search
- PLP material filters, pagination, footer query links
- font 404 source
- account sign-out button
- PDP/search decorative CTAs that should be hidden, disabled, or wired

Return a concise file/line map and do not edit files.

### Explorer Lane B - Backend, Schema, Admin Data Map

Model: `gpt-5.4-mini`
Reasoning: medium

Read-only. Find exact source and schema truth for:

- admin order list/detail APIs and page data shape
- order/customer/items/shipping/payment tables and RPCs
- public order detail lookup and ownership options
- checkout order creation path and legal consent insertion point
- product/variant save API payloads and backing columns
- `price_tiers` table or migration status
- EuPago webhook customer select/name composition, excluding panel registration

Return a concise file/line map and do not edit files.

### Worker Lane 1 - Public Storefront Truth

Model: `gpt-5.3-codex`
Reasoning: high

Write scope:

- `proxy.ts`
- `components/store/StoreHeader.tsx`
- `app/(store)/entrar/page.tsx`
- `app/(store)/produtos/*`
- `components/store/StoreFooter.tsx`
- `public/styles/colors_and_type.css`
- any directly necessary storefront component for these fixes only

Responsibilities:

- fix `/contacto` auth bug
- wire header search to `/pesquisa?q=...`
- fix stale legal links
- fix material filter behavior against actual data, or make the UI labels/counts truthful to available data
- either implement PLP pagination or remove/disable the false pagination affordance
- remove or correct unsupported footer product query links
- fix font URL path 404s

Do not touch admin or checkout files.

### Worker Lane 2 - Checkout, Order Privacy, And Account

Model: `gpt-5.3-codex`
Reasoning: high

Write scope:

- `app/(store)/carrinho/page.tsx`
- `app/(store)/encomenda/[id]/page.tsx`
- account pages/components directly needed for sign-out
- API files directly required for order privacy, if any

Responsibilities:

- add required checkout terms/privacy consent before order creation
- fix public order-detail privacy risk with the smallest safe model
- wire account sign-out if it is currently a dead button

Default privacy decision:

- If a signed-in ownership path already exists, require ownership for `/encomenda/[id]`.
- If the existing checkout depends on a guest success page, preserve the success flow only with a non-guessable token/secret already available in the order creation response. If no safe token exists, stop and ask Maria before inventing a new guest-order access model.

Do not touch PLP/admin files.

### Worker Lane 3 - Admin Fulfillment And Catalog Honesty

Model: `gpt-5.3-codex`
Reasoning: high

Write scope:

- `app/admin/encomendas/[id]/page.tsx`
- `app/api/admin/orders/*`
- `components/admin/ProductFormPage.tsx`
- `components/admin/VariantFormPage.tsx`
- directly necessary admin catalog API files

Responsibilities:

- replace hardcoded admin order detail data with real order/customer/items/shipping/payment data
- keep status PATCH working
- hide, disable, or honestly label admin actions that remain unwired
- wire product/variant fields only when backing schema/API already exists
- avoid inventing a large catalog schema in this mission

Do not touch public storefront files.

### Worker Lane 4 - Schema/API Consistency

Model: `gpt-5.3-codex`
Reasoning: high

Use only if Explorer Lane B shows real schema drift that blocks the above work.

Write scope:

- `supabase/migrations/*`
- affected API/RPC files only

Responsibilities:

- reconcile confirmed `price_tiers` schema drift with the smallest migration or API change
- fix local EuPago webhook customer select/name composition if still stale
- align admin env naming only if needed for visible behavior

Do not perform external EuPago panel setup, live payment tests, or production Supabase mutations without Maria's explicit approval.

### Verification Lane

Model: `gpt-5.4-mini`
Reasoning: medium

Run after main integration or in parallel once stable:

- build verification
- route checks
- browser smoke
- targeted runtime checks for changed flows
- regression check that already-working PLP/PDP/cart/search paths still work

Return evidence only. The main agent decides final status.

## Delegation Rules

1. Keep the main agent on the immediate blocking step.
2. Delegate only concrete side tasks with non-overlapping scope.
3. Use the cheapest sufficient model per lane.
4. Do not wait on sub-agents unless the next main-path action is blocked on their result.
5. The main agent remains responsible for final verification and integration.
6. Workers must know they are not alone in the codebase and must not revert edits made by others.
7. No worker may touch `_design_src/` or add libraries.

## Implementation Batches

### Batch 1 - Public Blockers And Broken Links

Must complete first:

- `/contacto` public route fixed
- `/termos` and `/privacidade` register links corrected to `/legais/termos` and `/legais/privacidade`
- header search navigates to `/pesquisa?q=...`
- font paths stop 404ing

Acceptance checks:

- `/contacto` returns 200 signed-out in local dev
- header search from `/` reaches `/pesquisa?q=expositor`
- `/legais/termos` and `/legais/privacidade` reachable from auth/register copy
- browser console no longer shows `/styles/fonts/geist-*.woff2` 404s

### Batch 2 - Checkout Trust And Order Privacy

Must complete before launch:

- checkout requires explicit terms/privacy consent before order creation
- order detail access is not publicly guessable
- account sign-out button works or is removed/hidden if the account shell is not launch-ready

Acceptance checks:

- attempting checkout without consent blocks submission with clear Portuguese copy
- existing required-field validation still works
- unauthorized order detail access does not expose order/customer details
- signed-out/public route behavior remains intentional

### Batch 3 - Product Discovery Correctness

Must complete before launch:

- material filters align with real product data
- PLP pagination is either real or no longer falsely presented
- unsupported footer product query links are corrected, removed, or made honest
- existing sort, quick price, dimension, search, PDP, add-to-cart, and cart quantity behavior still work

Acceptance checks:

- `Acrilico`/material filter chosen from UI returns truthful results
- `Preco desc`, `Ate EUR50`, `A4`, and max-price checks still behave
- `/pesquisa?q=expositor` still returns products
- PDP add-to-cart still updates cart

### Batch 4 - Admin Fulfillment Truth

Must complete before staff use:

- admin order detail fetches real order data by route id/order number
- hardcoded mock order shell is removed
- order status update remains wired
- dangerous/wrong actions are hidden or disabled until truly wired

Acceptance checks:

- source contains no hardcoded customer/order fixture driving `app/admin/encomendas/[id]/page.tsx`
- unauthenticated admin APIs still return 403
- authenticated/admin path is verified if credentials are available; otherwise report as not fully runtime-tested

### Batch 5 - Admin Catalog And Settings Honesty

Must complete as launch-hardening:

- product/variant editors do not imply persistence for fields that are not saved
- fields with existing schema/API backing are persisted correctly
- admin settings pages hide, disable, or honestly label visual-only actions
- `price_tiers` drift is confirmed and reconciled if it blocks current UI/API behavior

Acceptance checks:

- no visible admin save/import/export/toggle control silently pretends to persist when it does not
- product/variant save payload matches visible editable launch fields
- any migration added is minimal and tied to existing code needs

### Batch 6 - Code-Side EuPago Only

Do this only after separating it from Maria's panel task:

- fix local webhook customer select/name composition if stale
- do not register the webhook in the EuPago panel
- do not run live payment callbacks without explicit permission

Acceptance checks:

- webhook code matches current customer schema
- health route remains 200
- invalid webhook/payment payloads still fail safely

## What Does Not Count As Success

- Creating another audit or plan without changing application behavior.
- Fixing only EuPago panel instructions.
- Hiding every broken control without fixing the P0/P1 customer-facing launch blockers.
- Passing TypeScript while leaving `/contacto` redirected to login.
- Claiming admin order detail is fixed while still rendering hardcoded order/customer/items.
- Claiming checkout is launch-ready without a consent gate.
- Claiming repo-standard verification if the build did not run successfully in a valid project runtime.

## Verification Requirements

Use exactly one final verification label:

- `repo-standard verified`
- `partial verification`
- `unverified`

Do not imply stronger proof than the chosen label supports.

Minimum verification for `repo-standard verified`:

1. Run the repo build. In this checkout, prefer the Windows Bun binary from WSL if plain WSL Bun still fails on the `next` shim:
   - first try `bun run build`
   - if it fails only with the known `next: command not found` shim issue, run `/mnt/c/Users/maria/.bun/bin/bun.exe run build`
2. Start local dev server.
3. Run route checks for:
   - `/`
   - `/produtos`
   - `/pesquisa?q=expositor`
   - `/produtos/bolsa-resistente-a-agua-autoadesivo-a3`
   - `/carrinho`
   - `/contacto`
   - `/legais/termos`
   - `/legais/privacidade`
   - `/encomenda/AUDIT-NOT-FOUND`
   - representative `/admin/*` unauthenticated redirect/API 403 checks
4. Browser-test:
   - `/contacto` signed-out public access
   - header search
   - PLP material filter
   - PLP sort/quick/dimension/max-price regressions
   - PDP add-to-cart
   - cart quantity update
   - checkout consent block
   - mobile `/produtos` no horizontal overflow
5. Confirm font 404s are gone in browser console.
6. Confirm no live payment/email side effects were performed unless Maria explicitly approved them.

If authenticated admin/customer tests cannot run because credentials/session are unavailable, say that clearly and use `partial verification` unless all critical behavior has been verified through safe API/source checks and a valid authenticated test path.

## Required Final Report

Start the final response with the path to any handoff or implementation report saved under:

`C:\Users\maria\Desktop\pessoal\jocril\LOJA-ONLINE\AI_OS\SESSION-PROMPTS\SESSIONS\2026-04-19\`

Then report:

- final outcome label: `setup-only`, `guardrail-only`, `behavior-changing`, or `blocked`
- verification label: `repo-standard verified`, `partial verification`, or `unverified`
- files changed
- behavior changed by batch
- commands run and pass/fail
- browser/manual checks run and pass/fail
- flows not tested and why
- remaining EuPago panel action for Maria, if still relevant
- any unresolved decisions that need Maria

## Prompt To Execute

You are Codex working in:

`/mnt/c/Users/maria/Desktop/pessoal/jocril/LOJA-ONLINE`

Execute an autonomous bounded implementation mission to finish the Jocril store from the audit:

`AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_15-46_full-store-audit.md`

Exclude the manual EuPago panel registration because Maria will do that outside the codebase. Do fix code-side EuPago defects only if source inspection confirms they are local application bugs.

Follow root `AGENTS.md`, `AI.md`, and relevant `AI_OS/` rules. Do not touch `_design_src/`. Do not add libraries. Preserve inline styles, CSS custom properties, Portuguese URLs, and Portuguese copy unless correcting broken links.

First behavior-changing step: fix the `/contacto` auth matcher bug and verify signed-out `/contacto` access. If blocked, stop and report the blocker.

Use the orchestration plan above: one main agent owns the critical path and final quality bar; use bounded explorer/worker/verification lanes only when they have independent non-overlapping scope. Keep at most three side lanes active at once.

Implement the batches in order:

1. public blockers and broken links
2. checkout trust and order privacy
3. product discovery correctness
4. admin fulfillment truth
5. admin catalog/settings honesty
6. code-side EuPago only, excluding panel registration

Before claiming completion, run the verification requirements above. Save a dated implementation handoff/report in `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/`. Final result must use exactly one outcome label and exactly one verification label.
