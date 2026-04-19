---
name: architect-advisor
description: Use when a project-local AI_OS needs architecture, planning, trade-off, model-routing, or execution-mode guidance that extends global Claude/Codex architect skills with project-specific context.
---

# Project Architect Advisor

This file is the project-local complement to Maria's global Claude/Codex architect skills.
It is not the whole architect brain.

Use global skills for reusable behavior:

- Claude architecture / Claude Code orchestration -> global `architect-advisor`
- Claude prompt packaging -> global `my-precious`
- Codex/OpenAI architecture -> global `architect-advisor`
- Codex/OpenAI prompt packaging -> global `my-precious-codex`

Use this project skill only for local facts, constraints, and overrides that should travel with the project.

## What Belongs Here

Add project-specific guidance such as:

- project architecture constraints
- local task-to-mode mappings
- local model exceptions
- repo-specific verification commands
- source-of-truth docs for architecture decisions
- known integration risks
- project-specific handoff expectations

## What Does Not Belong Here

Do not duplicate:

- Maria-wide Codex defaults
- Maria-wide Claude defaults
- full `my-precious` or `my-precious-codex` prompt-building rules
- generic model-selection tables already maintained globally
- machine-specific tool paths or account setup
- provider-specific orchestration mechanics unless this project has a local exception

If a rule applies to every project whether or not this AI_OS template is copied, it belongs in global tool config or a global skill, not here.

## Source Loading For This Project

For substantial architecture work in a project that includes this AI_OS:

1. read the project root `AGENTS.md` / `CLAUDE.md` as appropriate for the tool
2. read `AI.md` if present
3. read `AI_OS/AI_OPERATING_SYSTEM.md`
4. read `AI_OS/CONTEXT_RULES.md`
5. read `AI_OS/MODEL_SELECTION_GUIDE.md` only when model choice matters
6. check `AI_OS/AI_DECISION_LOG.md` and latest relevant handoff when continuity matters

Actual project files and current user instructions outrank template guidance.

## Project Override Slots

Fill these in downstream projects only when there is real local knowledge.
Leave them sparse in the master template.

### Architecture Constraints

- No master-template constraint yet.

### Task To Mode Mapping

| Task pattern | Preferred mode | Local reason |
|---|---|---|
| No project-specific mapping yet | Use global architect decision engine | Avoid fake defaults |

### Model Exceptions

- No project-specific model exception yet.
- Use the global Claude/Codex model-selection skill guidance unless this project has a documented reason to override it.

### Verification Notes

- Use project-local build/test commands from `AGENTS.md`, `CLAUDE.md`, `AI.md`, or docs.
- Do not invent generic verification commands in the template.

### Handoff Notes

- Store substantial session handoffs in `AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/` unless the project documents a different home.
- Record stable decisions in `AI_OS/AI_DECISION_LOG.md` only when they are worth preserving.

## Orchestration Boundary

Architect Advisor decides:

- what problem is actually being solved
- whether the work is interactive or an autonomous bounded mission
- whether parallel work is justified
- which harness should execute the next step
- which model/effort class is appropriate

Prompt-building skills write the final execution prompt:

- Claude target -> `my-precious`
- Codex/OpenAI target -> `my-precious-codex`

## Supporting Resources

Load only when needed:

- `references/orchestration-decision-engine.md`
- `references/examples.md`
- `references/session-handoff-template.md`

## Guardrails

- keep this file project-local and sparse
- do not copy global skill bodies into project AI_OS
- do not encode one provider's workflow as if it applied to every tool
- document local exceptions with evidence or a project decision
- when in doubt, prefer global skill behavior plus local project facts
