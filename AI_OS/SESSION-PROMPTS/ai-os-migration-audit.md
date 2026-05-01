# AI_OS Migration & Audit Prompt

> Use this when a project has an outdated AI_OS ("AI Brain") or is missing recent improvements.
> This prompt audits what exists, compares against the current standard, and upgrades what's missing.
> For projects with NO AI_OS at all, use `NEW_PROJECT_SETUP.md` instead.
> Date: 2026-03-29

---

## The Prompt (copy from here to the end of the file)

You're auditing and upgrading this project's AI_OS installation to the current standard. Work through all phases sequentially. Do NOT commit — make changes and report.

**Master template:** `C:\Users\maria\Desktop\AI_OS`
**Current standard reference:** `C:\Users\maria\Desktop\AI_OS\references\AI_OS_CURRENT_STANDARD.md`

Read `AI_OS_CURRENT_STANDARD.md` first — it defines every file, folder, hook, rule, and CLAUDE.md section that should exist.

---

## PHASE 1: Inventory — What Does This Project Have?

Scan the project and report what exists:

1. List all files in `AI_OS/` recursively
2. List all files in `.claude/` recursively (if exists)
3. Read `CLAUDE.md` (if exists)
4. Read `AI.md` (if exists)
5. Read `AGENTS.md` (if exists)
6. List all files in `docs/` recursively (if exists)
7. Check `.gitignore` for `CLAUDE.local.md` and `settings.local.json` entries

Present as a simple inventory — no changes yet.

---

## PHASE 2: Gap Analysis — Compare Against Current Standard

Read `C:\Users\maria\Desktop\AI_OS\references\AI_OS_CURRENT_STANDARD.md`.

For each section in the standard, report:

```
| Item | Status | Action Needed |
|---|---|---|
| AI_OPERATING_SYSTEM.md | ✅ exists / ⚠️ outdated / ❌ missing | sync from master / none / create |
```

Cover ALL sections:
- AI_OS core files (section 1)
- AI_OS folders (section 2)
- SESSION-PROMPTS (section 3)
- .claude/ structure (section 4)
- .claude/rules/ (section 5)
- .claude/hooks and settings.json hooks (section 6)
- CLAUDE.md structure (section 7)
- docs/ structure (section 8)
- Root files (section 9), including `AI.md` structure (9A) and `AGENTS.md` structure (9B)

For each item, check not just existence but CONTENT — is it the current version or an old one? Compare file sizes and key sections against master.

**Wait for user approval before proceeding to Phase 3.**

---

## PHASE 3: Sync AI_OS Core Files

Compare each core file against master at `C:\Users\maria\Desktop\AI_OS`:

**Always overwrite from master:**
- `AI_OPERATING_SYSTEM.md`
- `CONTEXT_RULES.md`
- `MODEL_SELECTION_GUIDE.md`
- `DOCS_INDEX_TEMPLATE.md`

**Sync folders (add missing, preserve project-specific):**
- `references/` — copy all from master, keep project-specific extras
- `SKILLS/` — sync `AGENTS.md` from master, preserve project-specific skills, and do not copy mirrored global skills
- `templates/` — copy all from master so `AI.md` / `AGENTS.md` / `CLAUDE_MD_SNIPPET.md` stay current
- `SESSION-PROMPTS/AI_SESSION_START.md` — overwrite
- `SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md` — overwrite
- `SESSION-PROMPTS/ai-os-migration-audit.md` — overwrite

**Do NOT sync personal-only skills by default:**
- personal-only skills such as `SKILLS/gws-manager/` or `SKILLS/user/`
- globally available skills that already live in Claude/Codex native skill systems
- any skill whose behavior depends on Maria-specific accounts, machine paths, or personal infrastructure

**NEVER touch:**
- `AI_DECISION_LOG.md` — project-specific
- `SESSION-PROMPTS/SESSIONS/` — project-specific
- Project-specific `per-project-full-setup-prompt.md` override

Report what was synced.

---

## PHASE 4: Sync .claude/ Structure

**If `.claude/` doesn't exist:** Create it and populate from master `C:\Users\maria\Desktop\.claude`.

**If `.claude/` exists:** Audit and upgrade:

1. **settings.json** — check for hooks section. Must have PostToolUse (Edit|Write) auto-test hook. If missing, add. Preserve existing allow/deny lists.
2. **context-essentials.md** — must exist. If missing, create from master template. If exists, check it has: crash-level rules, error recovery reminder, verification commands. Adapt to this project's specific crash rules.
3. **rules/** — compare against standard minimum set (section 5 of AI_OS_CURRENT_STANDARD.md). Copy missing rules from master. Preserve project-specific rules. Check `escalation.md` uses 2-strike (not 3-strike).
4. **hooks/** — check for `post-edit-check.sh`. If missing, copy from master. Adapt file extensions and test commands to this project's stack.
5. **.gitignore** — ensure `CLAUDE.local.md` and `settings.local.json` are included.

Report what was synced or created.

---

## PHASE 5: Audit Root AI Entry Layer (`AI.md`, `AGENTS.md`, `CLAUDE.md`)

Read the project's root AI entry files and compare them against sections 7, 9A, and 9B of the standard.

### `AI.md`

Check:
- Does it identify itself as the universal AI entry point?
- Does it point to `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md`?
- Does it tell the agent to read root `AGENTS.md` before editing, if present?
- Does it include regression prevention, documentation routing, verification, and the current 2-strike escalation rule?

If `AI.md` is missing in a multi-tool project, recommend creating it from `AI_OS/templates/AI.md`.
If `AI.md` exists but is outdated, report exactly which sections differ from the current template.

### `AGENTS.md`

Check:
- Does it separate cross-tool guidance from Claude-specific `CLAUDE.md` / `.claude/` configuration?
- Does it instruct agents to use the nearest nested `AGENTS.md` when present?
- Does it include a directory map / JIT index with real paths or search commands?
- Does it mention that Codex sub-agents/chat agents are not durable memory?

If `AGENTS.md` is missing in a Codex or multi-agent project, recommend generating it via the active tool's agent-doc generation skill, such as Codex `generate-agents`.
If `AGENTS.md` exists but is stale, report the missing or outdated sections.

### `CLAUDE.md`

Read the project's `CLAUDE.md`. Check against section 7 of the standard:

| Section | Status | Action |
|---|---|---|
| Anchor top (3 critical rules at lines 1-5) | ✅/❌ | Add if missing |
| Project header + navigation | ✅/❌ | — |
| Quick start (build/test/run) | ✅/❌ | Add if missing |
| Crash-level / always-on rules | ✅/❌ | — |
| AI_OS Reference | ✅/❌ | Add from `templates/CLAUDE_MD_SNIPPET.md` |
| Agent Teams section | ✅/❌ | Add with pointer to reference doc |
| Error Recovery ("O remédio...") | ✅/❌ | Add — critical for preventing cascading regressions |
| Compaction Instructions | ✅/❌ | Add — what to preserve when context compacts |
| Anchor bottom (same 3 rules repeated) | ✅/❌ | Add if missing |

**Also check:**
- Are there NEGATIVE rules ("NEVER", "do NOT") that should be rewritten as POSITIVE instructions? Flag candidates.
- Are there rules duplicated between CLAUDE.md and `.claude/rules/`? Flag as cleanup candidates.
- Is the CLAUDE.md too long? If over 200 lines, flag sections that could move to `.claude/rules/` with path scoping.

**Present findings. Apply changes only with user approval.**

---

## PHASE 6: Documentation Temperature Audit

If `docs/DOCS_INDEX.md` exists:
1. Check if it uses temperature classification (HOT/WARM/COLD/Temporary)
2. If not, restructure to add temperature sections
3. Classify each existing doc:
   - **HOT** — code directly implements this, or it's reverse-engineered knowledge
   - **WARM** — stable reference, update when the described thing changes
   - **Temporary** — active plans/investigations, archive when done
   - **COLD** — future/retired
4. Verify every listed file exists on disk (flag dead links)
5. Find docs on disk not in the index (add them)

If `docs/DOCS_INDEX.md` doesn't exist but `docs/` has files:
1. Create `docs/DOCS_INDEX.md` from template
2. Classify all existing docs

**Check for project-specific temperature override:** Look in `AI_OS/SESSION-PROMPTS/per-project-full-setup-prompt.md` — if it exists and contains temperature rules, use those instead of the generic classification.

**Create `docs/_archive/` if missing.**
**Create `docs/breakthroughs/` if the project has breakthrough knowledge.**

---

## PHASE 7: Summary Report

```
## AI_OS Migration Report — [Project Name]
Date: [today]
Previous standard: [estimate based on what was found — e.g., "pre-2026-03-29, missing hooks and anchor pattern"]
Current standard: v2026-03-29

### Core Files
- Synced: [list]
- Already current: [list]
- Skipped: [list]

### .claude/ Structure
- settings.json: [updated / created / already current]
- context-essentials.md: [created / updated / already current]
- rules/: [N] rules synced, [N] project-specific preserved
- hooks/: [created / updated / already current]
- escalation.md: [aligned to 2-strike / was already correct]

### Root AI Entry Layer
- AI.md: [missing / already current / outdated]
- AGENTS.md: [missing / already current / outdated]
- Codex parity gaps: [list or "none"]

### CLAUDE.md Upgrades
- Anchor pattern: [added / already present]
- Agent Teams section: [added / already present]
- Error Recovery section: [added / already present]
- Compaction Instructions: [added / already present]
- Negative rules to rewrite: [list or "none"]
- Duplicate rules to clean: [list or "none"]

### Documentation
- DOCS_INDEX: [created / restructured with temperature / already current]
- Temperature classification: [applied to N docs]
- Dead links: [N]
- Unindexed docs: [N]
- breakthroughs/: [created / existed / not needed]
- _archive/: [created / existed]

### Issues & Recommendations
[anything that needs manual attention]
```

Do NOT commit. User will review and commit manually.
