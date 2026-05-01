# AI Session Start

Use this file at the **start of any AI work session** to boot the AI Operating System.

This is the single entry point for ChatGPT, Claude, Codex, Gemini, or any other model-based assistant.

---

## Boot Instructions

Load these files in order:

1. `AI_OPERATING_SYSTEM.md`
2. `MODEL_SELECTION_GUIDE.md`
3. `AI_DECISION_LOG.md`
4. Root `AGENTS.md` if the project has one

Then identify the session goal and load the most relevant tool-native/global skill only if needed:

- architecture, planning, and trade-off analysis: use the active tool's `architect-advisor` skill or equivalent
- prompt engineering: use Claude-native prompt skills for Claude targets, and Codex `my-precious` / `my-precious-codex` for OpenAI/Codex targets
- design critique: use the active tool's design-review skill or equivalent
- documentation governance: use the active tool's docs-strategy skill or equivalent
- AGENTS.md generation: use the active tool's agent-doc generation skill or equivalent

Only load `SKILLS/<name>/SKILL.md` from this project when that skill is genuinely project-specific and exists locally.

If the task is simple and does not need a specialized skill, stay in general AI_OS mode.

Do not load personal-infrastructure skills by default. Personal skills belong in the user's tool-native global skill system unless the current project explicitly owns a local override.

Then check for session continuity:

- Look for the latest relevant file in `SESSION-PROMPTS/SESSIONS/`
- If a relevant handoff exists for the same project or workstream, load it before continuing
- Respect stable decisions already recorded in `AI_DECISION_LOG.md`
- If the repo has nested `AGENTS.md` files near the target area, load the nearest one before editing

---

## Session Startup Checklist

At session start, determine:

1. What is the project or workstream?
2. What is the current goal?
3. Which skill or mode is most appropriate?
4. Is there an existing handoff file for this work?
5. Are there prior decisions that must be respected?
6. Is there a local `AGENTS.md` that narrows the rules for the files I will touch?

---

## Session Boot Summary

Before starting real work, produce a short boot summary:

Project:
Current Goal:
Active Skill / Mode:
Relevant Previous Handoff:
Relevant Prior Decisions:
Next Immediate Step:

Keep it short and operational.

---

## Default Operating Rules

Unless told otherwise:

- Follow the AI Operating System.
- Use the simplest model capable of solving the task reliably.
- Prefer clarity over complexity.
- Do not re-solve decisions already recorded in `AI_DECISION_LOG.md`.
- Use the active skill only as much as necessary.
- Load reference files only when relevant.
- Preserve continuity across sessions.

---

## Behavioral Rules

- Do not reload the entire AI_OS if the current session already has the required context.
- Do not activate all skills at once.
- Prefer the minimum relevant skill set.
- If there is conflict between old context and current instructions, flag it clearly.

---

## If No Handoff Exists

Start a fresh session but define:

- project name
- current objective
- active skill / mode
- expected output

Then proceed normally.

---

## End-of-Session Rule

At the end of any substantial session, create a dated handoff file using:

`SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md`

Store actual handoff files in:

`SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`

Recommended filename pattern:

`YYYY-MM-DD_HH-MM_project_mode_handoff.md`

Example:

`2026-03-09_09-12_flowbridge_coding_handoff.md`

---

---

## New Project Setup / Syncing AI_OS

When asked to "apply the AI brain", "sync AI_OS", or "check if AI_OS is up to date":

**⚠️ Adapt, don't replace.** AI_OS is a template. Merge it into the project — never overwrite project-specific content (CLAUDE.md, AGENTS.md, decision log, session history, custom skills, project rules).

- **New project:** follow `NEW_PROJECT_SETUP.md`
- **Existing project sync:** follow `SESSION-PROMPTS/per-project-full-setup-prompt.md` exactly — it defines what to overwrite vs. preserve
- **CLAUDE.md:** report what should change, do NOT auto-edit it

Template files for project root `AI.md` and CLAUDE.md sections are in:

`templates/`

If the project has a root `AGENTS.md`, treat it as the operational guide for Codex and other coding agents. `CLAUDE.md` remains Claude-specific.

---

## Final Principle

Every session should be easy to resume.

The assistant should always leave enough context so that another model or a later session can continue without re-discovering the same decisions.
