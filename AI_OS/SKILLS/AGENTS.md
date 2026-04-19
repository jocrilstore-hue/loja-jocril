# SKILLS/AGENTS.md

## Package Identity

`SKILLS/` contains reusable AI_OS skills plus a small number of user-specific variants.
Each skill is documentation-first: a `SKILL.md` entrypoint plus optional `references/` or `agents/` assets.

## Setup & Run

```bash
find SKILLS -name 'SKILL.md' -print | sort
find SKILLS -path '*/references/*' -type f | sort
find SKILLS -path '*/agents/*' -type f | sort
rg -n "^name:|^description:" SKILLS -g 'SKILL.md'
```

## Patterns & Conventions

- One skill per folder. The entry file is always `SKILL.md`.
- Put reusable deep context in sibling assets instead of bloating `SKILL.md`.
- Keep the front matter stable. `name` and `description` are part of how agents discover and route skills.
- Keep trigger language and workflow scope explicit in the entry file.
- Use `references/` for focused load-on-demand material, as in `SKILLS/design-reviewer/references/quick-checks.md`, `SKILLS/forensic-debug-loop/references/checklists.md`, and `SKILLS/architect-advisor/references/examples.md`.
- Use `agents/` only for tool-specific supporting config, as in `SKILLS/forensic-debug-loop/agents/openai.yaml`.
- Provider-specific skills may stay provider-specific. `SKILLS/my-precious/SKILL.md` is intentionally Claude-oriented; do not rewrite it into a fake generic skill unless the user asks.
- OpenAI/Codex should get their own companion skill when the prompting guidance materially differs. Keep that split explicit instead of forcing one prompt recipe across providers.
- If a user-specific override exists, keep it scoped under `SKILLS/user/`, as in `SKILLS/user/orcamentos-prepare/SKILL.md`. Do not silently merge it back into the shared top-level skill.
- Do not duplicate Maria's global Claude/Codex skills in the template. Project AI_OS skills should add project-specific overrides, examples, and routing facts that complement global `architect-advisor`, `my-precious`, and `my-precious-codex`.

## Portable vs Personal

- Keep cross-project skills that a copied repo can reasonably use: architecture, documentation, debugging, prompt-building, agent-doc generation, and design review.
- Treat personal account or environment skills as opt-in references, not mandatory synced project behavior.
- `SKILLS/gws-manager/` is personal-account infrastructure and should not be treated as a universal project dependency.
- `SKILLS/user/` is explicitly non-portable.
- Historical or domain-specific skills like `orcamentos-prepare` should be copied only when the destination project actually needs them.

## Touch Points / Key Files

- Shared prompt-building skill: `SKILLS/my-precious/SKILL.md`
- Codex/OpenAI prompt-building skill: `SKILLS/my-precious-codex/SKILL.md`
- AI_OS installation/adaptation skill: `SKILLS/ai-os-install-and-adapt/SKILL.md`
- Repo-setup skill: `SKILLS/generate-agents/SKILL.md`
- Documentation-governance skill: `SKILLS/docs-strategy/SKILL.md`
- Debugging workflow skill: `SKILLS/forensic-debug-loop/SKILL.md`
- Example-rich skill: `SKILLS/architect-advisor/references/examples.md`
- User-scoped variant area: `SKILLS/user/`

## JIT Index Hints

```bash
rg -n "^# " SKILLS/*/SKILL.md
rg -n "references/" SKILLS -g 'SKILL.md'
rg -n "Claude|Codex|Gemini|OpenAI" SKILLS
find SKILLS -maxdepth 2 -type f | sort
```

## Common Gotchas & Breakthrough Knowledge

- Relative paths in skill docs are resolved from the skill directory first. If you move a referenced file, update the path in `SKILL.md`.
- Keep multi-tool claims honest. If a workflow only works well in Claude or only in Codex, say so explicitly instead of implying parity.
- Historical duplicates may be intentional. `SKILLS/orcamentos-prepare/SKILL.md` and `SKILLS/user/orcamentos-prepare/SKILL.md` should not be casually deduplicated without understanding the ownership boundary.

## Regression Prevention

- Do not change a skill's trigger description, file paths, or linked assets without checking downstream docs that point to it.
- Preserve provider scoping when it is intentional.
- When moving detailed guidance out of `SKILL.md`, make sure the references remain easy to discover and actually exist.

## Pre-PR Checks

```bash
find SKILLS -name 'SKILL.md' -print | sort
rg -n "^name:|^description:|references/|AI_OS/" SKILLS -g 'SKILL.md'
```
