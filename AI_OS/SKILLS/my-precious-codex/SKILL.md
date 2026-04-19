---
name: my-precious-codex
description: Prompt builder optimized for OpenAI models and Codex workflows. Use when the user wants to create, optimize, or refine prompts for Codex, GPT-5.4, GPT-5.3-Codex, or agentic OpenAI workflows. Triggers on "prompt for Codex", "Codex system prompt", "OpenAI prompt", "GPT-5 prompt", "prompt my precious codex", "agent prompt for OpenAI", or any request to adapt a Claude-oriented prompt to OpenAI/Codex.
---

# My Precious Codex

Build production-ready prompts for Codex and OpenAI models through a short structured interview.

Last reviewed against official OpenAI docs on 2026-04-04.

## Workflow

1. Gather only the missing requirements.
2. Identify the target surface.
3. Decide whether this should run as a single-agent or multi-agent workflow.
4. Choose the starting model and reasoning level.
5. For implementation, refactor, or debugging prompts, apply the coding prompt discipline checkpoint.
6. Build a prompt or instruction file that matches Codex/OpenAI behavior.
7. Save substantial prompts to disk by default.
8. Return the final prompt plus the Windows absolute path and brief implementation notes.

## Phase 1: Target Surface

Ask this first because the best prompt shape changes with the execution surface.

### Q1: Where will this run?

- Codex app / CLI
- OpenAI API with Responses API
- General GPT-5 chat workflow
- Unknown

Why it matters:

- Codex app / CLI: prefer durable repo instructions in `AGENTS.md` over giant one-off prompts.
- Codex app / CLI: save reusable execution prompts under `AI_OS/SESSION-PROMPTS/CODEX-RUNBOOKS/` when project `AI_OS` exists.
- Responses API: prompts may need explicit tool, state, and verification contracts.
- General GPT-5 chat: keep the prompt compact and direct.

### Q2: What kind of task is it?

- Coding / debugging
- Research / synthesis
- Structured transformation
- Agentic workflow
- System prompt / assistant behavior

For coding, debugging, or refactoring tasks, default to the coding prompt discipline checkpoint: surface assumptions, prefer the smallest direct solution, require surgical scope, and define verifiable success criteria.

### Q3: What should the model do on its own, and when must it ask?

Default OpenAI/Codex behavior should be:

- Proceed without asking when the next step is clear, low-risk, and reversible.
- Ask before irreversible actions, production side effects, destructive changes, or choices that materially change the result.
- Ask when sensitive missing information is required.

### Q3b: Should this use sub-agents?

For substantial Codex workflows, decide this before writing the prompt.

Use a single agent when:

- the task is small or tightly coupled
- the next blocking step depends on one continuous line of reasoning
- splitting the work would add more coordination cost than speed

Use sub-agents when:

- the work contains independent sidecar tasks that can run in parallel
- one agent can keep the critical path moving while others gather bounded context
- different subtasks clearly benefit from different model sizes or specialties

Default orchestration rules:

- the main agent owns the immediate blocking step, integration, and final quality bar
- sub-agents get concrete, bounded, non-overlapping tasks
- do not delegate vague "go think" work
- do not delegate the next step if the main agent is blocked on it right away

## Phase 2: Task Contract

### Q4: What context is actually needed?

Capture only the context that changes the answer:

- Files or paths
- Business rules
- Schemas or APIs
- Prior decisions
- Style or formatting expectations

### Q5: What does success look like?

Define explicit completion criteria:

- Exact deliverable
- Required checks
- Evidence to show
- What must not change

### Q6: What output contract is required?

Examples:

- Short answer
- Markdown report
- JSON schema
- Patch / code
- `AGENTS.md` content

## Phase 3: Model and Effort

### Q7: What is the starting model?

Use these defaults unless the user specifies otherwise:

- `gpt-5.4` for general reasoning, writing, planning, and mixed work
- `gpt-5.3-codex` for repository-scale coding and agentic coding via API
- `gpt-5.4-mini` for cheaper structured tasks when the workflow is explicit

### Q8: What is the starting reasoning effort?

Treat reasoning effort as a last-mile knob, not the main fix.

- `none` or `low` for short, execution-heavy, or cost-sensitive tasks
- `medium` for most serious work
- `high` for research-heavy or long-horizon tasks
- `xhigh` only when evals justify it

Before raising effort, strengthen:

- completion criteria
- verification steps
- tool-use rules
- ambiguity handling

### Q9: If sub-agents are justified, which models should each lane use?

Use cheapest-sufficient model selection.

Starting defaults:

- `gpt-5.4` for architecture, synthesis, integration, and ambiguous planning
- `gpt-5.3-codex` for substantial code implementation or repository-coupled coding
- `gpt-5.4-mini` for bounded read-only exploration, extraction, summarization, or prompt formatting

Heuristics:

- keep the strongest model on the main path when the task is architecture-sensitive
- use `gpt-5.4-mini` for sidecar tasks that are specific, easy to verify, and cheap to rerun
- use a coding model for sub-agents only when they own a real implementation slice with a disjoint write scope
- avoid spawning multiple strong agents when one strong main agent plus one or two minis is enough

## Prompt Construction Patterns

## Core Shape

For Codex/OpenAI prompts, prefer short explicit sections over Claude-style XML-heavy prompts unless XML is useful for a downstream parser.

Recommended shape:

```markdown
# Goal
[What must be achieved]

# Context
[Only the material facts the model needs]

# Instructions
1. [Exact action order]
2. [Decision rules]
3. [When to ask vs proceed]

# Constraints
- [What must not happen]
- [Scope limits]

# Verification
- [Commands or checks to run]
- [Evidence required before claiming completion]

# Output
[Exact response format]
```

## Key Principles

1. Put critical rules first.
2. Use numbered steps when tool use or side effects matter.
3. Show the correct execution flow, not just the final format.
4. Define ambiguity behavior explicitly: proceed, ask, or abstain.
5. Prefer concrete success criteria over vague quality adjectives.
6. Ask for verification evidence, not ungrounded confidence.
7. Avoid requesting hidden chain-of-thought. Ask for concise reasoning summaries only if needed.

## Codex-Specific Guidance

For Codex app / CLI:

- Put durable repo guidance in `AGENTS.md`, not in a giant reusable chat prompt.
- Keep `AGENTS.md` concise, actionable, and layered by directory.
- Use `AI.md` as a lightweight universal loader or fallback, not the primary Codex instruction surface.
- Save substantial prompts to disk and return the Windows absolute path instead of leaving them only in chat.
- Default destinations:
  - reusable runbooks -> `AI_OS/SESSION-PROMPTS/CODEX-RUNBOOKS/`
  - one-off session prompt artifacts -> `AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`
- Ask for short progress updates, not verbose narration.
- If the user is planning substantial work, present a short orchestration plan before the final prompt.
- That plan should say: single agent or multi-agent, why, what the main agent owns, what each sub-agent owns, and which model each lane should use.
- Prefer Codex-native strengths over Claude-style abstractions:
  - hierarchical `AGENTS.md`
  - bounded sub-agents with explicit model choice
  - plugins / connectors / MCP tools when available
  - direct execution and verification loops

## Responses API Guidance

For `gpt-5.3-codex` API integrations:

- Preserve assistant `phase` metadata across turns.
- Keep preambles short and human.
- Separate commentary/progress from the final closeout.
- When the prompt is meant to be reused, save it on disk and return the absolute path.

## Coding Prompt Pattern

Load `references/coding-discipline-checkpoint.md` when a coding prompt needs stronger anti-overengineering, ambiguity handling, or surgical-change language.

```markdown
# Goal
Implement the requested change with minimal scope and no regressions.

# Assumptions and Ambiguity
- Surface material assumptions before editing.
- Ask if ambiguity would materially change the outcome; otherwise choose the smallest reversible path and state it.

# Instructions
1. Read the relevant files before editing.
2. Change only the files needed for the task.
3. Prefer the smallest direct solution; do not add abstractions, options, or features beyond the request.
4. Clean up only unused code introduced or orphaned by your own change.
5. Verify the affected behavior after edits.
6. If the first fix fails twice, stop and report the structural issue.

# Constraints
- Do not use destructive git commands.
- Do not invent behavior not requested.
- Preserve existing working behavior outside the target scope.
- Do not perform drive-by formatting, comment rewrites, renames, or adjacent refactors.

# Verification
- Run the relevant tests or checks.
- Report the concrete output.
- Use exactly one verification label: `repo-standard verified`, `partial verification`, or `unverified`.

# Output
Return a concise summary of changes, verification performed, and any remaining risk.
```

## Multi-Agent Prompt Pattern

Use this when the target workflow should explicitly delegate parallel work.

```markdown
# Goal
[What must be achieved]

# Execution Mode
Use one main agent plus bounded sub-agents only where parallel work is clearly justified.

# Orchestration Plan
- Main agent: [critical path + integration responsibility]
- Sub-agent 1: [bounded sidecar task] using [model]
- Sub-agent 2: [bounded sidecar task] using [model]

# Instructions
1. Keep the main agent on the immediate blocking step.
2. Delegate only concrete, non-overlapping side tasks.
3. Use the cheapest sufficient model for each delegated lane.
4. Do not wait on a sub-agent unless the next main-path action is blocked on its result.
5. Integrate sub-agent outputs only after checking they actually advance the task.

# Constraints
- Do not create parallel work for tightly coupled tasks.
- Do not delegate vague or duplicate work.
- Do not offload final responsibility for correctness from the main agent.

# Verification
- Confirm what each lane completed.
- Verify the integrated result on the main path before claiming completion.

# Output
Return the orchestration result, verification evidence, and any blocked lane.
```

## Standard Lane Templates

When the user wants a Codex-native orchestration plan, prefer these lanes instead of copying Claude team structures literally:

- Main lane: architecture, task ownership, critical path, integration, final quality bar
- Explorer lane: bounded read-only repo inspection, extraction, or source gathering
- Worker lane: implementation in a disjoint write scope
- Verification lane: tests, review, regression checks, browser verification, or output validation
- Docs lane: handoff notes, AGENTS/docs updates, indexing, or prompt packaging

Do not use all lanes by default. Pick only the lanes that materially reduce cycle time or context load.

Load `references/codex-orchestration-playbook.md` when the user wants a reusable multi-agent prompt structure, lane templates, or model-per-lane guidance.

## AGENTS.md Pattern

When the user wants a Codex-ready repo instruction file, optimize for:

- real paths
- real commands
- minimal prose
- explicit boundaries
- durable repo rules, not temporary session chatter

## Final Output

Return:

1. The orchestration recommendation:
   - single agent or multi-agent
   - whether sub-agents are justified
   - recommended model and reasoning effort for the main lane
   - recommended model for each delegated lane if any
2. The finished prompt or `AGENTS.md` draft.
3. Short notes on what to test or tune next.

## Load-On-Demand References

- `references/codex-orchestration-playbook.md` -> Codex-native lane templates, delegation rules, and model-per-lane defaults
- `references/coding-discipline-checkpoint.md` -> coding prompt discipline for assumptions, simplicity, surgical scope, and verifiable success criteria
