# Handoff: Jocril AI_OS Sync — 2026-04-19

### Current State

The project now has a project-local AI_OS adapted from `C:\Users\maria\Desktop\AI_OS`.
The previous `AI_OS/SESSION-PROMPTS/SESSIONS/` handoffs were preserved, and the missing portable core files, references, templates, session prompt templates, and portable skills were added.

### Key Decisions

- `AI.md` is the universal loader for future AI sessions.
- Root `AGENTS.md` remains the primary Codex/coding-agent operational guide.
- Root `CLAUDE.md` remains Claude-specific and was intentionally not edited.
- `AI_OS/AI_DECISION_LOG.md` now records stable AI workflow decisions for this repo.
- Personal-only AI_OS content was not copied: `gws-manager`, `SKILLS/user`, `orcamentos-prepare`, and `GOOGLE_ACCOUNTS_MAP.md`.

### Don't Break

- Preserve the existing dated handoffs in `AI_OS/SESSION-PROMPTS/SESSIONS/`.
- Preserve Jocril port rules: inline styles, CSS custom properties, Portuguese copy and URLs, and no new libraries without approval.
- Do not replace root `AGENTS.md` or `CLAUDE.md` with generic AI_OS templates.

### Next Step

For future project work, start by reading `AI.md`, then root `AGENTS.md`, then the latest relevant handoff under `AI_OS/SESSION-PROMPTS/SESSIONS/`.

### Resume Command

```bash
sed -n '1,180p' AI.md && sed -n '1,220p' AGENTS.md && find AI_OS/SESSION-PROMPTS/SESSIONS -maxdepth 2 -type f | sort | tail -20
```
