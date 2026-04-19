# New Project Setup — AI_OS

How to set up the AI Operating System in a new project.

> **⚠️ ADAPT, DON'T REPLACE.** This is a template to be adapted per project — not a wholesale overwrite. Merge it into the existing project structure. Preserve everything project-specific. When syncing an existing project, follow `SESSION-PROMPTS/per-project-full-setup-prompt.md` exactly.

> **Reference:** Compare against `AI_OS/references/AI_OS_CURRENT_STANDARD.md` to verify completeness.
> **Migrating an existing project?** Use `AI_OS/SESSION-PROMPTS/ai-os-migration-audit.md` instead.

---

## Prerequisite: Global Claude Code Config

Before setting up any project, ensure the global Claude Code configuration exists at `~/.claude/`:

| File | Purpose | Must exist |
|---|---|---|
| `~/.claude/CLAUDE.md` | Global behavioral rules (no freelancing, confirm before coding, minimal scope, ask-don't-guess). Applied to ALL sessions automatically. | **Yes** |
| `~/.claude/rules/scope-discipline.md` | Scope enforcement rule — prevents feature creep and unrequested changes. | **Yes** |
| `~/.claude/rules/verification.md` | No completion claims without proof. | **Yes** |
| `~/.claude/rules/git-safety.md` | Destructive git operation prevention. | **Yes** |
| `~/.claude/rules/regression-prevention.md` | Verify existing functionality before/after changes. | **Yes** |
| `~/.claude/rules/documentation.md` | DOCS_INDEX governance. | **Yes** |
| `~/.claude/settings.json` | Global hooks (git blocker, post-compact, notifications) + deny list. | **Yes** |

**Do NOT duplicate global behavioral rules in project CLAUDE.md.** Project CLAUDE.md is for project-specific knowledge only: domain glossary, build commands, schema notes.

## Prerequisite: Global Codex Config

Before relying on Codex across projects, ensure the active Codex home is configured correctly:

| File | Purpose | Must exist |
|---|---|---|
| `CODEX_HOME/AGENTS.md` or `~/.codex/AGENTS.md` | Global Codex guidance loaded before project rules. Keep it short and cross-project. | **Yes** |
| `CODEX_HOME/config.toml` or `~/.codex/config.toml` | Model, approvals, plugins, and `project_doc_fallback_filenames` | **Yes** |

Recommended minimums:

- Keep the global Codex `AGENTS.md` concise and tool-neutral.
- If you want Codex to discover root `AI.md` files when `AGENTS.md` is absent, set:

```toml
project_doc_fallback_filenames = ["AI.md"]
```

- Treat `AGENTS.md` as the primary Codex instruction surface. `AI.md` is a universal loader and fallback, not the main Codex entrypoint.
- Keep personal Codex behavior in `~/.codex`, not in the copied project AI_OS. Examples: personal trigger phrases, machine-specific tool paths, personal MCP selections, and globally installed skills.

### Windows / WSL recommendation for Codex

Official Codex guidance currently says:

- If using the **Windows-native Codex agent**, prefer storing projects on the **Windows filesystem** and access them from WSL via `/mnt/c/...`
- Switch the Codex agent to **WSL** only if you want Linux-native execution to be the default

This means your current pattern can stay valid: keep the master AI_OS on `C:\Users\maria\Desktop\AI_OS` and access projects from WSL when needed.

---

## Step 1: Copy AI_OS folder

Copy the entire `AI_OS/` folder into your project root.

```
your-project/
  AI_OS/          ← copy here
  src/
  ...
```

Do NOT copy the `templates/` folder — those are setup files, not runtime files.

---

## Step 2: Create project root AI.md

Copy `AI_OS/templates/AI.md` to your project root:

```
your-project/
  AI.md           ← copy here
  AI_OS/
  src/
  ...
```

No modifications needed — it's generic.

If the project already has a root `AGENTS.md`, keep `AI.md` lean and let `AGENTS.md` carry repo-local operational guidance for Codex and other coding agents.

If the project may be opened in Codex before `AGENTS.md` exists, the global Codex fallback above lets `AI.md` remain discoverable.

Do not paste your personal `~/.codex/AGENTS.md` content into the project `AI.md` or project `AGENTS.md`. Only project-specific overrides should travel with the repo.

If the project will use Codex or multiple coding agents, also create a root `AGENTS.md` that carries repo-local operational guidance only. Keep the git guidance light and portable:

- substantial work should happen on a branch, not `main`
- verify before claiming a commit/PR is ready
- preserve user changes
- do not encode Maria's personal git workflow or machine-specific git habits into the repo

---

## Step 3: Set up `.claude/` structural files

If the project uses Claude Code, create the following structure:

```
.claude/
  settings.json          ← allow/deny lists + hooks (see Step 3a)
  context-essentials.md  ← post-compaction critical rules (see Step 3b)
  CLAUDE.local.md        ← personal overrides (create empty, gitignored)
  rules/                 ← path-scoped behavioral rules (auto-loaded)
    git-safety.md
    regression-prevention.md
    escalation.md            ← must use 2-strike rule
    documentation.md
    session-handoff.md
    verification.md
    documentation-routing.md
    ai-os-reference.md
    architecture.md
    breakthroughs.md
  hooks/                 ← quality gate scripts (see Step 3c)
    post-edit-check.sh      ← auto-typecheck for TS/TSX projects
  commands/              ← custom slash commands
    handoff.md
    status.md
    decision.md
    sync-check.md
```

The `sync-to-project` scripts handle copying from master.

### Step 3a: Configure settings.json hooks

Project `settings.json` includes auto-test hooks. The template at `Desktop/.claude/settings.json` provides a PostToolUse hook that auto-runs `tsc --noEmit` after editing TS/TSX files (only fires when `tsconfig.json` exists, safe for non-TS projects).

For projects needing a more robust hook script:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/post-edit-check.sh"
          }
        ]
      }
    ]
  }
}
```

Global hooks (in `~/.claude/settings.json`) provide:
- **PreToolUse (Bash):** Destructive git operation blocker
- **PostToolUse (compact):** Re-injects context-essentials.md after compaction
- **Notification:** Windows popup when Claude needs attention

### Step 3b: Create context-essentials.md

This file is read automatically by the PostCompact global hook after context compaction (lossy summarization). Include only crash-level rules — ~25 lines max.

Template:

```markdown
# POST-COMPACTION ESSENTIALS — [PROJECT NAME]

You just went through context compaction. Re-read these before continuing:

## Crash-Level Rules
1. [Most critical project rule]
2. [Second most critical rule]
3. [Third rule]

## Error Recovery
- 2-strike rule: stop after 2 failed fix attempts, report status
- Never let the fix be worse than the disease

## Key Files
- `docs/DOCS_INDEX.md` — documentation map
- `docs/ARCHITECTURE.md` — current system state
- [Other critical project-specific files]

## Current Session
- Re-read the active plan/task before resuming work
```

Adapt the content per project. Keep it short — this is injected into every post-compaction context.

### Step 3c: Create hooks

For TypeScript projects, create `.claude/hooks/post-edit-check.sh`:

```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')
if [[ "$FILE_PATH" == */src/*.ts ]] || [[ "$FILE_PATH" == */src/*.tsx ]]; then
  RESULT=$(npx tsc --noEmit 2>&1)
  EXIT_CODE=$?
  if [ $EXIT_CODE -ne 0 ]; then
    echo "TypeScript errors detected after editing $FILE_PATH:" >&2
    echo "$RESULT" | head -20 >&2
    exit 2  # exit 2 = blocking, Claude must fix before continuing
  fi
fi
exit 0
```

Adapt for other stacks (Python: ruff/mypy, Go: go vet, etc.).

---

## Step 4: Add AI_OS sections to CLAUDE.md

Open your project's `CLAUDE.md` and add the sections from:

`AI_OS/templates/CLAUDE_MD_SNIPPET.md`

Copy everything between the `COPY FROM HERE` and `COPY TO HERE` markers.

**Important:** The snippet now includes a **Domain Glossary** section. This MUST be filled in per project — it maps user-facing terms (PO number, FO, código, etc.) to exact DB columns. This prevents the single most common class of errors: Claude operating on the wrong field.

**Critical: CLAUDE.md must follow the anchor pattern:**

1. **Lines 1-5 (anchor top):** Your 3 most-violated rules. These exploit primacy bias — the model weighs early lines heavily.
2. **Body:** All standard sections (quick start, rules, AI_OS reference, domain glossary, build commands, agent teams, error recovery, compaction instructions).
3. **Last lines (anchor bottom):** Same 3 rules repeated. Exploits recency bias — the model also weighs recent context heavily.

If the project doesn't have a CLAUDE.md yet, create one and include:
- Anchor top (3 critical rules)
- Project-specific quick start (build, test, run commands)
- The AI_OS snippet sections (including filled-in Domain Glossary)
- Any project-specific rules
- Anchor bottom (same 3 rules)

**Remember:** Behavioral rules (no freelancing, minimal scope, etc.) are in the global `~/.claude/CLAUDE.md`. Do NOT duplicate them here. Project CLAUDE.md is for project-specific knowledge only.

## Step 5: Add gitignore entries

Add these to your project's `.gitignore`:

```
CLAUDE.local.md
settings.local.json
```

These are personal override files that should not be committed.

---

## Step 6: Initialize docs structure (optional)

If the project is mature enough for documentation, follow:

`AI_OS/references/PROJECT_DOCS_BOOTSTRAP.md`

Minimum viable docs:
1. `docs/DOCS_INDEX.md` (use `AI_OS/DOCS_INDEX_TEMPLATE.md` as base) — must include temperature classification (HOT/WARM/Temporary/COLD)
2. `docs/ARCHITECTURE.md`
3. `docs/SETUP.md`

Only create more when justified — see `AI_OS/SKILLS/docs-strategy/SKILL.md`.

---

## Step 7: Generate AGENTS.md (recommended for Codex / multi-agent repos)

When the codebase is stable enough, generate the AGENTS.md hierarchy using:

`AI_OS/SKILLS/generate-agents/SKILL.md`

Do this AFTER docs structure is in place — AGENTS generation is downstream of docs strategy.

Guideline:
- `AI.md` = tiny universal loader
- `AGENTS.md` = repo-local operational guidance for Codex, Claude, and other coding agents
- `CLAUDE.md` = Claude Code specific behavior and quick start

Do not try to make `CLAUDE.md` serve as the Codex entrypoint. Keep the boundaries clear.
Codex reads `AGENTS.md` natively; `AI.md` only helps Codex when configured as a fallback filename.

---

## Step 8: Clear the SESSIONS folder

The `AI_OS/SESSION-PROMPTS/SESSIONS/` folder may contain handoffs from the master copy. Clear it for a fresh project:

```
Delete contents of: AI_OS/SESSION-PROMPTS/SESSIONS/*
```

Keep the folder itself — sessions will be created as you work.

---

## Step 9: Review AI_DECISION_LOG.md

The decision log may have entries from other projects. For a new project:
- Keep the template/example entries
- Remove project-specific entries that don't apply
- Add your first entry when you make your first architectural decision

---

## Step 10: Health check

Run through the `AI_OS/references/AI_OS_CURRENT_STANDARD.md` checklist to verify your setup is complete. Pay special attention to:

- [ ] **Global `~/.claude/CLAUDE.md` exists** with behavioral guardrails (no freelancing, confirm before coding, minimal scope, ask-don't-guess)
- [ ] **Global `~/.claude/rules/scope-discipline.md` exists** (scope enforcement)
- [ ] **Global `CODEX_HOME/AGENTS.md` exists** and is non-empty
- [ ] **Global `CODEX_HOME/config.toml` exists**
- [ ] `project_doc_fallback_filenames = ["AI.md"]` is set if you rely on `AI.md` in Codex
- [ ] `context-essentials.md` exists and is project-adapted
- [ ] `escalation.md` uses 2-strike rule (not 3-strike)
- [ ] CLAUDE.md has anchor pattern (top + bottom)
- [ ] CLAUDE.md has **Domain Glossary** section filled in with project-specific field mappings
- [ ] CLAUDE.md has Agent Teams, Error Recovery, and Compaction Instructions sections
- [ ] Auto-test hooks are configured for the project's stack
- [ ] PostCompact global hook is configured in `~/.claude/settings.json`

---

## What Each File Does (Quick Reference)

### Global (apply to all projects automatically)

| File | Purpose |
|---|---|
| `~/.claude/CLAUDE.md` | Global behavioral rules: no freelancing, confirm before coding, minimal scope, ask-don't-guess |
| `~/.claude/rules/scope-discipline.md` | Prevents feature creep and unrequested changes |
| `~/.claude/rules/verification.md` | No completion claims without proof |
| `~/.claude/rules/git-safety.md` | Destructive git operation prevention |
| `~/.claude/rules/regression-prevention.md` | Verify existing functionality before/after changes |
| `~/.claude/rules/documentation.md` | DOCS_INDEX governance |
| `~/.claude/settings.json` | Global hooks (git blocker, post-compact, notifications) + command deny list |
| `CODEX_HOME/AGENTS.md` | Global Codex guidance loaded before project instructions |
| `CODEX_HOME/config.toml` | Codex model/plugins plus fallback filename settings |

### Per-Project

| File | Purpose |
|---|---|
| `AI.md` (project root) | Entry point for any AI session |
| `AGENTS.md` (project root) | Operational guidance for Codex and other coding agents |
| `CLAUDE.md` (project root) | Project-specific: domain glossary, build commands, anchor pattern rules |
| `.codex/` (project root, optional) | Codex app local environments, setup scripts, and project actions |
| `.claude/settings.json` | Allow/deny lists + project hooks (typecheck, build) |
| `.claude/context-essentials.md` | Post-compaction critical rules (read by global hook) |
| `.claude/rules/*.md` | Path-scoped project rules (auto-loaded by Claude Code) |
| `.claude/hooks/*.sh` | Quality gate scripts (auto-typecheck, build checks) |
| `.claude/commands/*.md` | Custom slash commands (/project:handoff, /project:status, etc.) |
| `.claude/CLAUDE.local.md` | Personal overrides (gitignored) |
| `AI_OS/AI_OPERATING_SYSTEM.md` | Core philosophy and universal rules |
| `AI_OS/MODEL_SELECTION_GUIDE.md` | Which AI model to use for which task |
| `AI_OS/CONTEXT_RULES.md` | Context priority, regression prevention, breakthrough knowledge |
| `AI_OS/AI_DECISION_LOG.md` | Stable architectural decisions |
| `AI_OS/DOCS_INDEX_TEMPLATE.md` | Template for project docs index (with temperature classification) |
| `AI_OS/references/agent-teams-reference.md` | Agent Teams setup, prompts, best practices, limitations |
| `AI_OS/references/AI_OS_CURRENT_STANDARD.md` | What a fully current AI_OS installation looks like |
| `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md` | Session boot instructions |
| `AI_OS/SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md` | Session handoff template |
| `AI_OS/SESSION-PROMPTS/ai-os-migration-audit.md` | Migration prompt for outdated AI_OS projects |
| `AI_OS/SKILLS/forensic-debug-loop/` | Disciplined multi-step debugging with 2-strike escalation |
| `AI_OS/SKILLS/docs-strategy/` | Documentation governance skill |
| `AI_OS/SKILLS/generate-agents/` | AGENTS.md generation skill |

---

## After Setup

Your project should look like:

```
your-project/
  AI.md
  AGENTS.md            (recommended when Codex or multiple coding agents are used)
  CLAUDE.md             (if using Claude Code — with anchor pattern + domain glossary)
  .codex/               (optional Codex app local environments / actions)
  .claude/
    settings.json       ← allow/deny lists + project hooks
    context-essentials.md ← post-compaction rules
    CLAUDE.local.md     ← personal overrides (gitignored)
    rules/              ← path-scoped behavioral rules
    hooks/              ← quality gate scripts
    commands/           ← custom slash commands
    skills/             ← (project-specific skills, if any)
  AI_OS/
    AI_OPERATING_SYSTEM.md
    MODEL_SELECTION_GUIDE.md
    CONTEXT_RULES.md
    AI_DECISION_LOG.md
    DOCS_INDEX_TEMPLATE.md
    references/
      agent-teams-reference.md
      AI_OS_CURRENT_STANDARD.md
    SESSION-PROMPTS/
    SKILLS/
  docs/
    DOCS_INDEX.md       (when ready — with temperature classification)
    ...
  src/
  ...
```

---

## Keeping In Sync

AI_OS is copied per project (not shared). When the master at `Desktop/AI_OS` is updated:

1. Run `sync-to-project` script — it handles both `AI_OS/` and `.claude/` structural files
2. Project-specific extras are preserved (session handoffs, custom skills, decision log entries)
3. The `templates/` folder stays in master only — no need to re-copy
4. `.claude/CLAUDE.local.md` is never overwritten (personal file)
5. **Project CLAUDE.md is NOT overwritten** — it contains project-specific domain glossary and must be maintained per project
6. Compare against `AI_OS/references/AI_OS_CURRENT_STANDARD.md` to verify nothing was missed

Decision logged in: `AI_DECISION_LOG.md` (2026-03-09 — "AI_OS is copied per project")
