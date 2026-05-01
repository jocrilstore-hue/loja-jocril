# SKILLS/AGENTS.md

## Package Identity

`SKILLS/` is no longer the home for mirrored global skills.

Keep only:

- this `AGENTS.md`
- project-specific skill overrides that cannot live in a tool-native global skill system
- local skills that encode facts, fixtures, or workflows unique to this repository

## Rules

- Prefer Codex global skills in `~/.codex/skills` for Codex workflows.
- Prefer Claude-native skills or commands for Claude workflows.
- Do not copy generic skills such as `architect-advisor`, `docs-strategy`, `generate-agents`, `my-precious`, `my-precious-codex`, `forensic-debug-loop`, or `design-reviewer` into this folder.
- Do not copy personal infrastructure skills such as `gws-manager` into project templates.
- If a local skill is needed, keep it compact: `SKILL.md` plus optional `references/`, `scripts/`, `assets/`, or `agents/`.
- If a local skill becomes generally useful, migrate it to the relevant global skill system and leave only a short project pointer here if needed.

## Checks

```bash
find SKILLS -mindepth 1 -maxdepth 2 -type f | sort
find SKILLS -mindepth 1 -maxdepth 1 -type d | sort
```

Any directory listed under `SKILLS/` should have a project-specific reason to exist.
