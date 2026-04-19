# Agent Teams Prompt Patterns

Reference for building orchestrated multi-agent prompts for Claude Code Agent Teams.
Load this when the user needs parallel execution across multiple Claude Code instances.
**This file is the "how to build" reference. For the "when to use" decision, see architect-advisor's orchestration decision engine.**

## Prerequisites

Agent Teams require:
- Claude Code v2.1.69+ (recommended minimum — critical stability fixes over v2.1.32 launch version)
- **Opus 4.7 recommended** for hard audits and high-stakes debugging (ships with new `xhigh` effort level between `high` and `max`). **Opus 4.6 still works and is cheaper** — pick based on cost-of-mistakes for the task.
- ALL teammates run the same model — no role-based model selection yet
- Enable: `export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` or add to `settings.json` under `"env"`
- Optional: tmux for split-pane view (recommended for 3+ teammates)

### What v2.1.69 fixed (March 2026)
- **Nested teammate spawning** — teammates could accidentally spawn additional teammates via the Agent tool's name parameter. Resolved.
- **Memory leak** — parent's full conversation history was pinned for each teammate's entire lifetime. Fixed.
- **Hook fields** — new `agent_id` and `agent_type` fields in hook events enable proper subagent tracking and logging.
- **Default effort** — Max and Team subscribers get flagship model at medium effort by default. Use "ultrathink" keyword for high; the new `xhigh` tier (Opus 4.7 only) needs explicit opt-in.

### What's new with Opus 4.7 (April 16, 2026)
- **`xhigh` effort tier** — slots between `high` and `max`. Use for cross-layer audits where you want deeper reasoning than default `high` but don't want to pay for `max`.
- **Manual extended thinking deprecated** — do NOT set `budget_tokens` directly on Opus 4.7. Use adaptive thinking (`thinking: {type: "adaptive"}`) + `effort` parameter. Old `budget_tokens` calls will error.
- **Literal instruction following** — Opus 4.7 reads spawn prompts more literally than 4.6. Vague phrasing ("review everything relevant") produces worse output than with 4.6. Be more explicit in file paths, concerns, and deliverable format.
- **Tokenizer inflation** — Opus 4.7 produces 1.0–1.35× more tokens for the same input compared to 4.6. A 3-teammate audit that cost $7 on 4.6 may cost $9–12 on 4.7 at the same effort tier. Budget accordingly.
- **Vision upgrade** — 2,576px long edge (3× previous), 98.5% visual acuity. If teammates need to analyze screenshots or diagrams, 4.7 is meaningfully better.

## Architecture

```
Team Lead (your main Claude Code session)
├── Creates team, spawns teammates, coordinates work
├── Synthesizes results into unified output
├── Can operate in DELEGATE MODE (coordinates only, never implements)
│
├── Teammate 1 (own context window, up to 1M tokens)
│   ├── Independent execution in own git worktree
│   ├── Can message other teammates directly (peer-to-peer mailbox)
│   ├── Can message team lead
│   └── Loads CLAUDE.md automatically
│
├── Teammate 2 (own context window)
│   └── Same capabilities
│
└── Teammate N (up to 10 teammates)
    └── Same capabilities
```

Key architectural facts:
- **Peer-to-peer messaging** — teammates communicate via mailbox system, not just hierarchically through the lead. They share findings, challenge each other, and coordinate independently.
- **Teammates start BLANK** — they load CLAUDE.md automatically but do NOT inherit the lead's conversation history. Everything a teammate needs must be in the spawn prompt or in CLAUDE.md. **This matters more with Opus 4.7** — its literal reading means implicit assumptions get dropped on the floor.
- **Shared task list** — on-disk `.claude/tasks/` directory with file locking for claim management.
- **Git worktrees** — each teammate works in its own worktree to prevent file conflicts.
- **Delegate mode** — when set, the lead ONLY coordinates and does not implement. Use when you want clean separation between planning and execution. Pairs well with Opus 4.7 lead + Sonnet 4.6 teammates (via separate `--model` processes, see workaround below).

## Critical Constraint: Single Model Per Team

As of April 2026, all agents in a team run the same model. You pick one of:

| Model | Teammate Cost | When to Use |
|-------|--------------|-------------|
| **Opus 4.7 @ high** | Highest | Cross-layer audits with ambiguous failure modes, decisions that affect architecture for months |
| **Opus 4.7 @ xhigh** | Very high | Only when `high` genuinely fell short — rare |
| **Opus 4.6 @ high** | High | Default for serious audits and complex features. Proven, cheaper than 4.7. |
| **Sonnet 4.6 @ high** | Medium | Research spikes, well-scoped implementation, most debugging. Sonnet 4.6 is the daily driver. |
| **Haiku 4.5** | Low | Rarely a fit for agent teams — scope is usually too complex for Haiku. |

**Rule of thumb:** use the cheapest model that gets it right the first time. A wrong answer from Opus 4.7 costs more than a right answer from Sonnet 4.6.

**Role-based model selection is not yet supported.** Workaround: spawn separate Claude Code processes with explicit `--model` flags, but you lose built-in coordination and shared task list.

## Operational Controls

### Navigation
- **Ctrl+T** — view task list (what every teammate is working on)
- **Shift+Up/Down** — cycle through active teammates (in-process mode)
- **Enter** — open a teammate's session
- **Escape** — interrupt a teammate's turn

### Modes
- **In-process mode** (default) — all agents in one terminal
- **Split-pane mode** — requires tmux or iTerm2, each agent in its own panel

## Prompt Construction Template

Every agent team prompt needs these components:

```
---
🎯 Model: [Opus 4.7 | Opus 4.6 | Sonnet 4.6] — adaptive thinking, effort: [medium | high | xhigh]
Mode: Agent Teams (requires CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1)
Teammates: [N]
Est. cost: [rough estimate based on team size, model, effort]
Why this model: [cost-of-mistakes reasoning — 1 line]
Why Agent Teams: [rationale for agent teams vs single session]
---

Create an agent team to [high-level objective]. Spawn [N] teammates:

- Teammate 1 ([Role Name]): [Specific scope and deliverable].
  Focus on: [exact files/areas/concerns].
  Output: [what this teammate produces].

- Teammate 2 ([Role Name]): [Specific scope and deliverable].
  Focus on: [exact files/areas/concerns].
  Output: [what this teammate produces].

- Teammate N ([Role Name]): [Specific scope and deliverable].
  Focus on: [exact files/areas/concerns].
  Output: [what this teammate produces].

Coordination rules:
- [File ownership assignments]
- [Message-passing expectations]
- [What to do when blocked]

Quality bar: [explicit standard — "make sure you have a very high quality bar" trickles down to all teammates]

After all complete: [synthesis instructions — exact output format, how to handle contradictions]
```

### Spawn Prompt Checklist

Because teammates start blank, each spawn prompt MUST include:
1. **Role and scope** — what this teammate owns
2. **Specific files/directories** — what to read, what to write (Opus 4.7 especially: be literal, avoid "relevant files")
3. **Deliverable format** — what "done" looks like (exact schema or section headers)
4. **Boundaries** — what NOT to touch
5. **Communication expectations** — when to message others, when to just work

If a teammate needs domain knowledge that isn't in CLAUDE.md, put it in the spawn prompt. Don't assume they'll figure it out. **Opus 4.7 is less likely to extrapolate from implicit context than 4.6** — it does what you said, not what you meant.

## Design Principles

### 1. Independence is everything
Each teammate must be able to work without waiting on another. If Teammate B needs Teammate A's output, it's not a good agent team task — use sequential prompts instead.

**Good decomposition:**
- Security audit + Performance audit + Test coverage audit (independent domains)
- Frontend component + Backend API + Database migration (independent layers with shared contract)
- Three competing debug hypotheses tested in parallel

**Bad decomposition:**
- Design API schema → Implement API → Write tests (sequential dependency)
- Parse file → Transform data → Write output (pipeline)

### 2. Scope teammates tightly
Vague roles produce vague results. Each teammate needs:
- Exact files or directories to examine
- Specific concerns to evaluate (not "review everything")
- A concrete deliverable format
- Maximum 8 retry attempts on any failing task with mandatory reflection: "What specifically failed? What one change would fix it?"

### 3. Prevent file conflicts
Two teammates editing the same file creates merge hell. Assign file ownership:
- "Teammate 1 owns `src/api/` — no other teammate should modify files there"
- Or use read-only patterns: "All teammates READ the codebase but only the lead applies changes"

### 4. Define the synthesis step
Without a clear synthesis instruction, the team lead just dumps raw reports. Always specify:
- How to merge findings (prioritized list, action plan, unified report)
- What the final deliverable looks like
- How to handle contradictions between teammates

### 5. Consider a read-only reviewer
For production work, add a reviewer agent that improves quality without slowing throughput:
- Tools: lint, run tests, security-scan only — NO file writes
- Trigger: review on every TaskCompleted event
- Scope: only files changed in that task, not the full codebase
- Output: structured findings (blocking / non-blocking) added to shared task list

## Proven Patterns

### Pattern 1: Parallel Code Audit (3 teammates)

Best for: comprehensive codebase review across independent quality dimensions.

**Recommended model:** Opus 4.6 @ high is the default (proven for 3-sprint IMACX audits). Upgrade to **Opus 4.7 @ high** when the audit is architectural / affects decisions for months. Stay on 4.6 for routine code health sweeps.

```
Create an agent team to audit [module/feature]. Spawn three teammates:

- Teammate 1 (Code Quality): Review for dead code, inconsistent patterns, missing error handling, TODO/FIXME items, and type safety gaps. Check that all async operations have proper error handling and loading states. Report as prioritized findings with file:line references and effort estimates (S/M/L).

- Teammate 2 (UX/UI): Review components for layout inconsistencies, missing loading/empty/error states, broken responsive behavior, accessibility gaps (contrast, keyboard nav, ARIA labels), and design system alignment. Report with file:line references and screenshots where possible.

- Teammate 3 (Data Integrity): Trace data flow from source through storage to frontend. Verify queries match actual schema, check for N+1 patterns, missing indexes, and any mismatch between backend fields and frontend expectations. Report with query locations and schema evidence.

Quality bar: High. Each teammate should be thorough — don't skip edge cases.

After all three complete, synthesize into a single prioritized action plan with:
- Tiers: Critical (data loss/corruption) → High (user-facing failures) → Medium (code health) → Backlog
- Effort estimate per item (Small/Medium/Large)
- Cross-references between teammate findings where issues overlap
```

### Pattern 2: Multi-Layer Feature Build (3 teammates)

Best for: full-stack features where frontend, backend, and tests can be developed independently against a shared contract.

**Recommended model:** **Sonnet 4.6 @ high** for most feature builds — it's the daily driver and cheaper than Opus. Upgrade to Opus 4.6/4.7 only if the feature touches load-bearing architecture or PHC integration where mistakes are expensive to unwind.

```
Create an agent team to implement [feature]. Use delegate mode — lead coordinates only.

Spawn three teammates:

- Teammate 1 (Backend): Implement the API layer:
  [specific endpoints, database changes, business logic]
  Write to: [specific directories]
  Contract: [shared interface/types that frontend will consume]
  FIRST TASK: Define and commit the shared types/contract before other work begins.

- Teammate 2 (Frontend): Implement the UI components:
  [specific pages, components, state management]
  Write to: [specific directories]
  Contract: Use the types defined in [shared types file] — do NOT modify them.
  START AFTER: Teammate 1 commits the contract.

- Teammate 3 (Testing): Write integration and unit tests:
  [specific test scenarios, edge cases to cover]
  Write to: [test directories]
  START AFTER: Teammates 1 and 2 have initial commits.

Coordination rules:
- All teammates message the lead when they encounter a contract issue
- Lead resolves contract disputes before teammates proceed
- If blocked for >2 minutes, message the lead

After all complete, run the full test suite and report results.
```

### Pattern 3: Competing Debug Hypotheses (2-3 teammates)

Best for: stubborn bugs where the root cause is unclear.

**Recommended model:** Start with **Sonnet 4.6 @ high** — most bugs don't need Opus. Escalate to **Opus 4.7 @ high** when hypotheses span subtle concurrency / race / caching behavior, or when prior Sonnet runs produced inconclusive/contradictory evidence. Opus 4.7's deeper reasoning is worth the cost when the bug has already wasted hours.

```
Create an agent team to debug [bug description]. Spawn three teammates, each testing a different hypothesis:

- Teammate 1 (Hypothesis A): Investigate whether [theory A — e.g., "the issue is a race condition in the auth middleware"]. Look at [specific files/logs]. Add targeted logging or write a reproduction test.

- Teammate 2 (Hypothesis B): Investigate whether [theory B — e.g., "the issue is stale cache after deployment"]. Look at [specific files/logs]. Add targeted logging or write a reproduction test.

- Teammate 3 (Hypothesis C): Investigate whether [theory C — e.g., "the issue is a schema mismatch between API versions"]. Look at [specific files/logs]. Add targeted logging or write a reproduction test.

Each teammate should:
1. State their hypothesis clearly
2. Gather evidence for/against
3. Message the other teammates with findings that might affect their hypothesis
4. Max 8 attempts per failing investigation path — reflect before retrying
5. Conclude with: confirmed / refuted / inconclusive + evidence

After all complete, synthesize findings. If one hypothesis is confirmed, draft the fix. If inconclusive, recommend next investigation steps.
```

### Pattern 4: Research & Recommendation (3+ teammates)

Best for: technical decisions requiring exploration of multiple options.

**Recommended model:** **Opus 4.7 @ high** when the decision is hard to reverse (framework migration, database switch, auth rewrite). **Sonnet 4.6 @ high** for routine tech picks (which charting library, which logging service). Cost-of-mistakes drives this one harder than most patterns — a wrong architectural decision is paid for in months of rework.

```
Create an agent team to evaluate [decision — e.g., "migration from REST to tRPC"]. Spawn three teammates:

- Teammate 1 (Advocate): Build the strongest case FOR the change. Research benefits, find examples, estimate effort, identify wins.

- Teammate 2 (Devil's Advocate): Build the strongest case AGAINST. Research risks, find failure stories, estimate hidden costs, identify what could go wrong.

- Teammate 3 (Pragmatist): Analyze the current codebase to assess migration complexity. Count affected files, identify dependencies, estimate timeline, find the path of least resistance.

Each teammate messages findings to others for cross-examination. Teammates should challenge each other's assumptions.

After all complete, synthesize into a decision document:
- Recommendation (go / no-go / partial migration)
- Evidence summary from all three perspectives
- If go: phased migration plan
- If no-go: what would need to change to reconsider
```

## Anti-Patterns

### Don't: Over-staff the team
3 teammates is the sweet spot. 2 for simple parallel tasks, 4-5 for genuinely complex multi-domain work. More than 5 almost always means some teammates have overlapping scope. Each teammate costs a full context window of tokens — and on Opus 4.7, each token is more expensive.

### Don't: Use agent teams for sequential work
If step 2 depends on step 1, use prompt chaining or a single session. Agent teams shine on parallelizable work only.

### Don't: Leave synthesis vague
"Combine the results" is not a synthesis instruction. Specify the exact output format, prioritization criteria, and how to handle contradictions.

### Don't: Forget file ownership
Two teammates editing the same file will create conflicts. Either assign exclusive write access per directory, or have all teammates produce reports and let the lead apply changes.

### Don't: Skip the effort/cost consideration
Agent teams use significantly more tokens than a single session. A 3-teammate audit that takes 15 minutes might cost $7–10 on Opus 4.6 Max, **$9–13 on Opus 4.7 Max**, $3–5 on Sonnet 4.6. For routine tasks, a single session is 3x cheaper regardless of model. Always note the cost tradeoff in the model recommendation block.

### Don't: Send thin spawn prompts
Since teammates don't inherit conversation history, a spawn prompt like "review the auth module" produces garbage. Be as detailed in the spawn prompt as you would be briefing a new contractor who just joined the project. **Opus 4.7 amplifies this**: its literal reading rewards precision and punishes vagueness more than 4.6.

### Don't: Set `budget_tokens` on Opus 4.7
Manual extended thinking is deprecated on 4.7. Use adaptive thinking + `effort` parameter. If your team config references `budget_tokens`, remove it.

## Known Limitations (April 2026)

- **No session resumption** — `/resume` and `/rewind` do not restore in-process teammates. After resuming, the lead may try to message dead teammates. Tell it to spawn new ones.
- **Task status can lag** — teammates sometimes fail to mark tasks as completed, blocking dependent tasks. Check manually and nudge if stuck.
- **Shutdown can be slow** — teammates finish their current request/tool call before shutting down.
- **One team per session** — clean up the current team before starting a new one.
- **No nested teams** — teammates cannot spawn their own teams or teammates.
- **No role-based model selection** — all agents run the same model (Opus 4.7, Opus 4.6, Sonnet 4.6, etc.). Cannot mix.

## Cost Guidance

| Team Size | Model | Typical Token Usage | Approx. Cost | Best For |
|-----------|-------|--------------------|--------------|----------|
| 2 teammates | Sonnet 4.6 @ high | ~2x single session | $1–3 | Simple parallel tasks, A/B comparison |
| 2 teammates | Opus 4.6 @ high | ~2x single session | $4–6 | Serious 2-way analysis |
| 3 teammates | Sonnet 4.6 @ high | ~3-4x single session | $3–5 | Code audits (cheap tier), multi-layer features |
| 3 teammates | Opus 4.6 @ high | ~3-4x single session | $7–10 | Proven IMACX audit tier |
| 3 teammates | Opus 4.7 @ high | ~3-5x single session (token inflation) | $9–13 | Architectural audits, hard debugging |
| 3 teammates | Opus 4.7 @ xhigh | ~4-6x single session | $12–18 | Only when `high` was insufficient |
| 4-5 teammates | Opus 4.6 @ high | ~5-7x single session | $12–20 | Large-scale refactors, comprehensive reviews |

**Plan limits:**
- On Max plan ($100-200/month): 8-10 complex agent team tasks per 5-hour window on Opus 4.6; roughly 6-8 on Opus 4.7 due to token inflation.
- On Pro plan ($20/month): 2-3 agent team tasks per day on Opus before hitting limits. Sonnet-based teams fit more.

**Tokenizer note:** Opus 4.7 produces 1.0–1.35× more tokens than Opus 4.6 for the same task. Cost estimates above reflect this. When estimating budget, assume the high end for code-heavy tasks (tokenizer expansion is worst on code).
