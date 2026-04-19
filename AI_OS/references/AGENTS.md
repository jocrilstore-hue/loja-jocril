# references/AGENTS.md

## Package Identity

`references/` stores load-on-demand reference material for AI_OS.
These files support prompt design, documentation bootstrap, provider quirks, and operational research without being treated as always-loaded rules.

## Setup & Run

```bash
find references -maxdepth 1 -type f | sort
rg -n "^# " references/*.md
rg -n "Claude|Codex|OpenAI|Gemini" references
```

## Patterns & Conventions

- Keep one reference topic per file with an obvious name.
- Reference docs support other canon files; they do not replace `AI_OPERATING_SYSTEM.md`, `CONTEXT_RULES.md`, or a skill entrypoint.
- Cross-model guidance belongs in shared references like `references/advanced-patterns.md`.
- Provider-specific guidance should stay clearly scoped, as in `references/CLAUDE-CODE-INSTRUCTION-FOLLOWING.md`.
- Operational local knowledge belongs here only when it is project-safe and stable enough to reuse, as in `references/PROJECT_DOCS_BOOTSTRAP.md`. Do not copy personal account maps into this repo.
- If a local reference is explicitly named as the source of truth, use it before web research. `references/agent-teams-reference.md` is the current example.

## Touch Points / Key Files

- Cross-model prompt patterns: `references/advanced-patterns.md`
- Claude Code behavior notes: `references/CLAUDE-CODE-INSTRUCTION-FOLLOWING.md`
- Docs bootstrap reference: `references/PROJECT_DOCS_BOOTSTRAP.md`
- Local Claude Agent Teams reference: `references/agent-teams-reference.md`
- Prompt failure references: `references/prompt-antipatterns.md`, `references/prompt-pathologies.md`, `references/fractal-prompt-antipattern.md`

## JIT Index Hints

```bash
rg -n "OpenAI Patterns|Claude Patterns|Gemini" references/advanced-patterns.md
rg -n "Agent Teams|TeammateTool" references/agent-teams-reference.md
rg -n "bootstrap|docs" references/PROJECT_DOCS_BOOTSTRAP.md
```

## Common Gotchas & Breakthrough Knowledge

- Do not silently promote a reference into a normative rule. If a pattern becomes policy, update the canonical doc that owns the policy.
- Some references are intentionally local and should not be "verified" against the public web before use.
- Keep provider boundaries crisp. Adding Codex guidance does not mean erasing Claude-only material.

## Regression Prevention

- Preserve filenames that are already referenced from root docs and skills.
- If you split or rename a reference, update every inbound link in skills, setup docs, and canonical AI_OS files.
- Keep references concise enough to load selectively.

## Pre-PR Checks

```bash
find references -maxdepth 1 -type f | sort
rg -n "references/" AI_OPERATING_SYSTEM.md CONTEXT_RULES.md NEW_PROJECT_SETUP.md SKILLS SESSION-PROMPTS -g '*.md'
```
