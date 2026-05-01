# DOCS_INDEX — Jocril LOJA-ONLINE

Single map of all documentation. Update this file whenever a doc is created, updated, or archived.

## AI Operating System (WARM — update when AI workflow changes)

| File | Description |
|------|-------------|
| [AI loader](../AI.md) | Universal AI entry point for Codex, Claude, ChatGPT, Gemini, and other agents |
| [AI operating system](../AI_OS/AI_OPERATING_SYSTEM.md) | Cross-tool operating rules adapted from the desktop AI_OS master |
| [Context rules](../AI_OS/CONTEXT_RULES.md) | Context priority, tool boundaries, handoff and decision discipline |
| [Model selection guide](../AI_OS/MODEL_SELECTION_GUIDE.md) | Model and effort routing across providers |
| [Decision log](../AI_OS/AI_DECISION_LOG.md) | Durable project decisions future AI sessions must respect |
| [Memory index](../AI_OS/MEMORY_INDEX.md) | Ranked AI-facing map of hot workstreams, proven paths, failed approaches, regression risks, and cold archives |
| [AI session start](../AI_OS/SESSION-PROMPTS/AI_SESSION_START.md) | Standard boot sequence for AI sessions |
| [Session handoff template](../AI_OS/SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md) | Template for substantial session handoffs |
| [Current AI_OS standard](../AI_OS/references/AI_OS_CURRENT_STANDARD.md) | Local copy of the current master standard used for future audits |

## Handoffs (Temporary — archive when milestone consumed)

| File | Description |
|------|-------------|
| [M0 handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/2026-04-18_M0_handoff.md) | M0 scaffold — Next.js 16, tokens, fonts, assets |
| [M1 handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/2026-04-18_M1_handoff.md) | M1 shared foundations — StoreHeader, StoreFooter, layout, primitives |
| [M2 complete handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/2026-04-18_M2-complete_handoff.md) | M2 all storefront pages — 18 routes, clean build |
| [M3 complete handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/2026-04-18_M3-complete_handoff.md) | M3 admin back-office — 20 routes, 2 shared component files, clean build |
| [M4 handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/2026-04-18_M4_handoff.md) | M4 legal + transactional — 5 legal routes, not-found, error, manutencao, clean build |
| [B1 complete handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B1-COMPLETE_handoff.md) | B0+B1 storefront read path live — homepage, PLP, PDP, categorias wired to Supabase |
| [B2 handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B2_handoff.md) | B2 Clerk auth — headless hooks on PT URLs, admin+user gates, middleware |
| [B3 handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B3_handoff.md) | B3 cart state — localStorage context, PDP add, live /carrinho, empty state |
| [B4a handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B4a_handoff.md) | B4a Eupago backend — 5 API routes, zod, webhook, order RPC. B4b = UI wiring |
| [B4b handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B4b_handoff.md) | B4b checkout UI — /carrinho step 2+3 wired, MB Way polling, error banners, CSS status vars |
| [Session end handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_SESSION-END_handoff.md) | B5+B6+B7+B8 complete — deploy live, full audit with 10 known gaps |
| [B5–B8 master plan](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B5-B8_MASTER-PLAN.md) | Wave 1 parallel (B5+B6), Wave 2 B7 emails, Wave 3 B8 deploy — human gates documented |
| [AI_OS sync handoff](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_14-38_jocril_ai-os-sync_handoff.md) | Project AI_OS adapted from desktop master, loader and decision log added |

## Session Prompts (Ready-to-paste) — B5–B8

| File | Description |
|------|-------------|
| [B5 customer account](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B5_customer-account.md) | /conta, /encomendas, /encomenda/[id] — Clerk + existing GET /api/orders |
| [B6 admin writes](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B6_admin-writes.md) | Admin mutation APIs + form wiring — Opus 4.7 recommended |
| [B7 emails](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B7_emails.md) | Resend infra + 3 stripped call sites — needs RESEND_API_KEY first |
| [B8 deploy](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B8_deploy.md) | Vercel config, env var checklist, post-deploy manual steps |

## Session Prompts (Ready-to-paste)

| File | Description |
|------|-------------|
| [prompt-M3-admin](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/prompt-M3-admin.md) | M3: Admin spine prompt |
| [prompt-M4-legal-transactional](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/prompt-M4-legal-transactional.md) | M4: Legal + transactional pages |
| [prompt-M_MKT-marketing](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/prompt-M_MKT-marketing.md) | M_MKT: Marketing site port |
| [prompt-M5-integration](../AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/prompt-M5-integration.md) | M5: Supabase + auth integration |

## Plan

| File | Description |
|------|-------------|
| [Master plan](../../.claude/plans/write-down-a-plan-quiet-ember.md) | Full M0–M5 milestone plan with route map |
