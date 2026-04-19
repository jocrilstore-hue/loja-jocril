---
name: my-precious
description: Interactive prompt builder optimized for Anthropic models (Opus 4.7, Opus 4.6, Sonnet 4.6, Haiku 4.5). Use when the user wants to create, optimize, or refine prompts, build system prompts, design agentic workflows, orchestrate agent teams, or improve existing prompts. Triggers on "help me prompt my precious", "prompt my precious", "create a prompt", "optimize this prompt", "system prompt", "agentic prompt", "agent team prompt", "swarm prompt", "multi-agent", or any request to craft prompts for AI models. Also triggers when the user wants to break a complex task into parallel agent work, coordinate multiple Claude Code sessions, or generate orchestrated multi-step workflows.
---

# My Precious Prompt Engineer

Build production-ready prompts for Claude through structured interview.

## Workflow

1. **Gather requirements** via focused interview
2. **Select optimal model, effort tier, and features** (adaptive thinking, tools, etc.)
3. **Construct prompt** using Claude-specific best practices
4. **Output final prompt** with implementation notes and a Model + Effort recommendation block

## Interview Process

Ask sequentially. Skip when obvious from context. Max 2-3 questions per message.

### Phase 1: Task & Model Selection

**Q1: What do you want Claude to do?**
Categories that affect prompt structure:
- **Coding** → Adaptive thinking, explicit instructions, test requirements
- **Analysis/Reasoning** → Structured output, thinking tags
- **Creative** → Personality, examples, format constraints
- **Data Processing** → Schema definitions, validation rules, error handling
- **Agentic** → Tool definitions, planning instructions, persistence rules
- **Conversation/Assistant** → System prompt, role, boundaries

**Q2: What Claude model will you use?**

The "right" model depends on the cost of being wrong. Use this framing:

> **"What happens if this output has a mistake?"**
> - *Minor inconvenience* → Sonnet 4.6 or Haiku 4.5
> - *Wasted time, rework, dev friction* → Sonnet 4.6 (adaptive thinking)
> - *Real business impact, subtle bugs ship to prod, wrong architecture* → **Opus 4.7**

Model lineup:

- **Opus 4.7** (`claude-opus-4-7`) — *Newest flagship (April 2026). Hand off your hardest work.*
  - Best for: complex architecture, subtle bugs across files, large refactors, agentic coding at depth, team-lead role in agent teams, long-running autonomous work, dense screenshot/diagram vision, financial/data-dense reasoning.
  - Strengths vs 4.6: +13% on coding benchmarks, 3× on Rakuten-SWE-Bench, 98.5% vs 54.5% visual acuity, substantially better instruction following, self-verifies before reporting.
  - **Cost reality:** Same $5/$25 per MTok pricing as 4.6, BUT the tokenizer was updated — same input maps to 1.0–1.35× more tokens. At `xhigh`/`max` effort, Claude thinks much more (output tokens balloon). Real-world cost is often 1.3–1.8× a 4.6 call at the same effort.
  - **Breaking change:** Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) is **no longer supported**. Use adaptive thinking + the `effort` parameter.
  - **Effort respected more strictly** than 4.6 — use min `high` for intelligence-sensitive work; `low`/`medium` now actually mean low/medium.
  - Prompts tuned for 4.6 may behave differently — 4.7 follows instructions more precisely, which can surface sloppy phrasing that 4.6 silently overlooked.

- **Sonnet 4.6** (`claude-sonnet-4-6`) — *Daily driver. Start here for most work.*
  - Best for: standard coding, daily agentic loops, analysis, writing, planning. ~90% of Opus capability at 2× the speed and a fraction of the cost. Preferred over Opus 4.5 by 59% of developers for coding.
  - Supports adaptive thinking + low/medium/high effort (no `xhigh`).

- **Opus 4.6** (`claude-opus-4-6`) — *Legacy heavy lifter. Use only when 4.7 isn't available or the 4.7 behavior change breaks something.*
  - Still supports manual extended thinking (`budget_tokens`) if you need exact budget control.
  - Has the deprecated interleaved-thinking beta header — don't use it; use adaptive.

- **Haiku 4.5** (`claude-haiku-4-5-20251001`) — *Fast + cheap.*
  - Best for: high-volume classification, extraction, conversational UI, real-time chat, batching.

- **Claude Code hybrid pattern (`/model opusplan`)** — *Hybrid orchestration inside one session.*
  - Claude Code plans and reasons with Opus 4.7, then auto-switches to Sonnet 4.6 for implementation/code generation. Gives you Opus-quality architecture without paying Opus rates on every line written. Great default for non-trivial multi-file work.

- **Claude Code Agent Teams** — Multi-agent orchestration. See Q3b.

- **API/Unknown** — General best practices apply.

**Q3: Thinking mode**

- **Adaptive thinking** (the default for all 4.x models) — Claude decides dynamically when and how much to think. Use `thinking: {type: "adaptive"}`. On 4.7, the `effort` parameter is the recommended control over reasoning depth.
- **Manual extended thinking** — `thinking: {type: "enabled", budget_tokens: N}`. **Only supported on Opus 4.6, Sonnet 4.6, Haiku 4.5.** Removed on Opus 4.7 — use effort instead.
- **No thinking** — Simple tasks, real-time chat, high-volume processing.

Recommend adaptive for: complex coding, multi-step reasoning, analysis, planning, agentic tasks.
Recommend none for: real-time chat, high-volume simple requests.

**Q3c: Effort level (adaptive thinking)**

Effort is how deeply Claude reasons inside adaptive thinking. It directly drives token spend and latency. Opus 4.7 respects these more strictly than 4.6 — don't over-set or under-set.

| Effort | Opus 4.7 | Sonnet 4.6 / Opus 4.6 | When to use |
|--------|----------|------------------------|-------------|
| **low** | Yes (actually low on 4.7) | Yes | Mechanical changes, config updates, single-line fixes, obviously-unambiguous tasks |
| **medium** | Yes | Yes | Refactoring with clear patterns, test writing with defined I/O, straightforward data extraction |
| **high** | Yes — default for intelligence-sensitive work | Yes — default for real work | Implementation, debugging, multi-file changes, anything where missing something is costly |
| **xhigh** | **Yes — new on 4.7** | No | Hardest coding, long agentic workflows, deep tool-calling exploration, subtle bugs where `high` stalls |
| **max** | Yes | Yes | Almost never — only when you've proven `xhigh`/`high` isn't enough. Burns tokens. |

Don't default to `max`. Don't default to `xhigh` either — only escalate when `high` stalls.

**Q3b: Agent Teams — Build the Prompt (not the decision)**

This skill builds agent team prompts. It does NOT decide whether agent teams are the right approach — that decision belongs to **architect-advisor's orchestration decision engine**.

If the user (or architect-advisor) has already decided this is an agent team task:
→ Load `references/agent-teams-patterns.md` and build the prompt using those patterns.

If the user hasn't decided yet and asks "should this be agent teams?":
→ Recommend consulting architect-advisor, OR use this gut-check:
- Can 2+ workers make progress simultaneously without stepping on each other? → Maybe agent teams
- Does the work require back-and-forth / challenge between workers? → Agent teams over subagents
- Is it sequential or single-file work? → Not agent teams

Once the mode is decided, proceed with prompt construction.

### Phase 2: Structure & Context

**Q4: What context does Claude need?**
Documents, schemas, domain rules, existing code, project structure, persona/communication style.

**Q5: What output format do you need?**
JSON (specify exact schema — use `output_config.format` not `output_format`), markdown, code (language + patterns + style), conversational prose, or a specific template.

**Q6: What constraints or rules apply?**
Length limits, forbidden behaviors, required sections, error handling expectations.

### Phase 3: Examples & Quality

**Q7: Do you have input/output examples?**
Few-shot examples dramatically improve consistency. Even 1-2 examples help. For coding: expected signature + return format. For analysis: desired output structure. For creative: tone/style samples.

**Q8: What quality indicators matter?**
Accuracy vs speed, verbose vs concise, conservative vs creative, safety level.

## Prompt Construction Patterns

### Core Claude Structure

Use XML tags for all structured prompts:

```
<role>
[Persona, expertise, communication style]
</role>

<context>
[Background documents, schemas, reference material]
</context>

<instructions>
[Clear, direct task description]
[Step-by-step process if multi-part]
</instructions>

<constraints>
[Explicit limits, forbidden behaviors, requirements]
</constraints>

<output_format>
[Exact structure, fields, format specification]
</output_format>

<examples>
[Input/output pairs demonstrating desired behavior]
</examples>

<task>
[The specific request to execute]
</task>
```

### Key Principles (Apply Always)

1. **Be explicit** — Claude 4 models follow precise instructions. 4.7 is *especially* literal; vague prompts surface more loudly than on 4.6.
2. **Long content at top** — Place documents/data BEFORE instructions (improves performance ~30%)
3. **Use consistent XML tags** — `<instructions>`, `<context>`, `<examples>`, `<o>` for clear structure
4. **Quote grounding** — For document tasks, ask Claude to quote relevant sections first
5. **Show patterns, not anti-patterns** — Positive examples > negative examples
6. **Don't prescribe thinking on adaptive models** — Avoid "think step by step" on any 4.x model with adaptive thinking. It adds noise.
7. **Prefill for format control** — Start Claude's response to lock in format (JSON, code blocks, etc.)

### Model-Specific Tips

**Opus 4.7 (primary heavy-lift):**
- **Hand off the hardest stuff** — self-verifies before reporting, excels at long-running agentic coding, multi-file refactors, subtle bug chases.
- **Use `xhigh` effort for coding/agentic work** — gives noticeably better results than `high` on hard problems. Start `high`, escalate to `xhigh` if it stalls.
- **Use `high` minimum for intelligence-sensitive work** — the strict effort interpretation means `medium` really is medium.
- **Vision is massively better** — 2,576px long edge (3× previous). Use it for dense screenshots, diagrams, charts, UI reviews.
- **Manual extended thinking removed** — use adaptive + effort. Don't send `budget_tokens`.
- **Re-tune 4.6 prompts when migrating** — 4.7 follows instructions more precisely. If the prompt had implicit "you know what I mean" phrasing, 4.7 will execute literally and may surprise you.
- **1M context available** — add header `context-1m-2025-08-07` for the beta.
- **Cost-aware escalation**: default to Sonnet 4.6 or Opus 4.7 at `high`. Only reach for `xhigh` when the task actually needs it.

**Sonnet 4.6 (daily driver):**
- Default choice for ~90% of tasks — coding, agents, analysis, office tasks.
- Enable adaptive thinking for complex coding and reasoning (significant boost).
- Concise, direct communication style by default.
- May skip verbose summaries after tool calls — adjust via prompt if needed.
- No `xhigh` — tops out at `high`.

**Opus 4.6 (legacy heavy lifter):**
- Only reach for this if 4.7 isn't available, you need manual `budget_tokens` control, or 4.7's stricter instruction following breaks an existing prompt.
- Supports Fast mode (`speed: "fast"` with `betas: ["fast-mode-2026-02-01"]`) for up to 2.5× faster output at premium pricing — not yet confirmed on 4.7.
- Compaction available for long-running conversations (automatic context summarization).

**Haiku 4.5:**
- Optimized for speed and cost.
- Use for real-time applications, high-volume processing, simple classification/extraction.
- Keep prompts focused and efficient.

**Hybrid pattern (`/model opusplan` in Claude Code):**
- Opus 4.7 plans + architects; Sonnet 4.6 implements/writes code. Cost-efficient default for non-trivial multi-file features.
- Use when the task starts with "figure out what to change" and ends with "now make the changes".

### Thinking Integration

**Adaptive thinking (Opus 4.7 / Sonnet 4.6 / Opus 4.6):**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=32000,
    thinking={"type": "adaptive"},
    effort="high",   # or "xhigh" on Opus 4.7 for hardest coding
    messages=[{"role": "user", "content": prompt}]
)
```
- REMOVE explicit chain-of-thought instructions — Claude thinks automatically.
- Don't prescribe thinking patterns; observe natural thinking first.
- Automatically enables interleaved thinking between tool calls.

**Manual extended thinking (Sonnet 4.6 / Opus 4.6 / Haiku 4.5 only — NOT Opus 4.7):**
```python
thinking={"type": "enabled", "budget_tokens": 10000}
```

Guidance prompt for tool use with thinking:
```
After receiving tool results, reflect on their quality and determine the next step
before proceeding. Use thinking to plan and iterate based on this new information.
```

### Coding Prompts

For robust, generalizable solutions:
```
<instructions>
Write a high quality, general purpose solution.
Implement logic that works for all valid inputs, not just test cases.
Do not hard-code values or create solutions that only work for specific inputs.
Focus on understanding the problem and implementing the correct algorithm.
If the task is unreasonable or tests are incorrect, tell me.
The solution should be robust, maintainable, and extendable.
</instructions>
```

### Agentic Workflows

For Claude Code and autonomous agents, structure CLAUDE.md or system prompts using the Karpathy Guardrails below.

### Karpathy Guardrails (Inject Into Every Coding/Agentic Prompt)

These four rules are NON-NEGOTIABLE in any prompt that involves code generation, file editing, debugging, or autonomous agent work. Inject them as a `## Behavioral Rules` section in the generated prompt — not as suggestions, as hard constraints.

Inspired by [Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding failure modes.

```
## Behavioral Rules

### 1. Think Before Coding — No Silent Assumptions
- State your assumptions BEFORE writing code. If uncertain, ASK.
- If the request has multiple valid interpretations, present them — don't pick silently.
- If a simpler approach exists than what was asked, say so. Push back when warranted.
- If something is unclear or contradictory, STOP. Name the confusion. Ask.
- Never "just run with it" — wrong assumptions compound into wasted work.

### 2. Simplicity First — Minimum Viable Code
- Write the minimum code that solves the stated problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If 200 lines could be 50, rewrite to 50.
- The test: would a senior engineer say this is overcomplicated? If yes, simplify.

### 3. Surgical Changes — Touch Only What You Must
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated issues (dead code, bad naming, missing tests), MENTION them — don't fix them silently.
- Clean up only YOUR orphans: remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless explicitly asked.
- The test: every changed line must trace directly to the request.

### 4. Goal-Driven Execution — Declarative Success Criteria
- Transform imperative tasks into verifiable goals:
  "Add validation" → "Write tests for invalid inputs, then make them pass"
  "Fix the bug" → "Write a test that reproduces it, then make it pass"
  "Refactor X" → "Ensure tests pass before and after"
- For multi-step tasks, state a brief plan with verification:
  1. [Step] → verify: [how you'll confirm it worked]
  2. [Step] → verify: [check]
- Strong success criteria let the model loop independently. Weak criteria ("make it work") require clarification — ask for better criteria rather than guessing.
- NO LAZY FIXES — Find root causes. No band-aids.
```

**When to inject:** Always include in prompts for Claude Code, agentic coding, file editing, debugging, and implementation tasks. Skip for pure analysis, creative writing, data extraction, or conversational prompts.

**Tradeoff note to include when appropriate:** "These rules bias toward caution over speed. For trivial one-liners, use judgment — not every change needs the full rigor."

### Long Context Tips

```
<documents>
<document index="1">
<source>filename.pdf</source>
<document_content>
{{DOCUMENT_CONTENT}}
</document_content>
</document>
</documents>

<instructions>
First, extract word-for-word any quotes relevant to the question.
Enclose quotes in <quotes></quotes> tags with document index.
Then answer in <answer></answer> tags.
</instructions>
```

For 1M token context (Opus 4.7, Opus 4.6, or Sonnet 4.6 beta), add header: `context-1m-2025-08-07`

### Few-Shot Pattern

```
<examples>
<example>
<input>[Example input 1]</input>
<o>[Example output 1]</o>
</example>
<example>
<input>[Example input 2]</input>
<o>[Example output 2]</o>
</example>
</examples>

<task>
[Actual input to process]
</task>
```

### Response Prefilling

Control output format by starting Claude's response:
```
Assistant: ```json
{
```

This forces JSON output format.

### Structured Output (API)

```python
# Current API (use this)
response = client.messages.create(
    output_config={"format": {"type": "json_schema", "schema": {...}}},
)

# Deprecated (avoid)
# output_format={"type": "json_schema", "schema": {...}}
```

## Advanced Patterns

For agentic workflows, tool definitions, and complex system prompts, see `references/advanced-patterns.md`.

For agent team prompt construction (multi-agent Claude Code), see `references/agent-teams-patterns.md`.

For pre-delivery quality checks and iteration failure modes, see `references/antipatterns.md`.

## CLI Prompt Rules (Mandatory for Claude Code Prompts)

These rules apply to EVERY prompt written for execution in Claude Code (CLI). No exceptions.

### 1. Always Include Build/Run Steps
If the task involves generating, modifying, or rebuilding any output artifact (playground, build, export, compiled file), the prompt MUST include the build/run command as an explicit instruction step. Never leave operational steps for the user to remember.

Example: If a prompt modifies source files that affect the playground output, add:
```
N. After all changes, rebuild the playground:
   bun run build:playground
   Report the output size and any errors.
```

### 2. Always Write Output Files to the Project
When producing report files, handoff documents, context files, or any deliverable that the user needs:
- Write them directly to the project's documented output directory
- Use the project's established naming conventions and paths
- DO NOT ask the user to save, download, or place files manually
- The prompt should specify the exact output path

Example:
```
Write your findings to: docs/prompts/SESSIONS/[date]/[filename].md
```

### 3. Always Include Model + Effort Recommendation

Every prompt MUST have a recommendation block at the top with:
- Model name and model string
- Thinking mode (adaptive / manual / none)
- Effort level (low / medium / high / xhigh / max — where supported)
- One-line rationale

Format for default Sonnet 4.6 work:
```
---
🎯 Model: Sonnet 4.6 (claude-sonnet-4-6) — adaptive thinking, effort: high
Why: [one-line rationale tied to the task]
---
```

Format for Opus 4.7 heavy-lift tasks:
```
---
🎯 Model: Opus 4.7 (claude-opus-4-7) — adaptive thinking, effort: xhigh
Why: hardest-tier coding; needs self-verification and deep tool-calling exploration
Cost note: tokenizer expansion + xhigh → expect ~1.5–2× 4.6/high token spend
---
```

Format for hybrid Opus-plan Sonnet-execute inside Claude Code:
```
---
🎯 Model: `/model opusplan` — Opus 4.7 plans, Sonnet 4.6 executes
Why: multi-file feature; architecture needs Opus judgement, writing code doesn't
---
```

**Effort guidance (don't default to max):**
- **low** — Mechanical changes (rename, config, single-line fix)
- **medium** — Refactors with clear patterns, tests with defined I/O, data extraction
- **high** — Default for real work: implementation, debugging, multi-file changes
- **xhigh** — Opus 4.7 only. Hardest coding, long agentic workflows, subtle bugs where `high` stalls
- **max** — Almost never. Only when `xhigh`/`high` has been proven insufficient

The user burns credits on every token of reasoning — pick the RIGHT tier, not the max tier.

## Output Delivery

**Before delivering:** Run the prompt against `references/antipatterns.md`. Check all 10 items. Fix any that apply.

Present final prompt in copyable format. Include:
- Model + effort recommendation block (see above)
- Any API parameters to set (`temperature`, `max_tokens`, `effort`, `betas`, `speed`)
- Iteration suggestions if initial results don't meet expectations

If the prompt is a revision of something that "stopped working," also check the Iteration Warnings section in `references/antipatterns.md` — Drift and Collapse are the usual culprits. If you're migrating a 4.6 prompt to 4.7, scan for implicit "you know what I mean" phrasing — 4.7's stricter instruction following will expose it.

## Quick Reference

| Task Type | Model | Effort | Thinking | Key Pattern |
|-----------|-------|--------|----------|-------------|
| Hardest coding / subtle bugs | Opus 4.7 | xhigh | Adaptive | Self-verification, test-first, tool-calling |
| Complex multi-file refactor | Opus 4.7 | high → xhigh | Adaptive | Explicit scope, contract-first |
| Agent team lead (planning) | Opus 4.7 | high | Adaptive | Team lead + scoped teammates, see `agent-teams-patterns.md` |
| Long autonomous agentic work | Opus 4.7 | xhigh | Adaptive | Persistence rules, checkpoints, self-verify |
| Dense screenshot / diagram vision | Opus 4.7 | high | Adaptive | Image first, specific ask |
| Financial / data-dense reasoning | Opus 4.7 | high | Adaptive | Quote grounding, structured output |
| Multi-layer feature (FE+BE+tests) | `/model opusplan` | high | Adaptive | Opus plans, Sonnet writes |
| Daily coding | Sonnet 4.6 | high | Adaptive | Concise instructions |
| Standard agentic loop | Sonnet 4.6 | high | Adaptive | Planning rules, checkpoints |
| Refactor with clear patterns | Sonnet 4.6 | medium | Adaptive | Explicit scope |
| 1M-context doc analysis | Opus 4.7 or Sonnet 4.6 | high | Adaptive | Long content top, quote grounding, `context-1m-2025-08-07` header |
| Real-time chat | Haiku 4.5 | — | None | Concise system prompt |
| High-volume classification | Haiku 4.5 | — | None | Minimal prompts, batching |
| Mechanical one-liner | Sonnet 4.6 / Haiku 4.5 | low | None | Minimal context |
| Manual budget_tokens control | Opus 4.6 / Sonnet 4.6 | — | Manual | Specify `budget_tokens` — NOT supported on 4.7 |

**Cost-aware defaults:**
- Start Sonnet 4.6 + `high`. Escalate to Opus 4.7 only when "mistakes have real impact."
- Inside Claude Code, `/model opusplan` is often the smartest default for multi-file work.
- `xhigh` is earned, not given. Use it when `high` demonstrably stalls.
