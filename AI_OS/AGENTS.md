# Jocril LOJA-ONLINE AI_OS

This folder is the project-local AI Operating System for Jocril LOJA-ONLINE.
It is adapted from `C:\Users\maria\Desktop\AI_OS` and must preserve project-specific rules, prompts, handoffs, references, and decisions.

## Scope

- Cross-tool operating guidance lives in `AI_OPERATING_SYSTEM.md`, `CONTEXT_RULES.md`, `MODEL_SELECTION_GUIDE.md`, and root `AI.md`.
- Project-specific implementation rules still live in root `AGENTS.md` and `CLAUDE.md`.
- Dated prompts and handoffs live in `SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`.
- Durable project decisions live in `AI_DECISION_LOG.md`.
- Project-local skill policy lives in `SKILLS/AGENTS.md`.

## AI Brain Boundary

- L1 master template: `C:\Users\maria\Desktop\AI_OS`.
- L2 project memory: this project's committed `AI_OS/` plus root `AGENTS.md`, `AI.md`, and `CLAUDE.md`.
- L3 global agent config: `C:\Users\maria\Desktop\ai-brain`.

Do not collapse these layers. Do not replace this project-local `AI_OS/` with a central workspace, symlink, or global config copy. Do not copy global `~/.codex` or `~/.claude` material into this repo.

## Guardrails

- Adapt AI_OS updates from the desktop master; do not replace this folder wholesale.
- Never overwrite `SESSION-PROMPTS/SESSIONS/`, `AI_DECISION_LOG.md`, root `AGENTS.md`, root `AI.md`, or `CLAUDE.md` without explicit user approval.
- Do not copy personal-only skills, account maps, machine config, auth/session state, or secrets into this repo.
- Keep global skills in the tool-native global skill systems; `AI_OS/SKILLS/` is for local/project-specific overrides only.
- If a future sync touches root guidance, preserve the Jocril port rules first.

## Quick Checks

```bash
git status --short
find AI_OS -maxdepth 3 -type f | sort
rg -n "Jocril|LOJA|AI_OS|SESSION-PROMPTS|AI Brain|ai-brain" AI.md AGENTS.md CLAUDE.md AI_OS docs
rg -n "^# " AI_OS/AI_OPERATING_SYSTEM.md AI_OS/CONTEXT_RULES.md AI_OS/MODEL_SELECTION_GUIDE.md
find AI_OS/SESSION-PROMPTS/SESSIONS -maxdepth 2 -type f | sort
```
