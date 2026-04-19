# Advanced Claude Patterns

Reference for complex prompt scenarios. Load when building agentic systems, tool integrations, or enterprise prompts.

## System Prompt Template (Production)

Complete template for production system prompts:

```
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

## Claude Code CLAUDE.md Template

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
- `TEMP/` — Working files (use for intermediate outputs)

## Code Conventions
- [Language/framework patterns]
- [Naming conventions]
- [Import organization]

## Database
- [Schema overview or link to schema file]
- [Key relationships]
- [Migration patterns]

## Working Process
1. Read relevant code before making changes
2. Write a plan with checkboxes before executing
3. Make minimal, surgical changes
4. Test after each significant change
5. Document changes in plan file

## Commands
Use `/` commands for common workflows:
- `/fix-issue` — Debug and fix issues
- `/review` — Code review checklist
- `/test` — Generate tests for code
```

## Tool Definition Pattern

When defining tools for Claude:

```json
{
  "name": "tool_name",
  "description": "Clear, specific description of what the tool does and when to use it",
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
- State what the tool does AND when to use it
- Include example invocations in description if complex
- Specify error conditions and how to handle them

## Multi-Document Analysis

For analyzing multiple documents with citations:

```
<documents>
{% for doc in documents %}
<document index="{{ loop.index }}">
<source>{{ doc.filename }}</source>
<document_content>
{{ doc.content }}
</document_content>
</document>
{% endfor %}
</documents>

<instructions>
Analyze the documents above to answer the question.

Process:
1. First, extract relevant quotes from each document
2. Wrap quotes in <quote doc="[index]">[exact text]</quote> tags
3. Synthesize findings across documents
4. Provide answer with inline citations

If information is not in the documents, say so explicitly.
</instructions>

<question>
{{ user_question }}
</question>
```

## Structured JSON Output

Force reliable JSON with prefill and explicit schema:

System prompt:
```
You output valid JSON only. No markdown, no explanation, no preamble.
```

User prompt:
```
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

Assistant prefill:
```
{
```

## Conversation Memory Pattern

For long-running conversations needing state:

```
<conversation_state>
<key_facts>
- User name: [name]
- Project: [project name]
- Previous decisions: [list]
</key_facts>
<current_context>
[What we're working on now]
</current_context>
<pending_items>
- [Item 1]
- [Item 2]
</pending_items>
</conversation_state>

<instructions>
Continue the conversation using the state above.
Update your understanding as new information emerges.
Reference previous decisions when relevant.
</instructions>
```

## Error Recovery Pattern

For robust handling of failures:

```
<error_handling>
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
</error_handling>
```

## Prompt Chaining Pattern

For multi-step workflows:

**Step 1 prompt:**
```
<task>Analyze the problem and identify key components</task>
<output_format>
{
  "problem_summary": "",
  "key_components": [],
  "dependencies": [],
  "recommended_approach": ""
}
</output_format>
```

**Step 2 prompt (uses Step 1 output):**
```
<previous_analysis>
{{ step1_output }}
</previous_analysis>

<task>
Based on the analysis above, implement the recommended approach.
Focus on {{ step1_output.key_components[0] }} first.
</task>
```

## Calibrated Confidence Pattern

For tasks requiring uncertainty acknowledgment:

```
<instructions>
Provide your response with calibrated confidence.

Use these confidence markers:
- HIGH: Well-established, multiple sources agree, low ambiguity
- MEDIUM: Generally accepted but with some uncertainty
- LOW: Limited information, speculation, or conflicting sources
- UNKNOWN: Cannot determine from available information

Format each claim as:
[CONFIDENCE] Claim text

When confidence is LOW or UNKNOWN, explain why and what additional information would help.
</instructions>
```

## Rate-Limited Retry Pattern

For API integrations with backoff:

```
<retry_policy>
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
</retry_policy>
```

## Context Window Management

For long sessions approaching context limits:

```
<context_management>
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
</context_management>
```
