# Context Rules

These rules keep multiple AI tools aligned when they share the same AI Operating System.

Use this file whenever more than one model, assistant, or coding agent may touch the same project.

---

## Core Principle

Context must be treated as a shared operating resource.

Different assistants may reason differently, but they should not casually contradict:

- stable decisions
- architecture choices
- project constraints
- naming conventions
- established workflows

---

## Context Priority Order

When context sources conflict, use this priority:

1. Current user instruction
2. Project reality / actual code / actual files
3. `AI_DECISION_LOG.md`
4. Latest relevant session handoff
5. Active skill instructions
6. General AI Operating System rules

If a lower-priority source conflicts with a higher-priority source, flag the conflict explicitly.

---

## Stable vs Temporary Context

### Stable context
Context that should persist across sessions unless deliberately changed.

Examples:
- architecture decisions
- chosen workflows
- naming rules
- preferred model routing
- known constraints
- files/folders treated as source of truth

Stable context should be recorded in:
- `AI_DECISION_LOG.md`

### Temporary context
Context relevant only to the current session.

Examples:
- current debugging path
- current experiment
- temporary assumptions under test
- incomplete hypotheses
- work-in-progress notes

Temporary context should live in:
- dated handoff files

Do not promote temporary context into stable context unless it is clearly confirmed.

---

## Conflict Handling Rule

If two assistants would likely behave differently, do not silently choose one path.

Instead:

1. identify the conflict
2. explain what is conflicting
3. state which source has priority
4. continue using the higher-priority source unless the user says otherwise

---

## Handoff Discipline

At the end of substantial work:

- write a dated handoff
- separate facts from assumptions
- record what changed
- state what must not be broken
- define the next concrete step

Do not rely on chat history alone.

---

## Decision Discipline

Record a decision in `AI_DECISION_LOG.md` only when it is:

- important
- stable enough
- likely to affect future sessions
- worth preventing from being re-debated

Do not fill the log with trivia.

---

## Tool-Specific Configuration Boundaries

Some AI tools have their own native skill and plugin systems that operate independently from the AI_OS.

Known tool-specific configurations:

Claude Code (CLI)
- **Global config**: `~/.claude/CLAUDE.md` (behavioral rules applied to ALL sessions), `~/.claude/rules/` (global enforcement rules), `~/.claude/settings.json` (global hooks + deny list)
- **Project config**: project `CLAUDE.md` (domain glossary, build commands, anchor pattern), `.claude/rules/` (path-scoped rules), `.claude/settings.json` (project hooks)
- **Rule layering**: Global CLAUDE.md handles behavioral guardrails (no freelancing, confirm before coding, minimal scope, ask-don't-guess). Project CLAUDE.md handles domain knowledge only. Do NOT duplicate behavioral rules in project CLAUDE.md.
- Skills: `~/.claude/skills/` (my-precious, architect-advisor, design-reviewer, etc.) optimized for Claude CLI agent work
- Plugins: superpowers, episodic-memory, context7, feature-dev, etc.
- DO NOT attempt to sync, overwrite, or merge Claude Code skills with AI_OS skills
- Claude Code skills are intentionally Claude-specific; AI_OS skills are intentionally multi-model
- **Agent Teams** (experimental, March 2026): multi-session orchestration via `TeammateTool`. Reference doc with setup, prompt templates, and best practices: `references/agent-teams-reference.md`. Do NOT re-research this from the web — read the local reference first.

Codex
- **Global config**: `CODEX_HOME/AGENTS.md` (or `AGENTS.override.md`), `CODEX_HOME/config.toml`, `CODEX_HOME/rules/`
- **Project config**: root `AGENTS.md`, nearest nested `AGENTS.md`, and fallback project docs configured in `project_doc_fallback_filenames` (for example `AI.md`)
- **Rule layering**: global Codex home guidance → project root guidance → nearest nested guidance
- Treat `AGENTS.md` as the repo-local operational guide for Codex and other coding agents
- Keep `AGENTS.md` concise, actionable, and directory-scoped; do not dump the whole AI_OS into a single file
- `AI.md` is a universal loader and an optional Codex fallback filename, not the primary Codex instruction surface
- Personal Codex-global behavior stays in `~/.codex`; copied project AI_OS files should carry only repo-specific guidance and cross-tool rules worth versioning with the project
- Keep Claude-specific instructions in `CLAUDE.md` / `.claude/`; do not copy them into `AGENTS.md` unless they are truly cross-tool
- Codex sub-agents / chat agents are session-scoped helpers, not a durable memory layer
- If a rule must guide every tool, place it in `AI_OS/`, `AI.md`, or `AGENTS.md` rather than a Codex-only thread
- **Windows / WSL**: if using the Windows-native Codex agent, prefer storing repos on the Windows filesystem and accessing them from WSL via `/mnt/<drive>/...`; switch the Codex agent to WSL only when you want Linux-native execution as the default
- **Path rendering for Maria**: when returning a reusable file path, prompt path, or document location to the user, prefer the Windows absolute path first; include the WSL `/mnt/<drive>/...` form only as a secondary technical alias when useful

Google Antigravity
- Config: `.gemini/antigravity/`, `.agent/workflows/`
- Has its own knowledge items, artifacts, and workflow system
- Treat as a separate implementation environment

Rule: the AI_OS governs cross-tool consistency and model routing. Individual tool configs govern tool-specific behavior. They coexist — do not merge them.

---

## Skill Activation Rule

Use only the minimum relevant skill for the task.

Examples:
- planning / sequencing / trade-offs → Architect Advisor
- prompt creation / refinement → My Precious (Claude) or My Precious Codex (OpenAI/Codex)
- design critique / iteration steering → Design Reviewer
- documentation placement / naming / cleanup → Docs Strategy
- AGENTS.md generation / repo setup for AI agents → Generate Agents
- stubborn bugs / multi-step debugging / fix cycles not resolving -> Forensic Debug Loop

Do not activate a specialized skill if plain AI_OS mode is enough.

---

## Reality Check Rule

If instructions, docs, or decisions say one thing but the actual code/files show another:

- trust project reality first
- report the mismatch
- do not pretend the docs are correct if the files disagree

---

## Project-Specific Knowledge Rule

Some projects contain working implementations that contradict general knowledge, official vendor documentation, or model training data.

Examples:
- Flowbridge achieves GSAP animation import into Webflow interactions — something Webflow's official API and docs say is unsupported
- Custom bridges that use undocumented API endpoints proven to work in production

When project docs describe capabilities that conflict with external knowledge:

1. trust project documentation and working code first
2. do not "correct" working implementations based on general knowledge
3. do not tell the user something is impossible if the project already does it
4. if uncertain, ask the user rather than reverting to default assumptions
5. document breakthroughs in project docs so future agents respect them

Breakthrough knowledge should live in:
- `docs/FEATURES/` or `docs/INTEGRATIONS/` for stable capabilities
- `AI_DECISION_LOG.md` if it affects future architectural choices
- project `AGENTS.md` if coding agents need to know about it

---

## Regression Prevention Rule

When an AI agent modifies code to fix a problem or implement a feature:

1. identify what is currently working in the affected area
2. verify those working behaviors are preserved after the change
3. if the change touches shared code, check downstream consumers
4. never assume a fix is isolated without checking boundaries
5. if impact is unclear, ask before proceeding

Breaking something that already works is worse than not fixing the new thing.

This rule applies to all coding agents, CLIs, and implementation sessions regardless of model or tool.

If a regression is detected after a change:
- stop immediately
- report what broke
- do not attempt cascading fixes without user approval

---

## Documentation Governance Rule

All documentation decisions should follow the active tool's documentation-governance skill when available, such as Codex `docs-strategy` or the Claude-native equivalent.

Key rules:
- one source of truth per topic
- predictable naming and placement
- wrong documentation steers models wrong — treat accuracy as critical
- CLIs that generate docs must place them according to the project docs structure
- before creating a new doc, check if a better home already exists
- when changes affect existing docs, check for conflicts and update or archive as needed

---

## User-Facing Path Rule

When sharing paths with Maria in chat:

1. return the Windows absolute path first
2. return the WSL path only if it helps tool execution or shell usage
3. if a file is meant to be opened in another chat, give the Windows path in copy-paste-ready form

Do not make the user reverse-map `/mnt/c/...` paths into Windows paths for normal reuse.

---

## Final Rule

Shared context exists to reduce repeated reasoning, not to fossilize bad decisions.

Respect continuity, but verify reality.
