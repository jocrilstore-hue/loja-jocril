# Coding Discipline Checkpoint

Use this reference when writing Codex/OpenAI prompts for implementation, refactoring, debugging, or code review follow-up work.

This is a Codex-native adaptation of the useful ideas from `forrestchang/andrej-karpathy-skills`. Do not copy Claude plugin metadata, install the upstream Claude skill, or paste long examples into the prompt.

## Four Prompt Requirements

### 1. Surface Assumptions

The prompt should tell the executing agent to name assumptions that affect the result. If multiple plausible interpretations would lead to different code, it should ask or choose the smallest reversible path and state that choice.

### 2. Prefer Simplicity

The prompt should forbid speculative flexibility:

- no features beyond the request
- no abstraction for one use
- no configurable framework where a small direct change solves the current task
- no broad rewrite to make the surrounding code "nicer"

### 3. Keep Changes Surgical

The prompt should require the agent to:

- read the relevant local code before editing
- match existing style
- touch only files needed for the requested behavior
- avoid drive-by formatting, comment rewrites, renames, or adjacent refactors
- remove only dead imports, variables, functions, or tests made obsolete by its own change

### 4. Make Success Verifiable

The prompt should convert vague imperatives into concrete goals:

- bugfix: reproduce the bug or explain why reproduction is blocked, then verify the fix
- refactor: preserve behavior and run before/after-appropriate checks
- feature: define the observable behavior and the lightest credible test or manual check

Use the skill's verification labels in the final report: `repo-standard verified`, `partial verification`, or `unverified`.

## Prompt Insert Template

```markdown
# Coding Discipline
- Surface material assumptions before editing. Ask if ambiguity would materially change the outcome; otherwise choose the smallest reversible path and state it.
- Prefer the smallest direct implementation. Do not add speculative features, abstractions, options, or framework changes.
- Keep edits surgical: touch only files needed for this request, match local style, and avoid drive-by cleanup or formatting.
- Clean up only unused code introduced or orphaned by your own change.
- Define concrete success criteria before claiming completion, then verify with the lightest credible repo-standard check.
```
