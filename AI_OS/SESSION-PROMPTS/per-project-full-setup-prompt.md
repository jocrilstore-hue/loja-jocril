# Reusable Per-Project AI_OS Repo Sync Prompt

> Paste into Codex when auditing or safely syncing the AI layer of an existing repository.
> Codex-first. If needed, adapt the tool wording for Claude or another agent without changing the safety rules.
> Date: 2026-04-05

---

## Operator Checklist

Before pasting the prompt into a target repository session:

1. Set the target repository path.
2. Set the master `AI_OS` path.
3. Decide whether `.claude/` sync is in scope.
4. Decide whether this run is `audit-only` or `audit+safe-sync`.
5. Confirm there will be no commit or push.

Recommended defaults:

- `.claude/` sync: only if the target repo actually uses Claude Code
- mode: `audit+safe-sync` for normal maintenance, `audit-only` for sensitive repos or first-pass review

---

## Runtime Inputs

Fill these in before use:

- `TARGET_REPO = C:\path\to\repo`
- `MASTER_AI_OS = C:\Users\maria\Desktop\AI_OS`
- `MASTER_CLAUDE = C:\Users\maria\Desktop\.claude` or `not in scope`
- `MODE = audit-only` or `audit+safe-sync`

---

## The Prompt (copy from here to the end of the file)

You are auditing and adapting the AI layer for one repository using the current master `AI_OS`.

Repository:
`TARGET_REPO`

Master AI_OS:
`MASTER_AI_OS`

Master `.claude/`:
`MASTER_CLAUDE`

Mode:
`MODE`

Objective:
Audit the repository's current AI layer and bring it up to the current standard without breaking project-specific behavior.

Operating rules:
1. Treat this as an AI_OS adaptation, not a replacement.
2. Start with read-only discovery. Do not edit anything until you have inventoried the local AI layer and classified portable versus project-specific material.
3. Read the repo's local `AGENTS.md`, `AI.md`, `AI_OS/`, `.claude/`, and `CLAUDE.md` first if they exist.
4. Preserve all project-specific files and knowledge.
5. Do not overwrite project-specific `CLAUDE.md`, `AGENTS.md`, `AI_DECISION_LOG.md`, dated session handoffs, custom skills, project rules, or repo-specific prompts without explicit justification.
6. Sync only what should come from the master AI_OS.
7. Keep personal Codex-global behavior out of the repo. Do not copy `~/.codex` assumptions, personal trigger phrases, global MCP selections, machine-specific paths, or personal-only skills into project files.
8. Do not copy personal-only skills by default, including `SKILLS/gws-manager/`, `SKILLS/user/`, or any skill tied to Maria-specific accounts, machine paths, or personal infrastructure.
9. Do not do broad docs cleanup unless explicitly requested. Audit docs entry health only where it affects the AI layer.
10. Use minimal scope. No destructive git commands. No commit or push.
11. If updating a project-specific guidance file would require rewriting its local behavior rather than syncing portable template material, stop and ask before making that change.
12. Verify before claiming completion.

Execution phases:

### Phase 1: Inventory the local AI layer

Inspect, at minimum, if present:

- root `AGENTS.md`
- root `AI.md`
- root `CLAUDE.md`
- `AI_OS/`
- `.claude/`
- AI-facing docs entry files such as `docs/DOCS_INDEX.md`, `README.md`, `AI.md`, or equivalent project doc indexes

Summarize:

- what exists
- what is missing
- what appears project-specific
- what appears to be copied from older master AI_OS material

### Phase 2: Compare against current master standard

Compare the repository against:

- `MASTER_AI_OS`
- `MASTER_AI_OS\\references\\AI_OS_CURRENT_STANDARD.md`

Identify:

- files that should be synced from master
- files that should remain project-specific
- duplicated or stale guidance
- Codex parity gaps
- optional `.claude/` drift if `.claude/` is in scope

### Phase 3: Classify what is portable versus preserved

Use these default classifications unless the repo clearly justifies a different choice:

**Portable from master:**
- `AI_OS/AI_OPERATING_SYSTEM.md`
- `AI_OS/CONTEXT_RULES.md`
- `AI_OS/MODEL_SELECTION_GUIDE.md`
- `AI_OS/DOCS_INDEX_TEMPLATE.md`
- `AI_OS/NEW_PROJECT_SETUP.md`
- `AI_OS/references/` portable reference files
- `AI_OS/templates/` portable template files
- `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md`
- `AI_OS/SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md`
- `AI_OS/SESSION-PROMPTS/CODEX-RUNBOOKS/` portable runbooks
- portable shared skills under `AI_OS/SKILLS/`

**Preserve unless explicitly justified:**
- `AI_OS/AI_DECISION_LOG.md`
- `AI_OS/SESSION-PROMPTS/SESSIONS/`
- repo-specific skills
- repo-specific references
- repo-specific session prompts
- root `CLAUDE.md`
- root `AGENTS.md`
- root `AI.md` when it contains real project-local behavior
- project-specific `.claude/rules/`, hooks, or local override files

If the repo has a local `AI_OS/SESSION-PROMPTS/per-project-full-setup-prompt.md` override, treat it as project-specific by default.
If the repo has local runbooks under `AI_OS/SESSION-PROMPTS/CODEX-RUNBOOKS/`, preserve project-specific runbooks unless a file is clearly a portable standard copied from master.

### Phase 4: Apply the safe sync

If `MODE` is `audit-only`, do not edit files. Produce the report only.

If `MODE` is `audit+safe-sync`, do the following:

1. Sync portable AI_OS core files from master.
2. Sync portable files under `AI_OS/references/`, `AI_OS/templates/`, and `AI_OS/SKILLS/` without deleting project-specific files.
3. Sync `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md`, `AI_OS/SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md`, and portable files under `AI_OS/SESSION-PROMPTS/CODEX-RUNBOOKS/`.
4. Sync `.claude/` only if `MASTER_CLAUDE` is in scope and the target repository uses Claude Code.
5. Preserve project-specific rules, handoffs, skills, and root guidance files unless you have explicit justification to change them.

If `.claude/` is in scope, sync only portable structural material:

- `settings.json`
- shared `rules/`
- shared `hooks/`
- `context-essentials.md` only if the repo does not require a project-specific version, or if you can adapt it without erasing local intent

Never overwrite:

- `settings.local.json`
- `CLAUDE.local.md`
- project-specific rules/hooks/local overrides

### Phase 5: Audit root AI entry health

Check and report:

1. `AI.md` boot path and loader behavior
2. `AI.md` verification and 2-strike escalation rule
3. `AGENTS.md` Codex parity: tool-boundary clarity, nearest-wins guidance, JIT index, durable-memory reminder
4. `CLAUDE.md` AI_OS reference health
5. `CLAUDE.md` quick-start presence
6. `CLAUDE.md` anchor pattern, compaction instructions, error-recovery section, and Agent Teams reference
7. Any stale duplication between root guidance and synced AI_OS files

Do not rewrite project-specific root guidance files unless the change is clearly a portable sync and does not erase local behavior.

### Phase 6: Return a concise report

Return exactly these sections:

1. Short inventory summary
2. Sync plan
3. Changes made
4. Remaining issues
5. Verification performed

Within the report:

- list files updated
- list files intentionally preserved
- list remaining drift
- call out any skipped changes that require explicit approval

Verification requirements:

- confirm which files were inspected
- confirm whether edits were made or the run was audit-only
- if files were changed, verify the changed files exist and summarize the diffed result before claiming completion

Do not commit. Do not push.
