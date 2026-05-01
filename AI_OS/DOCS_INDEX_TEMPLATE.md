# DOCS_INDEX — [Project Name]

> Source of truth for all project documentation.
> Before creating any new document, check this index first.

Last verified: [YYYY-MM-DD]

## Living Documents (HOT — Always Current)

| Document | Path | Describes |
|----------|------|-----------|
| Architecture | docs/ARCHITECTURE.md | Current system structure and data flow |
| AI Session Entry | AI.md | Universal entry point for any AI session in this project |
| AI Memory Index | AI_OS/MEMORY_INDEX.md | Ranked AI-facing map of hot workstreams, proven solutions, failed approaches, regression risks, and cold archives |
| Agent Guidance | AGENTS.md | Operational guidance for Codex, Claude, and other coding agents |
| Claude Conventions | CLAUDE.md | Claude Code specific conventions for this project |
| Setup | README.md | Installation and development setup |

## Append-Only Documents

| Document | Path | Describes |
|----------|------|-----------|
| Decision Log | docs/DECISION_LOG.md | Architectural decisions and rationale |

## Reference Documents (WARM — Stable)

| Document | Path | Describes |
|----------|------|-----------|

## Active Temporary Documents

| Document | Path | Purpose | Expected Completion |
|----------|------|---------|-------------------|

## Archived (COLD)

See `docs/_archive/` for completed plans, concluded investigations, and consumed handoffs.
Organized by quarter (YYYY-QN/).

---

## Rules

1. Before creating a new document, check this index. Update existing docs instead of creating duplicates.
2. After creating, archiving, or moving any document, update this index in the same action.
3. Living documents must reflect current code state. If they're stale, update them now.
4. Temporary documents must be archived when their purpose is fulfilled.
5. "Last verified" date must be updated at least monthly.
6. When a doc, handoff, investigation, or research result becomes the best source for future AI sessions, update `AI_OS/MEMORY_INDEX.md`.

## Document Types Quick Reference

| Type | Update rule | Archive rule |
|------|-------------|-------------|
| **Living** (HOT) | Update with every relevant code change | Never — stays current |
| **Append-only** | Add new entries, never modify old | Never |
| **Reference** (WARM) | When the thing it describes changes | If integration removed |
| **Temporary** (plans, investigations, handoffs) | During active work | When purpose fulfilled → `docs/_archive/` |

## Folder Structure

```
docs/
  DOCS_INDEX.md          ← this file
  ARCHITECTURE.md        ← current system state (living)
  DECISION_LOG.md        ← why decisions were made (append-only)
  features/              ← per-feature documentation (living)
  integrations/          ← external service docs (reference)
  breakthroughs/         ← things that work despite vendor docs (reference)
  plans/                 ← active plans only (temporary)
  investigations/        ← active investigations only (temporary)
  handoffs/              ← major milestone handoffs only (temporary)
  _archive/              ← completed/consumed temporary docs
    YYYY-QN/             ← organized by quarter
```
