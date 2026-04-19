---
name: docs-strategy
description: Documentation governance and placement skill for AI-assisted projects. Use when deciding what documentation to create, where it should live, when to update it, how to name it, and how to keep project docs lean, deterministic, and discoverable across multiple AI tools and CLIs.
---

# Docs Strategy

Docs Strategy is a **documentation governance skill**.

Its job is to prevent projects from turning into a documentation jungle.

It decides:

- what documentation should exist
- what should not exist
- where files should live
- when docs should be created
- when docs should be updated
- when docs should be archived
- how docs should connect to AGENTS.md and the AI Operating System

The priority is **clarity, predictability, and low entropy**.

---

# Core Goal

Create just enough documentation so that:

- humans can find the source of truth quickly
- AI agents know where to look before guessing
- different CLIs do not create random files in random places
- naming remains consistent
- project structure stays understandable over time

This skill explicitly resists:

- duplicate documentation
- vague scratch files becoming permanent
- random markdown scattered across the repo
- undocumented conventions
- regenerated docs that overwrite good structure
- "helpful" AI file creation without placement rules
- prompts, plans, and handoffs that exist only in chat history

---

# AI OS Integration

This skill operates within the AI Operating System.

When relevant, align with:

- `AI_OS/AI_OPERATING_SYSTEM.md`
- `AI_OS/MODEL_SELECTION_GUIDE.md`
- `AI_OS/AI_DECISION_LOG.md`
- `AI_OS/CONTEXT_RULES.md`
- `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md`
- `AI_OS/SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md`

If documentation decisions become stable and important, recommend recording them in:

- `AI_OS/AI_DECISION_LOG.md`

If a session creates meaningful documentation state, recommend a dated handoff file.

---

# Documentation Philosophy

## 1. Source of Truth Over Volume

Prefer one clear authoritative file over five overlapping files.

Bad:
- `README.md`
- `README_NEW.md`
- `SETUP_NOTES.md`
- `TEMP_SETUP.md`
- `FINAL_SETUP.md`

Good:
- one authoritative setup file
- one index pointing to it if needed

---

## 2. Nearest Useful Home

Put documentation as close as possible to where it is used, but no closer.

Use this rule:

- global governance docs → `AI_OS/`
- project-wide docs → project `/docs/` or root control files
- package/app-specific docs → inside that package/app
- highly local implementation notes → near that feature/module only if they are truly local

Do not bury critical docs in deeply nested folders if multiple systems need them.

---

## 3. JIT Indexing Over Dumping

Prefer docs that point to the right files, commands, and globs.

Good docs help the reader find reality fast.

Bad docs try to paste everything.

Examples of good content:
- folder path
- file pattern
- command to search
- source-of-truth file
- example implementation path

---

## 4. Stable Names Beat Clever Names

Prefer names that are boring and obvious.

Good:
- `AGENTS.md`
- `README.md`
- `ARCHITECTURE.md`
- `DOCS_INDEX.md`
- `AI.md`
- `DB_MIGRATION_GUIDE.md`

Bad:
- `ultimate-brain.md`
- `stuff-i-need.md`
- `new-plan-v2-final-final.md`

---

# Documentation Layers

Use these layers consistently.

## Layer 1 — AI OS (Global, cross-project)

Lives in:

`AI_OS/`

Purpose:
- global operating rules
- model selection
- context rules
- global session flow
- reusable skills
- shared references

Examples:
- `AI_OPERATING_SYSTEM.md`
- `MODEL_SELECTION_GUIDE.md`
- `AI_DECISION_LOG.md`
- `CONTEXT_RULES.md`
- `SESSION-PROMPTS/AI_SESSION_START.md`

This layer should remain stable and cross-project.

---

## Layer 2 — Project Entry Layer

Lives at project root.

Purpose:
- connect the project to the AI OS
- provide a small entry point for any AI agent
- define project-local orientation

Examples:
- `AI.md`
- root `AGENTS.md`
- `README.md`

This layer should be lean.

---

## Layer 3 — Project Docs Layer

Lives in:

`/docs/`

Purpose:
- architecture
- setup
- workflows
- feature docs
- integration docs
- operational guides
- migration guides

Recommended structure:

`docs/`
- `DOCS_INDEX.md`
- `ARCHITECTURE.md`
- `SETUP.md`
- `WORKFLOWS/`
- `FEATURES/`
- `INTEGRATIONS/`
- `DATABASE/`
- `OPERATIONS/`
- `_archive/`

This is the main human-readable project knowledge base.

---

## Layer 4 — AGENTS Layer

Lives at:
- root `AGENTS.md`
- package/app/service `AGENTS.md`

Purpose:
- tell coding agents how to work in that part of the repo
- stay JIT, local, and action-oriented
- point to examples, commands, patterns, and anti-patterns

AGENTS files are not general docs.
They are operational guidance for AI coding agents.

---

## Layer 5 — Local Implementation Layer

Lives near the feature only when necessary.

Purpose:
- very local implementation rules
- feature-level examples
- temporary technical guides that are likely to become feature docs

Use sparingly.

If it becomes broadly important, promote it to `/docs/`.

---

# When To Create Documentation

Create docs when at least one of these is true:

- a workflow will be repeated
- an architecture decision affects future work
- multiple agents will touch the same area
- naming/placement conventions need to be enforced
- a feature has enough complexity that rediscovery would be costly
- a human teammate would reasonably ask "where is the source of truth for this?"

Do not create docs for one-off trivia.

---

# When To Generate AGENTS.md

Generate AGENTS.md only after:

1. discovery has clarified the repo structure
2. major directories/packages are known
3. the working architecture is stable enough to describe
4. implementation is about to scale across multiple areas

Do not generate AGENTS.md too early.
Do not regenerate the hierarchy casually.

Use AGENTS.md for:
- local working patterns
- search hints
- commands
- examples
- warnings

Not for:
- long theory
- duplicated architecture docs
- business documentation

---

# When To Update Documentation

Update docs when:

- the source of truth changed
- commands changed
- folder structure changed
- conventions changed
- architecture changed materially
- a previous doc is now misleading

If reality changed, docs must catch up.

If docs and code disagree, prefer project reality and fix docs.

---

# When Not To Create Or Update Docs

Do not create or revise docs when:

- the change is tiny and obvious in code
- the workflow is still exploratory and unstable
- the same information already exists in a clear authoritative file
- the new file would duplicate existing guidance
- the motivation is "just in case"

Documentation debt starts with "just in case."

---

# Placement Rules

Use these placement rules.

## Global AI governance
Place in:
`AI_OS/`

## Project entry points
Place in project root:
- `AI.md`
- `AGENTS.md`
- `README.md`

## Architecture / setup / operational docs
Place in:
`docs/`

## Package/app/service instructions
Place in the relevant package/app/service:
- local `AGENTS.md`
- local README only if necessary

## Database-specific docs
Place in:
`docs/DATABASE/`

Keep migrations in actual migration folders, not mixed into docs folders.

## Scripts guidance
Document scripts in:
- root `README.md` if universal
- `docs/OPERATIONS/` if operational
- local package docs if package-specific

Do not scatter script notes in random temp markdown files.

---

# Naming Conventions

Use consistent names.

## Root / project-level
- `AI.md`
- `AGENTS.md`
- `README.md`

## Core docs
- `DOCS_INDEX.md`
- `ARCHITECTURE.md`
- `SETUP.md`

## Operational docs
- `DEPLOYMENT.md`
- `RUNBOOK.md`
- `DB_MIGRATION_GUIDE.md`

## Feature docs
Use predictable names like:
- `docs/FEATURES/quotes-engine.md`
- `docs/FEATURES/email-bridge.md`

Avoid timestamps in stable docs.
Use timestamps only in session handoffs, logs, or temporary investigation artifacts.

---

# Archive Strategy

Use archive folders deliberately.

Recommended:
- `docs/_archive/` for retired docs
- `TEMP/` only for working artifacts, never as permanent source of truth

Archive when:
- a doc is obsolete but historically useful
- a design path was abandoned but may matter later
- a migration guide has been superseded

Do not leave dead docs mixed with active docs.

Mark archived docs clearly.

---

# Session Artifact Rules

Session-generated files must be controlled.

Use:

`AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`

for:
- handoff files
- investigation summaries
- temporary session context

These are not permanent docs by default.

Promote them into permanent docs only when:
- the knowledge is stable
- it affects future work
- it deserves a source-of-truth file

---

# SQL / Scripts / Migrations Governance

Keep these separate.

## SQL migrations
Live in the actual migration system folder, for example:
- `supabase/migrations/`
- `prisma/migrations/`
- `db/migrations/`

Documentation about migration policy goes in:
- `docs/DATABASE/DB_MIGRATION_GUIDE.md`

## Ad hoc SQL
Keep in a clear utilities or admin folder if needed, not random desktop exports.

## Scripts
Place in predictable locations such as:
- `scripts/`
- package-level `scripts/`
- `tools/` if appropriate

Document what they do in one authoritative place.
Do not create scattered markdown per script unless necessary.

---

# Docs Index Rule

Every serious project should have:

`docs/DOCS_INDEX.md`

Its job is to:

- list major docs
- point to source-of-truth files
- help humans and AI find the right doc fast
- prevent duplicate docs from being created

This is the map, not the encyclopedia.

---

# Decision Rules

When making documentation decisions, prefer this order:

1. Existing clear source of truth
2. Update existing doc
3. Add index link
4. Create new doc only if truly needed
5. Archive or delete duplicates

Do not create a new file before checking whether a better home already exists.

---

# Output Structure

When this skill is used, structure recommendations like this:

## Current Documentation State
What exists now?

## Problems
What is messy, duplicated, random, or missing?

## Recommended Structure
What should exist and where?

## Create / Update / Archive Actions
What should be created, updated, moved, archived, or deleted?

## Naming Rules
What names and placement conventions should be enforced?

## Next Step
What is the single best next action?

For substantial tasks, also include:
- recommended model
- reasoning level
- whether work can be parallelized

---

# Breakthrough / Discovery Documentation

Some projects achieve results that contradict official vendor docs, general AI knowledge, or publicly available information.

Examples:
- custom integrations that vendors say are unsupported
- undocumented API usage proven to work in production
- workarounds that bypass known platform limitations

These are high-value knowledge assets. They must be documented clearly because:

- AI agents will default to general knowledge and may contradict or "fix" working code
- future sessions will lose the context of what was achieved
- model training data may actively say "this is impossible"

Breakthrough knowledge should be documented in:

- `docs/FEATURES/` or `docs/INTEGRATIONS/` as stable feature/integration docs
- `AI_DECISION_LOG.md` if the breakthrough affects architecture
- project `AGENTS.md` if coding agents need to know about it operationally

Recommended format for breakthrough docs:

```
## [Capability Name]

What: [What we achieved]
Why it matters: [What this enables]
Official position: [What vendor/general docs say]
Our approach: [How we did it]
Proof: [Where the working implementation lives]
Constraints: [Known limits or fragility]
Do not: [What would break this]
```

This prevents future agents from reverting working breakthroughs based on training data.

---

# Regression Prevention in Documentation

When documentation changes are made:

- check if the update contradicts other existing docs
- check if archiving a doc would remove information still referenced elsewhere
- check if renaming a file breaks links in DOCS_INDEX, AGENTS.md, or AI.md
- do not archive breakthrough documentation unless the capability is genuinely obsolete

When code changes are made by a CLI:

- the agent must verify existing working functionality before committing
- if the fix touches shared code, downstream consumers must be checked
- if impact is unclear, stop and ask
- breaking something that already works is worse than not fixing the new thing

This rule is critical for projects with custom or undocumented capabilities.

---

# Anti-Patterns To Prevent

Do not allow:

- duplicate README-like files
- random markdown in project root
- temp files becoming permanent docs
- scripts documented only in chat history
- architecture knowledge living only in session handoffs
- AGENTS.md files bloated with general docs
- migration instructions split across multiple conflicting files
- inconsistent naming like `setup2.md`, `newsetup.md`, `final-setup.md`

---

# Integration With Agent Generation

If the project is ready for hierarchical AGENTS.md generation:

- confirm the repo structure is stable enough
- confirm the major packages/apps/services
- confirm docs placement rules first
- then generate the AGENTS.md hierarchy

Use the AGENTS generation guide only after discovery and basic structure are clear.

AGENTS generation is downstream of docs strategy, not upstream.

---

# Final Rule

Documentation should make the repo easier to navigate, not harder.

If a proposed doc does not clearly reduce confusion, it probably should not exist.

---

# Document Temperature & Lifecycle (2026-03-28 Update)

This section augments the existing governance with lifecycle management.
The core problem: documents are born but never die, get promoted, or get revised.

## Document Temperature Classification

| Temperature | Description | Agent Behavior | Lifecycle |
|-------------|-------------|----------------|-----------|
| **HOT** | Current architecture, active features, conventions | Always loaded or loaded on first relevant file access | Update continuously — must be current |
| **WARM** | Historical decisions, completed features, past investigations | Loaded on demand when relevant | Archive when superseded. Keep for reference |
| **COLD** | Deprecated specs, old migration guides, completed plans | Never loaded by agents | Archive folder. Delete after 6 months if unreferenced |

### HOT Documents (Always Current)

- CLAUDE.md (under 120 lines)
- AGENTS.md
- docs/ARCHITECTURE.md
- docs/DOCS_INDEX.md
- README.md
- Feature docs in docs/features/

**Rule:** Update during the work, not after. If code changed, check if the doc needs to change.

### WARM Documents (On-Demand, Stable)

- AI_DECISION_LOG.md (append-only)
- docs/integrations/ (update when integration changes)
- docs/breakthroughs/ (update when behavior changes)
- CHANGELOG.md (append-only)

**Rule:** Don't load unless relevant. Update when the thing it describes changes.

### COLD Documents (Archive)

- Completed plans → docs/_archive/
- Concluded investigations → docs/_archive/
- Consumed handoffs → docs/_archive/

**Rule:** Move here when done. Add one-line header noting what replaced it. Delete after 2 quarters if unreferenced.

## Updated Recommended docs/ Structure

```
docs/
  DOCS_INDEX.md          ← THE MAP — source of truth declarations (living)
  ARCHITECTURE.md        ← current system state (living)
  DECISION_LOG.md        ← why decisions were made (append-only)
  features/              ← per-feature documentation (living)
  integrations/          ← external service integration docs (reference)
  breakthroughs/         ← things that work despite vendor docs (reference)
  plans/                 ← active plans only (temporary)
  investigations/        ← active investigations only (temporary)
  handoffs/              ← major milestone handoffs only (temporary)
  _archive/              ← completed/consumed temporary docs
    YYYY-QN/             ← organized by quarter
```

Key changes from earlier structure:
- `breakthroughs/` is new — consolidates scattered breakthrough knowledge
- `investigations/` replaces scattered ad-hoc analysis or investigation note patterns
- `handoffs/` is the preferred home for milestone handoffs (instead of AI_OS/SESSION-PROMPTS/SESSIONS/)
- `_archive/` organized by quarter, not by arbitrary categories

## Five Lifecycle Rules

**Rule 1: Every document has a type. Every type has a lifecycle.**
See the temperature table above.

**Rule 2: If you change code, check if a living doc needs updating.**
This is now enforced by `.claude/rules/architecture.md` (path-scoped to src/).

**Rule 3: Temporary docs archive when their purpose is fulfilled.**
Plan executed → archive. Investigation concluded → promote findings, archive original. Handoff consumed → archive.

**Rule 4: DOCS_INDEX.md is updated in the same action as any doc change.**
Not "later." Not "at end of session." Same action. This is now enforced by `.claude/rules/documentation.md`.

**Rule 5: Quarterly cleanup.**
Once per quarter: review _archive/ (delete >2 quarters old), archive completed plans/investigations, verify DOCS_INDEX accuracy.

## Session Handoff: Milestone-Only Model

Routine session continuity is handled by episodic memory + auto memory + `claude --continue`.

Reserve handoffs for: multi-day features, before major refactors, tool switches, long breaks.

Simplified template (5 sections, not 12):
1. Current State (2-3 sentences)
2. Key Decisions (bullet list with WHY)
3. Don't Break (specific behaviors)
4. Next Step (ONE concrete action)
5. Resume Command (exact command to start with)

A good handoff is read in 30 seconds. If it takes longer, it's too long.

## Claude Code-Specific Enforcement

These rules are now mechanically enforced via `.claude/rules/`:

| Rule | Enforced by |
|------|------------|
| DOCS_INDEX governance | `.claude/rules/documentation.md` |
| Architecture freshness | `.claude/rules/architecture.md` |
| Breakthrough protection | `.claude/rules/breakthroughs.md` |
| Post-compaction context | PostToolUse hook in `~/.claude/settings.json` |

The docs-strategy skill remains the comprehensive reference. The rules/ files are the enforcement layer.
