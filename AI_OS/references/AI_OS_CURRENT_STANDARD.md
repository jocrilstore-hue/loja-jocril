# AI_OS Current Standard — v2026-04-05

> This file defines what a fully up-to-date AI_OS installation looks like.
> Use it to audit any project: compare what exists against this checklist.
> When the master AI_OS is updated, update this file first — it's the source of truth.

---

## 1. AI_OS/ Core Files

| File | Required | Notes |
|---|---|---|
| `AI_OPERATING_SYSTEM.md` | Yes | Universal rules for all AI agents; must use 2-strike escalation language |
| `CONTEXT_RULES.md` | Yes | Must include Agent Teams bullet under Claude Code tool-specific config |
| `MODEL_SELECTION_GUIDE.md` | Yes | Must include Gemini 3.x series, GPT-5.4 / 5.4 Mini / 5.4 Nano / 5.3-Codex, and Opus/Sonnet 4.6 |
| `AI_DECISION_LOG.md` | Yes | Project-specific — never overwrite from master |
| `DOCS_INDEX_TEMPLATE.md` | Yes | Template for docs index with temperature classification |
| `NEW_PROJECT_SETUP.md` | Yes | Setup guide (master only) |

## 2. AI_OS/ Folders

| Folder | Required | Contents |
|---|---|---|
| `references/` | Yes | `agent-teams-reference.md`, `AI_OS_CURRENT_STANDARD.md`, prompt patterns, anti-patterns, bootstrap guides |
| `templates/` | Yes (master only) | `AI.md`, `AGENTS.md`, `CLAUDE_MD_SNIPPET.md` |
| `SKILLS/` | Yes | docs-strategy, generate-agents, forensic-debug-loop, my-precious, my-precious-codex, + project-specific |
| `SESSION-PROMPTS/` | Yes | See section 3 |

Template skills should complement, not duplicate, globally installed Claude/Codex skills. Project-specific AI_OS skills may add local facts, task-to-mode mappings, and examples, but global behavior such as prompt-building, model-routing, and provider-specific orchestration belongs in global skills/config.

## 2A. Codex Global Structure (if Codex is used)

| File | Required | Notes |
|---|---|---|
| `CODEX_HOME/AGENTS.md` or `~/.codex/AGENTS.md` | Yes | Must be non-empty and cross-project, not repo-specific |
| `CODEX_HOME/config.toml` or `~/.codex/config.toml` | Yes | Must include the user's Codex defaults |

Recommended:
- Set `project_doc_fallback_filenames = ["AI.md"]` if projects rely on root `AI.md`
- Keep Codex guidance in `AGENTS.md`; do not turn `AI.md` into the primary Codex instruction surface
- Keep personal Codex-global behavior in `~/.codex`, not in copied project AI_OS files
- Do not copy personal MCP selections, personal trigger phrases, globally installed skills, or machine-specific tool paths into project templates

## 3. SESSION-PROMPTS/

| File | Required | Notes |
|---|---|---|
| `AI_SESSION_START.md` | Yes | Universal boot file — must be tool-agnostic |
| `SESSION_HANDOFF_TEMPLATE.md` | Yes | Milestone handoff template |
| `ai-os-migration-audit.md` | Yes (master/workflow) | Migration prompt for upgrading older AI_OS installs |
| `CODEX-RUNBOOKS/` | Yes (dir if Codex is used) | Stable home for reusable Codex-first execution prompts shared by path |
| `per-project-full-setup-prompt.md` | Optional | Generic in master; project-specific override allowed per project |
| `SESSIONS/` | Yes (dir) | Dated session artifacts — project-specific, never sync from master |

## 4. .claude/ Structure (Claude Code projects)

| Item | Required | Notes |
|---|---|---|
| `settings.json` | Yes | allow/deny lists + hooks |
| `settings.local.json` | Optional | Personal overrides (gitignored) |
| `CLAUDE.local.md` | Optional | Personal overrides (gitignored) |
| `context-essentials.md` | Yes | Post-compaction critical rules checklist (project-adapted) |
| `rules/` | Yes | Path-scoped behavioral rules (see section 5) |
| `hooks/` | Yes | Auto-test, quality gates (see section 6) |

## 5. .claude/rules/ (minimum set)

| File | Globs | Purpose |
|---|---|---|
| `git-safety.md` | all files | Branch, commit, destructive operation rules |
| `regression-prevention.md` | `**/*.{js,ts,jsx,tsx,py,css,html,json}` | Verify before/after, stop on regression |
| `escalation.md` | `**/*.{js,ts,jsx,tsx,py,css,html}` | 2-strike rule, cascade detection |
| `documentation-routing.md` | docs-related paths | Where docs go, naming, temperature |
| `documentation.md` | docs-related paths | Doc governance rules |
| `session-handoff.md` | all files | End-of-session handoff rules |
| `verification.md` | all files | Verification requirements |
| `ai-os-reference.md` | all files | Points to AI_OS location |
| `architecture.md` | `src/**, app/**, pages/**, components/**` | Keep ARCHITECTURE.md current |

**Project-specific rules** (add as needed):
- `pipeline-safety.md` — Flowbridge: `src/lib/**` crash-prevention rules
- Other projects add their own domain-specific rules

## 6. .claude/hooks/ and settings.json hooks

### Global hooks (~/.claude/settings.json)

| Hook | Event | Purpose |
|---|---|---|
| Destructive git blocker | PreToolUse (Bash) | Blocks `reset --hard`, `push --force`, etc. |
| PostCompact context restore | PostToolUse (compact) | Reads `.claude/context-essentials.md` if exists, else generic reminder |
| Notification | Notification | Windows popup when Claude needs attention |

### Project hooks (.claude/settings.json)

| Hook | Event | Purpose |
|---|---|---|
| Auto-typecheck after edit | PostToolUse (Edit\|Write) | Runs typecheck on edited TS/TSX files in src/ |

## 7. CLAUDE.md Structure (project root)

A fully up-to-date CLAUDE.md must have:

| Section | Required | Notes |
|---|---|---|
| **Anchor top** | Yes | 3 most-violated rules at lines 1-5 (primacy bias) |
| Project header + navigation | Yes | Links to AGENTS.md, key docs |
| Quick start (build/test/run) | Yes | Project-specific commands |
| Rule Index | Recommended | Table linking to `.claude/rules/` and `docs/rules/` |
| Crash-level / always-on rules | Yes | Rules too critical to externalize |
| AI_OS Reference | Yes | Pointer to `AI_OS/` key files |
| Agent Teams section | Yes | Pointer to `AI_OS/references/agent-teams-reference.md` |
| Error Recovery section | Yes | "O remédio não pode ser pior que a doença" — 2-strike rule |
| Compaction Instructions | Yes | What to preserve when compacting context |
| **Anchor bottom** | Yes | Same 3 rules repeated at end (recency bias) |

## 8. docs/ Structure

| Item | Required | Notes |
|---|---|---|
| `docs/DOCS_INDEX.md` | Yes (when project has docs) | Temperature-classified index |
| `docs/_archive/` | Yes | Archive for retired docs |
| `docs/breakthroughs/` | If applicable | Empirical findings contradicting vendor docs |
| `docs/plans/` | Optional | Active plan files (temporary temperature) |

### Temperature Classification

Every doc in DOCS_INDEX.md must be classified:

- **HOT** — code depends on these, NEVER archive. Root entry points, architecture docs the code implements, reverse-engineered ground truth, breakthrough findings.
- **WARM** — stable reference, update when the thing it describes changes. Integration docs, governance, rules, CLI prompts.
- **Temporary** — active work, archive when purpose fulfilled. Plans, investigation notes.
- **COLD** — archive or not-yet-built. Future plans, retired docs.

**Project-specific overrides:** Some projects have domain knowledge that would normally be WARM but is actually HOT because the code directly implements it (e.g., Flowbridge IX3 research). These overrides go in the project's own `AI_OS/SESSION-PROMPTS/per-project-full-setup-prompt.md`.

## 9. Root files (project root)

| File | Required | Notes |
|---|---|---|
| `CLAUDE.md` | Yes (Claude Code projects) | See section 7 |
| `AI.md` | Recommended (all multi-tool projects) | Universal AI entry point; if present must satisfy section 9A |
| `AGENTS.md` | Recommended (Codex/multi-agent projects) | Operational guidance for Codex/coding agents; if present must satisfy section 9B |
| `.gitignore` entries | Yes | Must include `CLAUDE.local.md`, `settings.local.json` |
| `.codex/` | Optional | Codex app local environments, setup scripts, and actions |

### 9A. `AI.md` Structure (project root)

If a project has `AI.md`, it must:

| Section / Behavior | Required | Notes |
|---|---|---|
| Universal loader framing | Yes | Must clearly apply to Codex, Claude, and other AI tools |
| Boot path | Yes | Must point to `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md` |
| Local guidance handoff | Yes | Must tell the agent to read root `AGENTS.md` if present before editing |
| Regression prevention | Yes | Must preserve working behavior before changes |
| Documentation routing | Yes | Must point to docs governance instead of allowing random root markdown |
| Verification rule | Yes | Must forbid unverified completion claims |
| Escalation rule | Yes | Must use the current 2-strike stop policy |

### 9B. `AGENTS.md` Structure (project root)

If a project has root `AGENTS.md`, it must:

| Section / Behavior | Required | Notes |
|---|---|---|
| Repo snapshot | Yes | Short statement of what the repo is and how agents should treat it |
| Tool boundary statement | Yes | Must separate cross-tool guidance from Claude-specific `CLAUDE.md` / `.claude/` config |
| Nearest-wins guidance | Yes | Must tell agents to use the nearest nested `AGENTS.md` when present |
| JIT index / directory map | Yes | Must point to key folders and search commands rather than dumping content |
| Git safety / regression reminder | Yes | Must reinforce non-destructive workflow expectations |
| Durable-memory reminder | Yes | Must state that Codex sub-agents/chat agents are not a persistence layer |

---

## Version History

| Date | Changes |
|---|---|
| 2026-03-29 | Initial version. Added: agent-teams-reference, error recovery (2-strike), compaction instructions, anchor pattern, PostCompact hook + context-essentials, path-scoped pipeline-safety rules, PostToolUse auto-test hook, generic per-project-full-setup-prompt |
| 2026-03-29 | Added explicit Codex/root-entry-layer requirements for `AI.md` and `AGENTS.md`, and added `ai-os-migration-audit.md` to the standard session-prompt set. |
| 2026-04-04 | Added Codex global setup requirements, `my-precious-codex`, Windows/WSL guidance, and refreshed OpenAI model guidance to GPT-5.4 / GPT-5.3-Codex era defaults. |
| 2026-04-05 | Added `SESSION-PROMPTS/CODEX-RUNBOOKS/` as the standard location for reusable Codex execution prompts shared by absolute path. |
