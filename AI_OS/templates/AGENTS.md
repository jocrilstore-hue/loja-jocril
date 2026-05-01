# templates/AGENTS.md

## Package Identity

`templates/` contains starter files copied into downstream project roots.
These files define the smallest repo-entry surface for AI tools without dragging the whole master template into the project root.

## Setup & Run

```bash
find templates -maxdepth 1 -type f | sort
sed -n '1,160p' templates/AI.md
sed -n '1,160p' templates/CLAUDE_MD_SNIPPET.md
```

## Patterns & Conventions

- Keep templates lean and project-agnostic.
- `templates/AI.md` is the universal project entrypoint for any AI agent working in a downstream repo.
- `templates/CLAUDE_MD_SNIPPET.md` is intentionally Claude-specific. It should remain a small pointer into `AI_OS/`, not a generic all-tools policy file.
- Put cross-tool operating guidance in `AI.md` or root `AGENTS.md`, not inside the Claude snippet.
- Do not hardcode project-specific names, build commands, or folder layouts here beyond the stable `AI_OS/` paths.
- When adding Codex compatibility, make the generic template better without weakening the Claude-specific template.
- New project templates should include light git expectations only: do not work on `main` for substantial work, prefer branches, verify before commit/PR, and preserve user changes.
- Do not copy Maria's full personal git workflow layer into downstream projects. That belongs in global Codex config, not in repo templates.

## Touch Points / Key Files

- Universal loader template: `templates/AI.md`
- `AI_OS/MEMORY_INDEX.md` - ranked memory map for hot work, proven solutions, failed approaches, and regression risks
- Claude pointer snippet: `templates/CLAUDE_MD_SNIPPET.md`
- Setup instructions that reference these files: `NEW_PROJECT_SETUP.md`

## JIT Index Hints

```bash
rg -n "AI_OS|AGENTS.md|CLAUDE.md|Codex|Claude" templates
rg -n "COPY FROM HERE|COPY TO HERE" templates/CLAUDE_MD_SNIPPET.md
```

## Common Gotchas & Breakthrough Knowledge

- Do not turn `templates/CLAUDE_MD_SNIPPET.md` into a second `AI.md`. Its job is only to connect Claude Code projects back to AI_OS.
- If a downstream project needs Codex-specific detail, prefer adding or generating `AGENTS.md` there instead of overloading the Claude snippet.
- Template changes ripple into every future project setup, so small wording changes have large downstream impact.

## Regression Prevention

- Keep `AI.md` and `CLAUDE_MD_SNIPPET.md` clearly separated by responsibility.
- If a template changes, verify `NEW_PROJECT_SETUP.md` still tells the user to copy or edit the correct file.
- Do not introduce project-specific assumptions into a master template.

## Pre-PR Checks

```bash
find templates -maxdepth 1 -type f | sort
rg -n "AI.md|CLAUDE.md|AGENTS.md" NEW_PROJECT_SETUP.md DOCS_INDEX_TEMPLATE.md templates
```
