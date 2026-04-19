# Codex Orchestration Playbook

Use this reference when designing prompts for Codex/OpenAI workflows that may benefit from sub-agents.

The goal is not to copy Claude team patterns literally. The goal is to use what Codex actually does well:

- one strong main agent owning the critical path
- bounded delegated lanes
- explicit model choice per lane
- direct tool execution
- verification before closeout

---

## First Decision

Choose between:

- single-agent workflow
- main agent plus sub-agents

Default to a single agent unless parallelism clearly reduces time or context load.

Use sub-agents only when:

- a side task is independent
- the write scope can stay separate
- the result can be integrated cleanly
- the main agent can continue useful work without waiting immediately

---

## Lane Templates

### 1. Main Lane

Owner of:

- problem framing
- immediate blocking step
- integration
- final correctness bar
- final answer or handoff

Best default model:

- `gpt-5.4` for architecture, synthesis, planning, mixed work
- `gpt-5.3-codex` when the main path is substantial coding inside a real repository

Do not delegate:

- the next blocking step
- final integration judgment
- final verification signoff

### 2. Explorer Lane

Use for:

- reading docs
- locating files
- extracting facts
- comparing candidate sources
- summarizing bounded context

Best default model:

- `gpt-5.4-mini`

Upgrade only if the exploration itself is ambiguous and high-stakes.

### 3. Worker Lane

Use for:

- implementing a bounded slice of code
- updating one isolated module
- writing a focused patch in a disjoint file set

Best default model:

- `gpt-5.3-codex` for substantial coding
- `gpt-5.4-mini` only for very small, mechanical, well-specified edits

Worker rules:

- assign explicit file or module ownership
- avoid overlapping write scopes
- do not ask the worker to redesign the task

### 4. Verification Lane

Use for:

- running tests
- checking logs
- browser verification
- design / regression review
- confirming output contracts

Best default model:

- `gpt-5.4-mini` for explicit checks and summaries
- `gpt-5.4` when the verification requires nuanced judgment

### 5. Docs Lane

Use for:

- packaging handoff notes
- updating docs or indices
- drafting `AGENTS.md` or AI_OS support docs
- preparing prompt output for another chat

Best default model:

- `gpt-5.4-mini`

---

## Recommended Default Patterns

### Pattern A: Architecture + Prompt Design

- Main lane: `gpt-5.4`
- No sub-agents unless there is independent source gathering

Why:

- the work is tightly coupled
- prompt quality depends on one coherent line of reasoning

### Pattern B: Coding + Repo Exploration

- Main lane: `gpt-5.3-codex`
- Explorer lane: `gpt-5.4-mini`

Why:

- the main agent codes while a cheap side lane gathers bounded context

### Pattern C: Coding + Verification

- Main lane: `gpt-5.3-codex`
- Verification lane: `gpt-5.4-mini`

Why:

- the main lane keeps implementing while the side lane summarizes checks or reviews evidence

### Pattern D: Large Multi-Part Task

- Main lane: `gpt-5.4` or `gpt-5.3-codex` depending on whether the task is architecture-led or implementation-led
- Explorer lane: `gpt-5.4-mini`
- Worker lane: `gpt-5.3-codex`
- Verification lane: `gpt-5.4-mini`

Use only when the work is truly separable.

---

## Anti-Patterns

Avoid:

- spawning sub-agents for vague thinking
- delegating the immediate next step
- overlapping write scopes
- using a strong expensive model for every lane
- waiting on sub-agents by reflex
- copying Claude team names without mapping them to actual Codex responsibilities

---

## Prompt Insert Template

Use this block inside a Codex/OpenAI prompt when orchestration should be explicit:

```markdown
# Execution Plan
- Main agent: own the critical path, integration, and final quality bar.
- Sub-agent 1: [bounded task] using [model].
- Sub-agent 2: [bounded task] using [model].

# Delegation Rules
1. Keep the main agent on the immediate blocking step.
2. Delegate only concrete side tasks with non-overlapping scope.
3. Use the cheapest sufficient model per lane.
4. Do not wait on sub-agents unless the next main-path action is blocked on their result.
5. The main agent remains responsible for final verification and integration.
```
