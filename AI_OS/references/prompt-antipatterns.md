# Prompt Anti-Patterns

Reference guide for common prompt design mistakes.

Use this document when designing or evaluating prompts.
The goal is to **identify weaknesses before prompts reach the model**.

Each anti-pattern includes:
- description
- example of the problem
- why it fails
- corrected version

---

# 1. The “Be Smart” Prompt

## Problem
The prompt relies on the model to infer the task.

Example:
Analyze this data and give useful insights.

## Why it fails
The model must guess:
- what counts as insight
- how many insights
- what format to use
- what criteria matter

Different runs may produce different outputs.

## Better Prompt
Analyze the dataset and return:
- Top 5 trends
- 3 anomalies
- 3 actionable recommendations

Return the result as JSON:
{
  "trends": [],
  "anomalies": [],
  "recommendations": []
}

Detection rule: prompts containing vague terms like “insights”, “improve”, or “better” are usually underspecified.

---

# 2. Context Dump

## Problem
Large context with unclear objective.

Example:
Here is a report. What do you think?

## Why it fails
The model does not know:
- what to evaluate
- what decision is required
- what type of response is expected

## Better Prompt
Using the report above identify:
1. Key risks
2. Strategic opportunities
3. Recommended next actions

Provide a concise executive summary.

---

# 3. Hidden Output Format

## Problem
The expected output format is not specified.

Example:
Summarize this document.

## Why it fails
The model must guess the structure.

## Better Prompt
Return the summary in this structure:

Key Ideas
- bullet points

Important Data
- bullet points

Implications
- bullet points

---

# 4. Over‑Constrained Prompt

## Problem
Too many rigid or conflicting constraints.

Example:
Write a creative story with exactly 4 paragraphs, each exactly 75 words,
include exactly 2 metaphors, avoid emotional language, but make it emotional.

## Why it fails
Conflicting instructions reduce quality.

## Better Prompt
Separate hard constraints from style preferences.

Hard constraints:
- 4 paragraphs

Style preferences:
- reflective tone
- descriptive imagery

---

# 5. One‑Shot Complex Task

## Problem
Multiple reasoning steps compressed into one prompt.

Example:
Analyze this dataset, design a strategy, and generate a report.

## Why it fails
The model must perform several reasoning stages simultaneously.

## Better Prompt
Step 1: Analyze the dataset
Step 2: Identify patterns
Step 3: Propose strategy
Step 4: Generate report

---

# 6. Example‑Free Prompt

## Problem
A task is defined but no examples are provided.

Example:
Classify these messages as positive or negative.

## Why it fails
Models perform significantly better with examples.

## Better Prompt
Example:
Input: "This product is amazing"
Output: Positive

Input: "The delivery was terrible"
Output: Negative

---

# 7. Format Drift

## Problem
Prompt asks for JSON but does not enforce schema.

Example:
Return JSON with results.

## Why it fails
Models often include explanations around JSON.

## Better Prompt
Return JSON only.

Schema:
{
 "summary": "string",
 "confidence": "number"
}

---

# 8. Role Ambiguity

## Problem
The audience or role is not specified.

Example:
Explain this architecture.

## Why it fails
The explanation changes drastically depending on audience.

## Better Prompt
Explain the architecture to a senior backend engineer.

---

# 9. Unbounded Task

## Problem
The task scope is undefined.

Example:
Generate marketing ideas.

## Why it fails
Infinite scope leads to inconsistent results.

## Better Prompt
Generate 10 marketing ideas for a SaaS analytics product targeting startups.

---

# 10. Explicit Chain‑of‑Thought Prompt

## Problem
Prompt explicitly requests internal reasoning.

Example:
Think step by step.

## Why it fails
Modern reasoning models already reason internally. Explicit chain‑of‑thought can increase verbosity and leak reasoning.

## Better Prompt
Provide:
- key assumptions
- conclusion
- confidence level

---

# Meta Principle

Prompt engineering is not about making the model smarter.

It is about **removing ambiguity from the prompt**.

Good prompts clarify:
- task
- context
- format
- constraints
