# Model Selection Guide

This document helps choose the right AI model for a task across multiple AI systems.

This is a portable guidance document for project setup and prompt design.
It is not the place for Maria's personal Codex home defaults. Those belong in `~/.codex/config.toml` and `~/.codex/AGENTS.md`.

The goal is to balance:

- capability
- cost
- speed
- reliability

Choosing the correct model prevents overpaying for simple tasks and avoids weak models for complex ones.

---

# Model Selection Philosophy

Follow this hierarchy:

Simple task → smaller / faster model
Medium task → balanced model
Complex reasoning → strongest model

Always use the **least powerful model capable of solving the task reliably**.

Pick on **cost-of-mistakes**, not recency. Newer flagship ≠ better default.

---

# Quick Reference Table

| Task Type | OpenAI | Claude | Gemini | Reasoning |
|-----------|--------|--------|--------|-----------|
| Architectural / irreversible decisions | GPT‑5.4 Pro | Opus 4.7 | 3.1 Pro | High |
| Heavy reasoning / audits | GPT‑5.4 Pro | Opus 4.6 | 3.1 Pro | High |
| General knowledge work | GPT‑5.4 | Sonnet 4.6 | 3.1 Pro | Medium |
| Coding (standard) | GPT‑5.4 or Codex app default | Sonnet 4.6 | 3.1 Pro | Medium |
| Coding (complex / multi‑file) | GPT‑5.3‑Codex | Opus 4.6 | 3.1 Pro | High |
| Structured transformations | GPT‑5.4 Mini | Haiku 4.5 | 3 Flash | Low |
| Bulk processing | GPT‑5.4 Nano or Mini | Haiku 4.5 | 3.1 Flash‑Lite | Low |

Default when uncertain:

OpenAI → GPT‑5.4
Claude → Sonnet 4.6
Gemini → 3.1 Pro

---

# Task Categories

## 1. Heavy Reasoning

Examples:

- system architecture
- complex debugging
- multi-step analysis
- strategic planning
- adversarial review

Recommended models:

OpenAI: GPT‑5.4 Pro (or GPT‑5.4 when Pro is unavailable)
Claude: Opus 4.6 (adaptive thinking) for audits and multi-layer reasoning; Opus 4.7 for architectural decisions that are hard to reverse (framework switch, auth rewrite, ERP integration layer)
Gemini: 3.1 Pro (or Deep Think for scientific / mathematical reasoning — access restricted)

Reasoning level: High

---

## 2. General Knowledge Work

Examples:

- research summaries
- writing
- planning
- moderate technical reasoning

Recommended models:

OpenAI: GPT‑5.4
Claude: Sonnet 4.6
Gemini: 3.1 Pro

Reasoning level: Medium

---

## 3. Coding Tasks

Examples:

- writing code
- refactoring code
- repository analysis
- debugging

Recommended models:

OpenAI: GPT‑5.3 Codex models for repository-scale coding, GPT‑5.4 for mixed coding + planning
Claude: Sonnet 4.6 for standard implementation, Opus 4.6 for complex multi-file work and audits, Opus 4.7 when the decision affects architecture for months
Gemini: 3.1 Pro

Reasoning level: Medium → High

Claude-specific note:
Claude Code (`cc` for Sonnet 4.6, `cco` for Opus 4.6, `cco47` for Opus 4.7) supports adaptive thinking mode. Use adaptive thinking when the task involves architectural judgment, tracing logic across files, or debugging subtle issues.

---

## 4. Structured Transformations

Examples:

- converting formats
- summarizing documents
- extracting fields
- rewriting text

Recommended models:

OpenAI: GPT‑5.4 Mini
Claude: Haiku 4.5
Gemini: 3 Flash (standard) or 3.1 Flash‑Lite (cheapest, highest throughput)

Reasoning level: Low

---

## 5. Bulk Processing

Examples:

- tagging large datasets
- classification
- extraction
- repetitive transformations

Use the **fastest cheap model that meets accuracy requirements**.

Reasoning level: Low

---

# Model Escalation Strategy

Start with the smallest model likely to succeed.

If results are inadequate:

Step 1 → Increase reasoning level (e.g., medium → high)
Step 2 → Move to stronger model (Sonnet → Opus 4.6 → Opus 4.7)
Step 3 → Escalate effort tier (high → xhigh, Opus 4.7 only, and only when `high` has demonstrably stalled)
Step 4 → Improve prompt structure

Avoid immediately jumping to the strongest model or the highest effort tier.

---

# Claude-Specific Guidance

## Thinking Modes

Claude 4.6 and 4.7 models support thinking modes:

Default — standard reasoning, sufficient for most tasks.
Adaptive — model decides how deeply to reason based on task complexity. **This is the recommended mode for Opus 4.6, Sonnet 4.6, and Opus 4.7.**

Use adaptive thinking when:

- reasoning quality matters more than speed
- the task requires holding large context
- missing something would be costly
- the task involves tracing logic across multiple files

In Claude Code (CLI), extended thinking is **ON by default**. Opus 4.6, Sonnet 4.6, and Opus 4.7 use adaptive reasoning automatically — no configuration needed.

## Opus 4.7 — Breaking Changes from 4.6

Opus 4.7 (model id: `claude-opus-4-7`) released April 16, 2026. Key differences from 4.6:

- **Same list price** ($5 input / $25 output per MTok), but the tokenizer expanded — **1.0-1.35× more tokens for the same input**. Real-world runs land **20-40% higher cost** than 4.6 at equal effort.
- **Manual `budget_tokens` is deprecated.** Setting `budget_tokens` on 4.7 will error. Use adaptive thinking (`thinking: {type: "adaptive"}`) + the `effort` parameter instead.
- **Stricter instruction following.** Vague prompts surface as worse outputs than on 4.6 — 4.7 doesn't fill in blanks as charitably.
- **New `xhigh` effort tier** (Opus 4.7 only, not available on 4.6). Reserved for demonstrably hard reasoning.
- Pick based on **cost-of-mistakes**, not recency. 4.6 is still the proven choice for routine audits.

## Effort Levels (Claude Code)

Effort controls how deeply the model reasons within adaptive thinking. This directly affects credit consumption and response time.

| Effort | When to use | Examples |
|--------|------------|---------|
| **high** | Default for implementation, debugging, multi-file changes, anything where missing something is costly | Bug fixes, feature implementation, forensic analysis, architectural audits |
| **medium** | Refactoring with clear patterns, test writing with defined I/O, straightforward data extraction | Rename refactors, extracting data from JSON, writing tests from a spec |
| **low** | Simple mechanical changes where the task is unambiguous | Config value change, single-line fix, renaming a variable |
| **xhigh** | Opus 4.7 only. Reach for this only when `high` has demonstrably stalled. Earned, not given. | Stubborn race conditions, multi-layer architectural synthesis, subtle-bug debugging |

**Do not default to max effort.** Match effort to task complexity. The user burns credits on every token of reasoning — give them the RIGHT level, not the maximum.

**Never `xhigh` preemptively.** Start at `high` on Opus 4.7 and escalate only with evidence.

Adjust effort in Claude Code with the `/effort` command or arrow keys in the model selector.

## Choosing Between Opus 4.6 and Opus 4.7

Rule: pick based on **cost-of-mistakes**, not recency.

| Scenario | Pick | Why |
|----------|------|-----|
| 3-sprint audit, PHC integration, routine multi-file work | Opus 4.6 @ high | Proven, cheaper, tokenizer-stable |
| Architectural decision with months of downstream impact | Opus 4.7 @ high | Worth the ~20-40% cost delta when mistakes compound |
| Framework switch, auth rewrite, ERP layer change | Opus 4.7 @ high | Hard to reverse — deeper reasoning pays off |
| Single feature, clear spec, low architectural risk | Sonnet 4.6 @ high | Opus is overkill |
| `high` has stalled on subtle-bug debugging | Opus 4.7 @ xhigh | Only with evidence of stalling |
| Quote extraction, classification, high-volume formatting | Haiku 4.5 | Fast, cheap, accurate enough |

**Never default to 4.7 just because it's newest.** Tokenizer inflation plus literal instruction following means vague prompts produce worse outputs than on 4.6.

## Prompt Structure

Claude responds well to XML tag structure:

```
<role>...</role>
<context>...</context>
<instructions>...</instructions>
<output_format>...</output_format>
<constraints>...</constraints>
```

Claude also supports assistant prefill for forcing output format (API usage).

Opus 4.7's literal instruction following rewards precise XML structure. Loose natural-language prompts that work on 4.6 may underperform on 4.7.

## CLI Prompt Rules

When writing prompts for Claude Code (CLI) execution, ALWAYS:

1. **Include build/run steps** — if the task modifies source that produces a built artifact (playground, bundle, export), the prompt MUST include the build command as an explicit instruction step. Never leave operational steps for the user to remember.

2. **Write output files to the project** — reports, handoffs, context files, and deliverables must be written directly to the project's documented directory. Never ask the user to save, download, or place files manually.

3. **Include model + effort recommendation** — every prompt must have a recommendation block:
```
---
🎯 Model: Sonnet 4.6 (cc) — adaptive thinking, effort: high
Why: [one-line rationale]
---
```

For Opus 4.7 recommendations, add a cost note:
```
---
🎯 Model: Opus 4.7 (claude-opus-4-7) — adaptive thinking, effort: high
Why: architectural decision, hard to reverse
Cost note: expect ~1.3× 4.6 token spend due to tokenizer inflation
---
```

## Claude Code Aliases

cc     → Claude Code with Sonnet 4.6
cco    → Claude Code with Opus 4.6
cco47  → Claude Code with Opus 4.7

## Agent Teams (Claude Code v2.1.69+)

Agent Teams enable coordinated parallel collaboration with shared task lists and peer-to-peer messaging. Runs on Opus 4.6/4.7 or Sonnet 4.6. Single model per team.

- **Opus 4.6 teams** — proven default for 3-teammate audits. ~$7-10 per audit.
- **Opus 4.7 teams** — upgrade for architectural decisions. ~$9-13 per audit (tokenizer inflation).
- **Sonnet 4.6 teams** — well-scoped parallel implementation work.

Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. See architect-advisor skill for orchestration decisions.

---

# OpenAI-Specific Guidance

## Current OpenAI Defaults

- `GPT‑5.4` — default general-purpose flagship for planning, writing, research, and mixed technical work
- `GPT‑5.4 Pro` — stronger option for heavy reasoning when available
- `GPT‑5.3-Codex` — coding-specialized model for repository-scale and long-running coding work
- `GPT‑5.4 Mini` — cheaper, more literal model for explicit structured tasks
- `GPT‑5.4 Nano` — smallest option for very high-volume simple transforms

When a project copies AI_OS, do not treat this section as permission to hardcode Maria's personal Codex-global defaults into the repo. Repo-local docs should only specify model choices when the project itself has a reason to override generic defaults.

## Reasoning Effort

OpenAI guidance treats reasoning effort as a last-mile tuning knob, not the first fix.

Starting defaults:

| Effort | When to use | Examples |
|--------|-------------|----------|
| **none** | Fast execution-heavy workflows where the task is explicit | tagging, extraction, short transforms, action selection |
| **low** | Latency-sensitive tasks that still benefit from some reasoning | lightweight triage, constrained classification |
| **medium** | Default for serious work | coding, planning, non-trivial analysis |
| **high** | Research-heavy, long-horizon, ambiguity-rich tasks | multi-doc synthesis, architectural review |
| **xhigh** | Only when evals prove it is worth the cost | long agentic workflows where maximum intelligence matters more than speed |

Before raising reasoning effort, first improve:

- completion criteria
- verification loop
- tool persistence rules
- ambiguity handling

## Codex Models

`GPT‑5.3-Codex` is the OpenAI coding-specialized choice for repository-scale coding and long-running coding work. If you use it through the Responses API, preserve assistant `phase` metadata (`commentary` vs `final_answer`) across turns.

## Codex Orchestration Defaults

Codex can use sub-agents with different models. Treat this as a practical orchestration tool, not as a reason to split every task.

Use this rule:

main lane = strongest necessary model
side lanes = cheapest sufficient model

Recommended defaults:

| Lane | Default model | When to use |
|------|---------------|-------------|
| Main architecture / integration lane | `GPT‑5.4` | planning, synthesis, task ownership, ambiguous decision-making |
| Main coding lane | `GPT‑5.3-Codex` | substantial repository-coupled implementation |
| Explorer lane | `GPT‑5.4 Mini` | bounded read-only analysis, extraction, source gathering |
| Verification lane | `GPT‑5.4 Mini` | explicit checks, result summaries, regression review |
| Docs / packaging lane | `GPT‑5.4 Mini` | handoffs, docs updates, prompt packaging |

Only add sub-agents when:

- workstreams are independent
- the main lane can keep moving
- ownership boundaries are clear

Do not add sub-agents when:

- the work is tightly coupled
- the next step is immediately blocked on the result
- coordination cost exceeds expected speed gain

Practical default:

- one strong main agent
- zero to two mini side lanes

This maps better to Codex than copying Claude "teams" literally.

## Prompting Style

For OpenAI and Codex prompts:

- put critical rules first
- use explicit step order when tools or side effects matter
- define when to proceed vs ask
- require verification evidence before completion claims
- keep durable repo instructions in `AGENTS.md`, not in giant chat prompts

---

# Gemini-Specific Guidance

## Current Model Lineup (Gemini 3 series)

3.1 Pro — flagship model. Strong reasoning, 1M token context, native multimodal. Default for most tasks.
3 Flash — mid-tier. Free tier default in Gemini app. Good balance of speed and quality.
3.1 Flash‑Lite — cheapest and fastest. Optimized for high-volume, latency-sensitive tasks like classification, translation, and content moderation. $0.25/1M input tokens.
3 Deep Think — specialized reasoning mode for science, math, and engineering. Requires Google AI Ultra subscription ($249.99/month). API access is invite-only. Do not route general tasks here.

## Thinking Levels

Gemini 3.1 models support adjustable thinking levels (minimal, low, medium, high). Use lower thinking for cheap bulk tasks, higher thinking for tasks needing accuracy. This controls cost and latency.

## Context Window

Gemini 3.1 Pro and 3.1 Flash‑Lite both support 1M token context windows. Consider Gemini when the task involves processing large documents or codebases in a single pass.

## Agentic Tools

Google Antigravity is an agentic IDE (not a model) powered by Gemini. It is comparable to Claude Code or Cursor, not to a model selection. Do not include it in model routing — treat it as an implementation environment.

---

# Multi-AI Workflow

When working with multiple AI systems:

Architectural / irreversible decisions → strongest reasoning (Opus 4.7 / GPT‑5.4 Pro / Gemini 3.1 Pro)
Architecture / planning / audits → flagship reasoning (Opus 4.6 / GPT‑5‑Pro / Gemini 3.1 Pro)
Implementation → coding-focused model (Sonnet 4.6 / Codex / Gemini 3.1 Pro)
Bulk tasks → lightweight model (Haiku 4.5 / GPT‑5‑Mini / Gemini 3.1 Flash‑Lite)

This layered approach reduces cost while maintaining quality.

---

# Cost Awareness

Expensive models should be used when:

- reasoning depth is required
- failure is costly
- output quality is critical

Cheaper models should be used when:

- tasks are repetitive
- output is easy to validate
- high throughput is required

**Opus 4.7 cost reality**: same list price as 4.6, but tokenizer inflation + deeper `xhigh` thinking means real-world runs land 20-40% higher. If time saved doesn't justify 3-4x the token cost of a teams configuration, use a single session.

---

# Final Principle

Use the **simplest model that reliably solves the task**.

If a stronger model is required, escalate deliberately rather than by default.
