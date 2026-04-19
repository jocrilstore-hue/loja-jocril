# Orchestration Decision Engine
<!-- For project-local AI_OS architect-advisor overrides; keep synced with SKILL.md -->
<!-- Last updated: 2026-04-19 -->

This document defines how to choose between execution modes for larger AI-assisted tasks.
Architect-advisor owns this decision. `my-precious` or `my-precious-codex` builds the prompt after the mode is chosen.

## The Four Modes

### 1. Single Session (Default)

One session. Sequential work, same-file edits, tasks with tight dependencies.

- Cost: 1x baseline
- When: step B depends on step A, multiple agents would edit the same files, or the task is simple enough for one session

### 2. Subagents

Fire-and-forget parallel workers. Each runs in isolated context and returns a summary to the parent. No inter-worker communication.

- Cost: roughly 1.5-2x per subagent
- When: work is embarrassingly parallel, the parent only needs summaries, and workers do not need to talk to each other

### 3. Coordinated Parallel Work

Coordinated parallel collaboration. Multiple workers share findings and the lead orchestrates.

- Cost: 3-7x depending on team size
- When: cross-layer features, multi-domain audits, competing debug hypotheses, or decisions that benefit from multiple independent reviews
- Tool note: Claude may use Agent Teams; Codex may use bounded sub-agents. The global provider skill maps this mode to the actual harness.

### 4. Manual Parallel (Separate Sessions / Worktrees)

You run multiple sessions yourself with manual merge control.

- Cost: per-session plus human coordination time
- When: features are fully independent, prototype exploration is useful, or you want explicit merge control

## Decision Flow

Ask these in order. First yes wins.

1. Is the work sequential or likely to touch the same files?
   -> Single session
2. Can workers do independent chunks and return summaries without talking to each other?
   -> Subagents
3. Do workers need to coordinate, challenge each other, or share findings?
   -> Coordinated parallel work
4. Are the workstreams fully independent and best coordinated manually?
   -> Manual parallel
5. Still unclear?
   -> Default to single session and upgrade only if needed

## Complexity Score

Rate 0-2 on each dimension:

| Dimension | 0 | 1 | 2 |
|-----------|---|---|---|
| Parallelism | Sequential | Some independent parts | Fully parallelizable |
| Coordination | None needed | Summary exchange | Active back-and-forth |
| Domain spread | Single concern | 2 concerns | 3+ concerns |
| File scope | Few files | Multiple directories | Cross-layer |

- Score 0-2: Single session
- Score 3-4: Subagents
- Score 5-8: Coordinated parallel work

## Cost Reality Check

Parallel work is only worth it when the time saved outweighs coordination cost.

Use single-session by default when:

- one careful pass is faster than coordination
- file overlap is high
- the user mainly needs one clear decision first

## Output to Prompt-Building Skill

After deciding the mode, hand off:

- which mode was chosen and why
- suggested worker roles or workstreams
- dependency order
- what each worker should return
- merge or synthesis point
