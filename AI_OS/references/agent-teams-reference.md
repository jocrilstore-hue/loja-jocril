# Claude Code Agent Teams — Quick Reference

> **Status:** Experimental (as of March 2026). Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` enabled.
> **Min version:** Claude Code v2.1.32+
> **Official docs:** https://code.claude.com/docs/en/agent-teams

---

## When to Use Agent Teams

Use when parallel exploration adds real value and teammates can work **independently**:

- **Pre-planned parallel implementation** — work is decomposed, each teammate owns different files
- **Research & review** — multiple angles investigated simultaneously
- **Debugging with competing hypotheses** — adversarial investigation, teammates challenge each other
- **Cross-layer coordination** — frontend, backend, tests each owned by a different teammate

**Don't use when:** tasks are sequential, same-file edits are needed, work has many dependencies, or a single session can handle it. The coordination overhead and token cost aren't worth it for routine tasks.

## Agent Teams vs Subagents vs Superpowers

| Scenario | Use |
|---|---|
| Big ambiguous task, single session, needs phased workflow | **Superpowers** |
| Pre-planned parallel work, clear file scopes | **Agent Teams (bare)** |
| Quick focused subtask within a session | **Subagents** |
| Teammates need to debate/challenge each other | **Agent Teams (adversarial)** |

**Key difference:** Subagents report results back to the caller only. Agent Teams teammates have their own context windows, a shared task list, and can message each other directly.

**On combining with Superpowers:** Superpowers' 7-phase workflow (brainstorm → spec → plan → TDD → subagent dev → review → finalize) is designed for single-session orchestration. Stacking it inside Agent Teams teammates adds two coordination layers. If the planning phase is already done (e.g., via architect-advisor or a plan doc), run teammates lean without Superpowers. Reserve Superpowers for solo deep-dive sessions where scope isn't pre-decomposed. Superpowers issue [#429](https://github.com/obra/superpowers/issues/429) tracks native Agent Teams support — check periodically.

## Setup

Add to `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Optional — set display mode in `~/.claude.json`:

```json
{
  "teammateMode": "in-process"
}
```

Options: `"auto"` (default), `"in-process"`, `"tmux"`. Split-pane mode requires tmux or iTerm2. Not supported in VS Code terminal, Windows Terminal, or Ghostty.

## Teammate Prompt Template

```
Create an agent team with N teammates. All teammates must read
docs/plans/[PLAN-FILE].md before starting work.

- Teammate A "[descriptive-name]": [specific task description].
  Owns: [file1.ts, file2.ts].
  Acceptance: [what "done" looks like — tests pass, behavior verified, etc.].

- Teammate B "[descriptive-name]": [specific task description].
  Owns: [file3.ts, file4.ts].
  Acceptance: [criteria].

- Teammate C "[descriptive-name]": [specific task description].
  Owns: [file5.ts, file6.ts].
  Acceptance: [criteria].

Rules:
- No teammate touches files outside their ownership list
- Each teammate writes/updates tests for their changes
- Report blockers via message to lead, don't guess
- Wait for all teammates to finish before synthesizing
```

### Why This Structure Works

- **Explicit file ownership** — the #1 cause of teammate failures is file conflicts (two teammates editing the same file = overwrites)
- **Acceptance criteria** — teammates know when to stop instead of gold-plating
- **"Wait for teammates"** — prevents the lead from jumping in and implementing things itself
- **Plan doc pointer** — teammates don't inherit lead's conversation history, so they need explicit context

## Prompt Refinement Tips

1. **Include enough context in spawn prompts.** Teammates load CLAUDE.md, MCP servers, and skills automatically, but NOT the lead's conversation history. Reference specific files, constraints, and acceptance criteria.
2. **Name teammates descriptively** — e.g., "hover-fixer", "auth-reviewer", not "Teammate A".
3. **Size tasks at 5-6 per teammate** — too small = coordination overhead exceeds benefit; too large = risk of wasted effort.
4. **For sequential-then-parallel work** (e.g., discovery first, then implementation), run session 1 to completion before spawning the team for sessions 2-N.
5. **Pre-approve common operations** in permission settings before spawning teammates. Each teammate generates permission prompts independently.
6. **Require plan approval for risky tasks:** add `"Require plan approval before making changes"` to the spawn prompt. The teammate works read-only until the lead approves.

## Team Size Guidelines

- **3-5 teammates** for most workflows (sweet spot)
- Token costs scale linearly — each teammate has its own context window
- Beyond 5-6, diminishing returns and coordination overhead increase
- 3 focused teammates > 5 scattered ones

## Interaction & Monitoring

- **In-process mode:** `Shift+Down` cycles through teammates. `Enter` to view, `Escape` to interrupt. `Ctrl+T` toggles task list.
- **Split-pane mode:** click into a pane to interact directly.
- **Steer early.** Check in on progress, redirect approaches that aren't working. Unattended teams waste tokens.
- **Talk to teammates directly** — give additional instructions, ask questions, redirect.

## Known Limitations (March 2026)

- No session resumption with in-process teammates (`/resume` and `/rewind` don't restore them)
- Task status can lag — teammates sometimes fail to mark tasks complete
- Shutdown can be slow (waits for current tool call to finish)
- One team per session, no nested teams
- Lead is fixed for the team's lifetime
- All teammates inherit lead's permission mode at spawn (can change individually after)

## Architecture Notes

- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`
- Communication: automatic message delivery + shared task list + broadcast capability
- Task dependencies are managed automatically (blocked tasks unblock when deps complete)
- Task claiming uses file locking to prevent race conditions

## Quality Gates (Hooks)

Use [hooks](https://code.claude.com/docs/en/hooks) to enforce rules:

- `TeammateIdle` — runs when teammate is about to go idle. Exit code 2 = send feedback, keep working.
- `TaskCreated` — runs when task is created. Exit code 2 = prevent creation.
- `TaskCompleted` — runs when task marked complete. Exit code 2 = prevent completion, send feedback.

## Cleanup

Always clean up via the lead:

```
Clean up the team
```

Shut down all teammates first. If orphaned tmux sessions persist: `tmux ls` → `tmux kill-session -t <name>`.
