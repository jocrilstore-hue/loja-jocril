# Advanced Patterns

Reference for complex prompt scenarios across model families. Load when building agentic systems, tool integrations, or production prompts.

---

# OpenAI Patterns

## System Prompt Template (Production)

```
# Role
You are [role] with expertise in [domains].
Your communication style is [tone characteristics].

# Capabilities
You can:
- [Capability 1]
- [Capability 2]
You cannot:
- [Limitation 1]
- [Limitation 2]

# Context
[Business rules, domain knowledge, reference material]

# Instructions
[Core task definition]
[Step-by-step process if applicable]

# Output Requirements
Format: [Exact format specification]
Length: [Constraints]
Style: [Tone, voice, complexity level]

# Guardrails
- [Safety rule 1]
- [Forbidden behavior 1]
- [Edge case handling]

# Examples
[2-3 representative input/output pairs]
```

## Structured JSON Output (OpenAI)

System prompt:
```
You output valid JSON only. No markdown, no explanation, no preamble.
```

User prompt:
```
Schema:
{
  "analysis": "string - your analysis",
  "confidence": "number 0-1",
  "recommendations": ["array of strings"]
}

Task:
[Task description]

Respond with JSON matching the schema exactly.
```

---

# Claude Patterns

## System Prompt Template (Production)

Claude performs best with XML tag structure for clear section separation.

```xml
<identity>
You are [role] with expertise in [domains].
Your communication style is [tone characteristics].
</identity>

<capabilities>
You can:
- [Capability 1]
- [Capability 2]
You cannot:
- [Limitation 1]
- [Limitation 2]
</capabilities>

<context>
[Business rules, domain knowledge, reference material]
</context>

<instructions>
[Core task definition]
[Step-by-step process if applicable]
</instructions>

<output_requirements>
Format: [Exact format specification]
Length: [Constraints]
Style: [Tone, voice, complexity level]
</output_requirements>

<guardrails>
- [Safety rule 1]
- [Forbidden behavior 1]
- [Edge case handling]
</guardrails>

<examples>
[2-3 representative input/output pairs]
</examples>
```

Key differences from OpenAI:
- XML tags instead of markdown headers for section boundaries.
- Claude parses XML tags as structural separators, reducing section bleed.
- Place large context blocks before instructions — Claude processes sequentially.

---

## Claude Code — CLAUDE.md Template

For project-level Claude Code configuration:

```markdown
# Project: [Name]

## Overview
[One paragraph describing the project, tech stack, key patterns]

## Critical Rules
- **NEVER** [dangerous action]
- **ALWAYS** [required behavior]
- [Other non-negotiable rules]

## File Organization
- `src/` — Application code
- `tests/` — Test files
- `docs/` — Documentation

## Code Conventions
- [Language/framework patterns]
- [Naming conventions]
- [Import organization]

## Working Process
1. Read relevant code before making changes
2. Write a plan with checkboxes before executing
3. Make minimal, surgical changes
4. Test after each significant change

## Commands
- `/fix-issue` — Debug and fix issues
- `/review` — Code review checklist
- `/test` — Generate tests for code
```

---

## Claude — Structured JSON Output

Force reliable JSON with prefill and explicit schema.

System prompt:
```
You output valid JSON only. No markdown, no explanation, no preamble.
```

User prompt:
```xml
<schema>
{
  "analysis": "string - your analysis",
  "confidence": "number 0-1",
  "recommendations": ["array of strings"]
}
</schema>

<task>
[Task description]
</task>

Respond with JSON matching the schema exactly.
```

Assistant prefill (API only):
```
{
```

The prefill technique forces Claude to continue from the opening brace, preventing preamble.

---

## Claude — Thinking Modes

Claude 4.6 models support thinking modes that control reasoning depth:

Default — standard reasoning, sufficient for most tasks.
Adaptive — model decides how deeply to reason based on task complexity.

When to use adaptive:
- multi-file audits where missing something is costly
- adversarial review (finding what breaks)
- complex debugging with state tracking
- architectural judgment calls

When default is fine:
- clear implementation tasks with defined spec
- refactoring with known patterns
- test writing
- straightforward transformations

---

## Claude — Anti-Laziness Patterns

Claude Code agents can skip work on large tasks. Prevent this with explicit constraints:

```xml
<constraints>
- DO NOT skip files — open every one mentioned in the instructions
- DO NOT assume file contents — read actual code before making claims
- Report exact file paths and line numbers for every finding
- If you find something unexpected, stop and report it before continuing
- Complete ALL steps — do not summarize or abbreviate any step
</constraints>
```

These clauses measurably improve thoroughness on audit and review tasks.

---

## Claude — Multi-Document Analysis

```xml
<documents>
[Include all documents with clear labeling]
</documents>

<instructions>
Analyze the documents above to answer the question.

Process:
1. Extract relevant evidence from each document
2. Note which document each finding comes from
3. Synthesize findings across documents
4. Provide answer with source references

If information is not in the documents, say so explicitly.
Do not invent information.
</instructions>

<question>
[User question]
</question>
```

---

# Gemini Patterns

## System Prompt Template (Production)

Gemini works well with clear markdown headers and explicit formatting directives.

```
## Role
You are [role] with expertise in [domains].

## Context
[Business rules, domain knowledge, reference material]

## Instructions
[Core task definition]
[Step-by-step process]

## Output Format
Format: [specification]
Length: [constraints]

Return ONLY the requested format. No preamble, no explanation outside the format.

## Examples
[2-3 representative input/output pairs]
```

Key notes:
- Gemini supports very large context windows — use for full-document or full-codebase analysis.
- Be explicit about output boundaries; Gemini can be verbose without clear constraints.
- For JSON output, always include: "Return ONLY valid JSON. No markdown fences. No explanation."

---

# Cross-Model Patterns

These patterns work across all model families with minor syntax adjustments.

## Tool Definition Pattern

```json
{
  "name": "tool_name",
  "description": "Clear description of what the tool does and when to use it",
  "input_schema": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "What this parameter represents and valid values"
      },
      "param2": {
        "type": "integer",
        "description": "Purpose and constraints"
      }
    },
    "required": ["param1"]
  }
}
```

Tool description best practices:
- State what the tool does AND when to use it.
- Include example invocations if complex.
- Specify error conditions and how to handle them.

---

## Prompt Chaining Pattern

For multi-step workflows across any model:

Step 1 prompt:
```
Task: Analyze the problem and identify key components.

Output format:
{
  "problem_summary": "",
  "key_components": [],
  "dependencies": [],
  "recommended_approach": ""
}
```

Step 2 prompt (uses Step 1 output):
```
Previous analysis:
[step 1 output]

Task:
Based on the analysis above, implement the recommended approach.
Focus on [key_components[0]] first.
```

This pattern works identically across providers. Adjust syntax (XML for Claude, markdown for others) but keep the chaining logic the same.

---

## Conversation Memory Pattern

For long-running conversations needing state:

```
Key facts:
- User name: [name]
- Project: [project name]
- Previous decisions: [list]

Current context:
[What we're working on now]

Pending items:
- [Item 1]
- [Item 2]

Continue the conversation using the state above.
Reference previous decisions when relevant.
```

---

## Error Recovery Pattern

```
When encountering errors:
1. Identify the error type (validation, execution, external)
2. Attempt recovery if possible
3. If recovery fails, explain:
   - What went wrong
   - Why it happened
   - What the user can do
4. Never silently fail or make assumptions

Common errors:
- Missing input: Ask user for required information
- Invalid format: Show expected format with example
- External failure: Explain limitation and alternatives
```

---

## Calibrated Confidence Pattern

```
Provide your response with calibrated confidence.

Use these markers:
- HIGH: Well-established, multiple sources agree
- MEDIUM: Generally accepted but with some uncertainty
- LOW: Limited information or conflicting sources
- UNKNOWN: Cannot determine from available information

Format each claim as:
[CONFIDENCE] Claim text

When confidence is LOW or UNKNOWN, explain why.
```

---

## Context Window Management

For long sessions approaching context limits:

```
As context grows:
1. Prioritize recent and relevant information
2. Summarize older exchanges rather than including verbatim
3. Keep critical facts in a running state block
4. When approaching limits, proactively offer to summarize

Critical information to always preserve:
- User preferences and constraints
- Key decisions made
- Current task state
- Unresolved items
```

---

# Rate-Limited Retry Pattern

For API integrations with backoff:

```
When API calls fail:
1. Transient errors (429, 503): Retry with exponential backoff
   - First retry: 1 second
   - Second retry: 2 seconds
   - Third retry: 4 seconds
   - Max retries: 3
2. Client errors (400, 401, 403): Do not retry, report issue
3. Server errors (500, 502): Retry once after 5 seconds
4. Timeout: Retry once with longer timeout

After max retries exhausted, report failure with:
- Error type
- Number of attempts
- Last error message
```
