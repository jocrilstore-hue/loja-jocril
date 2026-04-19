# CLAUDE.md — AI_OS Sections

Copy the sections below into your project's CLAUDE.md file.

**Global behavioral rules** live in `~/.claude/CLAUDE.md` (applied automatically to all sessions).
**Global enforcement rules** live in `~/.claude/rules/` (scope-discipline, verification, git-safety, regression-prevention, documentation).
**Project-specific knowledge** (domain glossary, build commands, schema notes) lives in each project's own CLAUDE.md — that's what this template helps you build.

**Important:** CLAUDE.md must use the **anchor pattern** — place your 3 most-violated rules at the very top (lines 1-5) AND repeat them at the very bottom. This exploits primacy and recency bias in the model's attention. The sections below go in the body between the anchors.

---

## COPY FROM HERE ↓

---

## AI_OS Reference

This project uses the AI Operating System at `AI_OS/`.

Behavioral guardrails are enforced globally via `~/.claude/CLAUDE.md` (no freelancing, confirm before coding, minimal scope, ask-don't-guess on fields). Project-level enforcement via `.claude/rules/` (path-scoped, auto-loaded) and `.claude/settings.json` (allow/deny lists, hooks).

Key files:
- `AI_OS/AI_OPERATING_SYSTEM.md` — universal rules for all AI agents
- `AI_OS/CONTEXT_RULES.md` — context priority, regression rules, breakthrough knowledge protection
- `AI_OS/AI_DECISION_LOG.md` — stable architectural decisions

Do NOT modify AI_OS files without explicit user approval. Read them for guidance.

---

## Domain Glossary

<!-- PROJECT-SPECIFIC: Fill this in for each project. -->
<!-- This section prevents the "PO vs código" class of errors. -->
<!-- Map EVERY user-facing term to its exact DB column/field. -->

| User Term | DB Column | Table | Notes |
|-----------|-----------|-------|-------|
| _example: PO number_ | `po_number` | `orders` | _Purchase order, NOT código_ |
| _example: FO_ | `fo_id` | `production_jobs` | _Folha de Obra, never auto-link to quotes_ |
| _example: código_ | `codigo` | `items` | _Internal item code_ |

**Rules for this glossary:**
- When the user references any term in the left column, use the EXACT DB column in the second column.
- If a term is NOT in this glossary, ASK before assuming which field it maps to.
- Update this glossary when new field mappings are confirmed.

---

## Build & Verification Commands

<!-- PROJECT-SPECIFIC: Fill in your project's actual commands. -->

| Action | Command | When to run |
|--------|---------|-------------|
| Typecheck | `npx tsc --noEmit` | After every TS/TSX edit (also enforced via PostEdit hook) |
| Build | `pnpm build` | Before handoff / before claiming "done" |
| Tests | `pnpm test` | After any logic change |
| Lint | `pnpm lint` | Before commits |

---

## Agent Teams

For multi-session parallel work using Claude Code Agent Teams, see:
`AI_OS/references/agent-teams-reference.md`

Key points: explicit file ownership per teammate, acceptance criteria, plan doc pointer. Never use teams for sequential or same-file work. 3-5 teammates is the sweet spot.

---

## Error Recovery — "O remédio não pode ser pior que a doença"

When a fix introduces new errors or breaks something that was working:

1. **STOP immediately.** Do not attempt further fixes.
2. **Report status:** what you changed, what broke, what you were trying to fix.
3. **Wait for human direction.**

**Two-Strike Rule:** If the same fix approach fails twice, STOP. Do not try a third variation. Report the pattern and wait. The instinct to "just try one more thing" is how small bugs become architectural disasters.

**Severity tiers for errors:**
- **Crash-level** (data loss, broken builds, security): Stop immediately. Do not attempt automated recovery.
- **Functional** (wrong behavior, UI bugs): 2-strike limit applies.
- **Cosmetic** (formatting, naming): Fix freely, but still stop if it cascades.

---

## Compaction Instructions

When context is compacted (lossy summarization at ~70% capacity), preserve:
1. Current task/plan state and active branch
2. Crash-level rules from `.claude/context-essentials.md`
3. Files modified this session and their purpose
4. Any discovered bugs or regressions not yet fixed
5. User decisions made this session

The PostCompact global hook will re-inject `.claude/context-essentials.md` automatically. If working on a long session, re-read the active plan doc after compaction.

---

## COPY TO HERE ↑

---

## Anchor Pattern — How to Use

Your CLAUDE.md should have this structure:

```
<!-- ANCHOR TOP: 3 most-violated rules -->
⚠️ STOP — Read these 3 rules before every action:
1. [Your most violated rule]
2. [Your second most violated rule]
3. [Your third most violated rule]
<!-- END ANCHOR TOP -->

# Project Name — CLAUDE.md

[... quick start, rule index, body sections ...]

[... paste the AI_OS sections from above ...]

[... project-specific sections: Domain Glossary, Build Commands ...]

<!-- ANCHOR BOTTOM: Same 3 rules repeated -->
⚠️ FINAL CHECK — These rules are non-negotiable:
1. [Same rule 1]
2. [Same rule 2]
3. [Same rule 3]
<!-- END ANCHOR BOTTOM -->
```

Pick the 3 rules that get violated most in your project. Based on Insights data, common candidates:
- "Do NOT build features that were not explicitly requested"
- "Confirm field names against the Domain Glossary before implementing"
- "Run typecheck before reporting task complete"
- "Stop after 2 failed fix attempts"
- "Do not modify files outside your assigned scope"
