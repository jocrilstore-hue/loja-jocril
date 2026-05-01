# MEMORY_INDEX.md

> Short, ranked AI memory map for this project. Keep this file under 200 lines.
> Point to evidence; do not duplicate full handoffs, research, logs, or docs.

Last reviewed: 2026-05-01

---

## Purpose

Use this file when project memory becomes too large to scan directly.

This index tells future AI sessions what is hot, what is proven, what failed, what tends to regress, and what is cold or archived. Actual code, current user instructions, `AI_DECISION_LOG.md`, and direct evidence still win when sources conflict.

---

## Reading Order

At session start:

1. Read current user instructions.
2. Inspect actual project files or code when the task depends on reality.
3. Read root `AGENTS.md`, `AI.md`, and `CLAUDE.md` for local rules.
4. Read `AI_OS/AI_DECISION_LOG.md` for stable architectural decisions.
5. Read this file to rank handoffs, research, failed attempts, and regression risks.
6. Load only the docs, handoffs, logs, or references named here that are relevant to the task.

---

## Hot Now

Current active workstreams and the most useful place to resume.

| Workstream | Status | Read first | Next action | Last updated |
|---|---|---|---|---|
| Launch gaps | Active known gaps after B5-B8 | `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_FULL-PROJECT-STATUS.md`, `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_SESSION-END_handoff.md` | Start with PLP filters/sort, NIF persistence, `/conta` orders, `/pesquisa`, and Eupago webhook registration. | 2026-04-19 |
| Faithful design port | Always-on implementation constraint | `AGENTS.md`, `CLAUDE.md`, `_design_src/jocril-design-system/project/` | Preserve inline styles, CSS vars, Portuguese copy, and route conventions. | 2026-05-01 |
| AI_OS project memory | Newly added routing layer | `AI_OS/MEMORY_INDEX.md`, `docs/DOCS_INDEX.md`, `AI_OS/AI_DECISION_LOG.md` | Keep reusable discoveries here as short evidence pointers. | 2026-05-01 |

---

## Proven Working

Solutions, behaviors, commands, integrations, or workflows that have evidence.

| What works | Evidence | Source | Last verified | Protect with |
|---|---|---|---|---|
| M0-M4 design port and B1-B8 backend/storefront milestones reached clean build states. | Handoff index records milestone completion; full status records 48 routes and 0 errors. | `docs/DOCS_INDEX.md`, `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_FULL-PROJECT-STATUS.md` | 2026-04-19 | Preserve route map and build with `bun run build` after code changes. |
| Storefront read path, checkout APIs, admin products/orders, Clerk, Eupago, Resend, and cart context are wired. | Full status and session-end handoff list live routes/API endpoints. | `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_FULL-PROJECT-STATUS.md`, `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_SESSION-END_handoff.md` | 2026-04-19 | Check affected endpoints and pages before modifying related flows. |
| Project-local AI_OS adapted from desktop master. | Decision log records local AI_OS adaptation and preservation of handoffs. | `AI_OS/AI_DECISION_LOG.md` | 2026-04-19 | Preserve `AI_OS/SESSION-PROMPTS/SESSIONS/` and root project rules. |

---

## Do Not Retry

Failed approaches, discarded hypotheses, dead ends, and misleading paths.

| Do not retry | Why it failed | Evidence | Better path | Last updated |
|---|---|---|---|---|
| Converting the design port to Tailwind/CSS modules/styled-components. | Project requires faithful inline-style port from the design bundle. | `AGENTS.md`, `CLAUDE.md` | Keep inline `style={{...}}`, CSS custom properties, and existing utility classes only. | 2026-05-01 |
| Translating or improving Portuguese copy. | Copy must stay verbatim. | `AGENTS.md`, `CLAUDE.md` | Preserve strings unless Maria explicitly asks for copy changes. | 2026-05-01 |
| Adding new libraries for forms, validation, motion, or UI without approval. | `shadcn/ui`, `react-hook-form`, `zod`, and `framer-motion` additions are explicitly blocked unless approved. | `AGENTS.md`, `CLAUDE.md` | Use existing stack and local primitives. | 2026-05-01 |
| Treating `_design_src/` as editable implementation. | It is the read-only source of truth and gitignored. | `AGENTS.md`, `CLAUDE.md` | Read it for parity; implement in app files. | 2026-05-01 |

---

## Regression Watchlist

Behaviors that have broken before or are easy to break.

| Behavior to preserve | Why fragile | Check before/after changes | Source | Last verified |
|---|---|---|---|---|
| PLP filters and sort are known broken until fixed. | State updates but was not applied to product arrays. | Inspect `app/(store)/produtos/produtos-client.tsx`; verify products filter/sort with UI or tests after fix. | `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_FULL-PROJECT-STATUS.md` | 2026-04-19 |
| NIF must be persisted for invoicing. | Checkout field existed but persistence was suspected missing. | Verify `orders` table/RPC/payload before launch. | `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_FULL-PROJECT-STATUS.md` | 2026-04-19 |
| Eupago webhook registration is a manual launch blocker. | Orders can be created but payment confirmations will not fire until registered. | Confirm webhook URL in Eupago: `https://loja-jocril-qcma.vercel.app/api/webhooks/eupago`. | `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_SESSION-END_handoff.md` | 2026-04-19 |
| Build must stay clean after code changes. | Project rules require fresh verification. | Run `bun run build` after any code change. | `AGENTS.md`, `CLAUDE.md`, `AI.md` | 2026-05-01 |

---

## Cold Or Archived

Large or historical artifacts that are useful only when their topic is active again.

| Topic | Location | Use when | Status |
|---|---|---|---|
| M0-M5 and B1-B8 milestone handoffs | `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/`, `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/` | Resuming a specific milestone or verifying why a route/API exists. | Warm/cold; prefer full status for current launch state. |
| Ready-to-paste milestone prompts | `docs/DOCS_INDEX.md` session prompt rows | Re-running or adapting a milestone execution. | Cold unless that milestone is active. |
| Runtime audit artifacts | `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/runtime-audit.*` | Investigating the 2026-04-19 full-store audit. | Cold evidence. |

---

## Update Rules

Update this file when:

- a solution is verified and likely to matter again
- an approach failed and future agents might repeat it
- a regression is found or a fragile behavior is protected by a new check
- a handoff, investigation, or research file becomes the best next place to read

Do not update this file for:

- routine edits
- one-off command output
- every attempt in a loop
- long summaries that belong in a handoff, investigation, or results log

Keep rows short. Link to the evidence instead of pasting the evidence here.
