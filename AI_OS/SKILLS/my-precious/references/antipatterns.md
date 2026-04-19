# Prompt Anti-Patterns & Pathologies

Run this as a pre-delivery checklist before handing any prompt to the user.
Catch these before they reach the model.

---

## Pre-Delivery Checklist

Go through each. If any applies, fix it before delivering.

### 1. Fractal Prompt
**The trap:** Prompt tells Claude to *design instructions for another AI* instead of doing the task directly.
**Red flag phrases:** "Write a prompt for...", "Generate instructions for an AI that...", "Create a system prompt for a model that will..."
**Fix:** Remove the meta layer. Convert into direct task instructions.

| Bad | Good |
|-----|------|
| Write a prompt for an AI that analyzes the dataset | Analyze the dataset. Return: key trends, anomalies, recommendations as JSON |

> Exception: my-precious itself is a legitimate prompt generator. One level of recursion is fine. AI → AI → AI is not.

---

### 2. The "Be Smart" Prompt (Underspecified Task)
**The trap:** Relies on the model to infer what "good" looks like.
**Red flags:** "give useful insights", "improve this", "make it better", "analyze and provide value"
**Fix:** Specify what, how many, what format, what criteria.

---

### 3. Hidden Output Format
**The trap:** Expected structure is not defined.
**Red flag:** "Summarize this", "Explain this", "What do you think?"
**Fix:** Always specify structure. Even "return as prose with 3 paragraphs" is a format.

---

### 4. Context Dump
**The trap:** Large context with unclear objective.
**Red flag:** "Here is a report. What do you think?"
**Fix:** State the decision or action required. What should the model produce from this context?

---

### 5. Over-Constrained Prompt
**The trap:** Conflicting or excessive rigid constraints.
**Red flag:** Instructions that contradict each other, or 10+ specific rules.
**Fix:** Separate hard constraints (must follow) from style preferences (guidance). Fewer rules = more reliable output.

---

### 6. One-Shot Complex Task
**The trap:** Multiple reasoning stages in one prompt.
**Red flag:** "Analyze X, then design Y, then generate Z."
**Fix:** Break into sequential steps. Either chain prompts or use a numbered step structure.

---

### 7. Example-Free Prompt (for classification/extraction tasks)
**The trap:** Classification or extraction task with no examples.
**Fix:** Add at least 1-2 input/output examples. Even one example significantly improves consistency.

---

### 8. Format Drift (JSON without schema)
**The trap:** Asks for JSON but doesn't define the schema.
**Red flag:** "Return JSON with results."
**Fix:** Always include the exact schema. Add "Return JSON only" to prevent prose wrapping.

---

### 9. Role Ambiguity
**The trap:** No audience or expertise level specified.
**Red flag:** "Explain this architecture."
**Fix:** Specify who Claude is speaking to. "Explain to a senior backend engineer" vs "Explain to a non-technical founder" are completely different prompts.

---

### 10. Explicit Chain-of-Thought / Manual Thinking Budgets
**The trap:** "Think step by step" added to a prompt going to a 4.6 or 4.7 model with adaptive thinking. Or setting `budget_tokens` directly on Opus 4.7.
**Fix:** Remove "think step by step" — adaptive thinking handles it automatically and explicit CoT adds verbosity and can interfere. **Opus 4.7 specific:** manual `budget_tokens` is deprecated — use adaptive thinking (`thinking: {type: "adaptive"}`) + the `effort` parameter (`low` / `medium` / `high` / `xhigh` / `max`). Setting `budget_tokens` on 4.7 will error.

---

### 11. Model/Effort Mismatch
**The trap:** Recommending Opus 4.7 @ xhigh for a prompt that Sonnet 4.6 @ medium would handle fine. Or the reverse — Haiku for architectural decisions.
**Red flags:** Model + effort block doesn't mention cost-of-mistakes. Same model picked for every prompt regardless of task difficulty.
**Fix:** Apply the cost-of-mistakes test. If a wrong output is cheap to catch and fix (code review can intercept, easy rollback), use Sonnet 4.6. If a wrong output is expensive (shipped to production, affects architecture, hard to unwind), use Opus. Only reach for Opus 4.7 @ xhigh when `high` has genuinely fallen short — not preemptively.

---

## Iteration Warnings (Pathologies)

These appear when prompts are tweaked over time, not on first write.
Flag these when Xenu says "the prompt stopped working" or "it used to be better."

### Prompt Drift
The prompt gradually changed behavior through edits until it no longer does the original task.
**Symptom:** Output format changed, responses got longer/more conversational, task interpretation shifted.
**Fix:** Return to the original intent. Add a `TASK (DO NOT MODIFY):` anchor for the core instruction. Use structured output schemas — they resist drift.

### Prompt Collapse
The prompt became overly complex through optimization until it performs *worse*.
**Symptom:** Ignored instructions, inconsistent behavior, hallucinated formatting, slow responses.
**Classic pattern:** Elaborate role definition + multiple instruction layers + redundant constraints = worse than a simple direct prompt.
**Fix:** Remove before adding. Attempt to cut the prompt in half. Simple beats sophisticated.

### Prompt Illusion
A wording change appeared to improve results but the improvement was random sampling variation.
**Symptom:** "This new version is better!" but you can't reproduce it consistently.
**Fix:** Test with multiple runs on identical inputs before crediting a change. If it doesn't hold across 3+ runs, it's noise.
