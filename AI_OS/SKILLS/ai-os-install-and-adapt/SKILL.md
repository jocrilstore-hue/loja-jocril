---
name: ai-os-install-and-adapt
description: Install, audit, sync, or adapt the AI_OS in a repository without overwriting project-specific behavior. Use when the user says "apply the AI brain", "install AI_OS", "sync AI_OS", "adapt the AI brain", "check if AI_OS is up to date", or wants to upgrade an older project AI layer to the current master standard.
---

# AI_OS Install And Adapt

Use this skill when a repository needs the AI_OS added, upgraded, or checked against the current master standard.

This is a **portable project skill**, not a personal Codex-home workflow.

## Core Principle

Adapt, do not replace.

The AI_OS is a template layer that should be merged into the repository while preserving local project behavior.

## What This Skill Decides

1. Is this a new install, an upgrade, or an audit-only run?
2. What is portable from the master AI_OS?
3. What must remain project-specific?
4. Is the repository safe for unattended sync, or does it require manual review first?

## Default Classification

### Portable from master

- `AI_OS/AI_OPERATING_SYSTEM.md`
- `AI_OS/CONTEXT_RULES.md`
- `AI_OS/MODEL_SELECTION_GUIDE.md`
- `AI_OS/DOCS_INDEX_TEMPLATE.md`
- `AI_OS/NEW_PROJECT_SETUP.md`
- portable `AI_OS/references/`
- portable `AI_OS/templates/`
- portable shared `AI_OS/SKILLS/`
- `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md`
- `AI_OS/SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md`

### Preserve unless clearly safe to update

- root `AGENTS.md`
- root `AI.md`
- root `CLAUDE.md`
- `AI_OS/AI_DECISION_LOG.md`
- `AI_OS/SESSION-PROMPTS/SESSIONS/`
- repo-specific prompts
- repo-specific skills
- repo-specific references
- project `.claude/` customizations

### Never copy by default from the master

- personal Codex-global behavior from `~/.codex`
- personal MCP assumptions
- machine-specific paths
- `AI_OS/SKILLS/gws-manager/`
- `AI_OS/SKILLS/user/`
- skills tied to Maria-specific accounts or local infrastructure

## Operating Modes

### 1. New install

Use when the project has no AI_OS yet.

Follow:

- `AI_OS/NEW_PROJECT_SETUP.md`

Create the minimal portable layer first.

### 2. Existing repo safe-sync

Use when the repo already has AI_OS and the boundaries are clear.

Follow:

- `AI_OS/SESSION-PROMPTS/per-project-full-setup-prompt.md`

### 3. Older / messy install migration audit

Use when the repo has drift, unclear structure, or outdated AI_OS conventions.

Follow:

- `AI_OS/SESSION-PROMPTS/ai-os-migration-audit.md`

## Boundary Check Before Sync

Before editing:

1. confirm the target path is the actual repo root
2. check whether it is a container folder or nested repo scenario
3. confirm whether `.claude/` is in scope
4. inspect local AI entry files before classifying drift

If the boundary is unclear, stop and report instead of forcing a sync.

## Output Contract

Return:

1. Inventory summary
2. Install / audit / migration classification
3. Portable vs preserved classification
4. Changes made or proposed
5. Remaining issues
6. Verification performed

## Related Files

- `AI_OS/NEW_PROJECT_SETUP.md`
- `AI_OS/SESSION-PROMPTS/per-project-full-setup-prompt.md`
- `AI_OS/SESSION-PROMPTS/ai-os-migration-audit.md`
- `AI_OS/references/AI_OS_CURRENT_STANDARD.md`
