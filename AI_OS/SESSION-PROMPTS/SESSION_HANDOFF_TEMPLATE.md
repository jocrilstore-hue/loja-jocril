# Session Handoff Template

Use this template for **major milestone handoffs only** — not every session.

Routine session continuity is often handled by tool-local continuation features (`claude --continue`, the current Codex thread, etc.).
Reserve this template for: multi-day features nearing completion, before major refactors,
when switching tools (Claude Code ↔ Codex), when important findings came from Codex sub-agents/chat agents and must survive the thread,
or before long breaks from the project.

Store handoff files in: `docs/handoffs/` (preferred) or `AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`

Filename format: `YYYY-MM-DD_HH-MM_topic_handoff.md`

---

## Handoff: [Topic] — [YYYY-MM-DD]

### Current State

[2-3 sentences: what's done, what's in progress, what's blocked]

### Key Decisions

[Bullet list of decisions made and WHY — not what files changed.
If a decision is stable, also add it to AI_DECISION_LOG.md]

### Don't Break

[Bullet list of things that work now and must continue working.
Be specific — name the behavior, not the file]

### Memory Index Updates

[State exactly which rows were added or changed in `MEMORY_INDEX.md`.
Use `None` only when the session produced no reusable working solution, failed approach, regression risk, or new best resume point.]

### Next Step

[ONE concrete action for the next session to start with.
Make it executable, not aspirational]

### Resume Command

[Exact command or file to start with]

Example: "Run `pnpm test:integration` to verify current state, then continue with the auth middleware refactor in `src/middleware/auth.ts`"

---

## When NOT to use this template

- Routine bug fixes → episodic memory handles it
- Small features → tool-local continuation is usually enough
- Same-day continuation → just resume the session
- If git log + code tells the story → no handoff needed

## When TO use this template

- End of a multi-day feature sprint
- Before merging a major branch
- Handing off to a different person or tool
- Before a long break (vacation, project switch)
- When context is getting long and quality might degrade
- After a debugging breakthrough that changed understanding

## Quality check

A good handoff is read in 30 seconds and tells you exactly what to do next.
If it takes longer than 30 seconds to read, it's too long.
If the handoff names a working solution, failed approach, regression risk, or best resume point that future agents should rank highly, `MEMORY_INDEX.md` must point to it.
