# AI.md — Jocril LOJA-ONLINE AI Loader

Read this file at the beginning of any AI session in this project.
This applies to ALL AI agents — Codex, Claude Code, Antigravity, ChatGPT, Gemini, or any other tool.

For Codex specifically: root `AGENTS.md` is the primary repo instruction surface. This `AI.md` file is a universal loader and optional fallback file when Codex is configured to look for it.

This file should stay project-facing.
Personal Codex home rules, global MCPs, globally installed skills, and machine-specific tool paths belong in `~/.codex`, not here.

For Jocril implementation work, root `AGENTS.md` and `CLAUDE.md` contain the critical project rules: faithful inline-style port, Portuguese URLs and copy, no new libraries without approval, and clean `bun run build` after code changes.

---

## Boot

1. Read `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md`
2. Follow its boot instructions
3. Identify the correct skill / mode for the current task
4. Read `AI_OS/MEMORY_INDEX.md` if present to rank hot workstreams, proven behavior, failed approaches, and regression risks
5. Check for the latest relevant session handoff in `AI_OS/SESSION-PROMPTS/SESSIONS/`
6. If the project has a root `AGENTS.md`, read it before editing code or docs
7. Continue work only after producing a short boot summary

If the task is small and does not need a specialized skill, stay in general AI_OS mode.

---

## Regression Prevention (ALL AGENTS MUST FOLLOW)

When modifying code to fix a problem or add a feature:

1. Identify what currently works in the affected area BEFORE changing anything
2. Run tests before AND after — the test suite must pass with no regressions
3. If the change touches shared code, check downstream consumers
4. Never assume a fix is isolated — check boundaries
5. If the scope of impact is unclear, STOP and ask the user

**Breaking something that already works is worse than not fixing the new thing.**

If a regression is detected after a change:
- STOP immediately
- Report what broke and what you changed
- Do NOT attempt cascading fixes without user approval

---

## Project-Specific Knowledge (ALL AGENTS MUST FOLLOW)

This project may contain working implementations that contradict official vendor documentation, general AI knowledge, or your training data.

When project docs describe capabilities that conflict with external knowledge:

- Trust project documentation and working code FIRST
- Do NOT "correct" working implementations based on external sources
- Do NOT tell the user something is impossible if the project already does it
- If uncertain, ASK the user rather than reverting to default assumptions

---

## Documentation Rules (ALL AGENTS MUST FOLLOW)

When creating or updating documentation:

- Check if a source-of-truth file already exists before creating a new one
- Follow the project's naming and placement conventions. Use the active tool's docs-strategy skill when available.
- Do NOT create random markdown files in the project root
- Do NOT inflate summary/memory files — route detail to dedicated topic files
- Wrong documentation steers future AI sessions wrong — treat accuracy as critical

When asked to "update documentation" after completing work:
- Route knowledge to the appropriate location (docs/, memory/, topic files)
- Keep summary files short (under 200 lines) — they are indexes, not encyclopedias
- Check for contradictions with existing docs before writing

---

## Session Handoffs (ALL AGENTS MUST FOLLOW)

At the end of any substantial work session:

1. Create a dated handoff file in `AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`
2. Filename: `YYYY-MM-DD_HH-MM_project_mode_handoff.md`
3. Template: `AI_OS/SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md`

Capture: date/time, what was completed, milestone reached, what must NOT be broken, next step.

Create a handoff when: hitting rate limits, completing a milestone, switching areas, user says "wrap up", or context is degrading.


---

## Verification Before Completion (ALL AGENTS MUST FOLLOW)

No completion claims without fresh verification evidence in the same response.

- If you claim tests pass, the test output must be visible above that claim
- If you claim a build succeeds, the build output must be visible
- If you claim something is fixed, the verification command output must be visible
- Never use "should work", "probably fine", "looks correct", "seems good"
- Never express completion before running the actual verification command

Unverified claims waste more time than running the test. This is non-negotiable.

---

## Architectural Escalation (ALL AGENTS MUST FOLLOW)

If 2+ fix attempts fail for the same issue:
1. STOP - do not attempt fix #3
2. Report what each failed fix revealed about the architecture
3. Present options: refactor, accept limitation, or scrap approach
4. Wait for user decision before continuing

Each failed fix is evidence the problem is structural. Use that evidence to make a real decision.


---

## Do Not Ignore the AI Operating System

The full rules, model selection guide, context priority, and skills are in `AI_OS/`.
This file contains the critical safety rules that every agent must follow regardless of whether they read the full AI_OS.
