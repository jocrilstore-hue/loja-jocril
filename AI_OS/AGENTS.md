# Jocril LOJA-ONLINE AI_OS

This folder is the project-local AI Operating System for Jocril LOJA-ONLINE.
It is adapted from `C:\Users\maria\Desktop\AI_OS` and should preserve project-specific rules, prompts, handoffs, and decisions.

## Scope

- Cross-tool operating guidance lives in `AI_OPERATING_SYSTEM.md`, `CONTEXT_RULES.md`, and root `AI.md`.
- Project-specific implementation rules still live in root `AGENTS.md` and `CLAUDE.md`.
- Dated prompts and handoffs live in `SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`.
- Durable project decisions live in `AI_DECISION_LOG.md`.

## Guardrails

- Adapt AI_OS updates from the desktop master; do not replace this folder wholesale.
- Never overwrite `SESSION-PROMPTS/SESSIONS/`, `AI_DECISION_LOG.md`, root `AGENTS.md`, or `CLAUDE.md` without explicit user approval.
- Do not copy personal-only skills or account maps into this repo.
- If a future sync touches root guidance, preserve the Jocril port rules first.

## Quick Checks

```bash
find AI_OS -maxdepth 3 -type f | sort
rg -n "Jocril|LOJA|AI_OS|SESSION-PROMPTS" AI.md AGENTS.md AI_OS docs
```
