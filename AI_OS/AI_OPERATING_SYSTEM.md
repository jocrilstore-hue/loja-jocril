# AI Operating System (AI_OS) — MASTER TEMPLATE

> **This is the master template.** This Desktop `AI_OS/` is the canonical source that gets copied into each project's own `AI_OS/` folder. Project-specific prompts, session logs, and context belong in the project's own AI_OS, not here.

Operating rules for working with AI systems across tools (Claude, ChatGPT, Gemini, Codex, Antigravity, etc.).

---

## Portable vs Global Boundary

This master `AI_OS` is the portable, project-facing layer.

Keep these in global tool config, not in the copied project AI_OS:

- personal Codex defaults in `~/.codex/AGENTS.md` and `~/.codex/config.toml`
- globally installed Codex skills and MCP servers
- personal Claude global rules, hooks, and local account setup
- global Claude/Codex skill behavior such as architect-advisor, prompt-building, model-routing, and provider-specific orchestration
- machine-specific runtime paths (Windows Python path, Scoop paths, local binary locations)

Keep these in the project AI_OS:

- project boot flow
- project-local documentation routing
- project handoff discipline
- project decision logging
- project-specific prompts and reusable repo skills
- cross-tool rules that genuinely need to travel with the repo

If a rule is personal, machine-specific, or useful across all repos whether or not they copy AI_OS, it belongs in the global tool config, not here.

Project AI_OS skills may extend global skills with project-specific facts, mappings, and constraints, but should not duplicate the global skill body. The template should provide local context and durable project memory, not a second global brain.

---

## ⚠️ Applying AI_OS to a Project: Adapt, Don't Replace

When asked to "apply the AI brain", "sync AI_OS", "set up the AI OS", or "check if AI_OS is up to date" in any project:

- **This is a template, not a replacement.** Layer it on top of the existing project — merge and adapt.
- **Never overwrite project-specific content:** CLAUDE.md, AGENTS.md, AI_DECISION_LOG.md, SESSION-PROMPTS/SESSIONS/, custom skills, project rules.
- **Follow the sync procedure** in `SESSION-PROMPTS/per-project-full-setup-prompt.md` — it defines exactly what to overwrite vs. preserve.
- **CLAUDE.md is especially sensitive:** report what should change, do NOT auto-edit it.

"Apply the AI brain" = adapt the template to the project. Not replace the project with the template.

---

## Core Rule

Remove ambiguity from the task. The best prompt is the simplest prompt that clearly defines what to do.

---

## Universal Prompt Structure

ROLE → CONTEXT → TASK → INSTRUCTIONS → CONSTRAINTS → OUTPUT FORMAT → EXAMPLES → INPUT

See `MODEL_SELECTION_GUIDE.md` for model + effort level selection across all providers.

---

## CRITICAL: Instruction Following (All Models)

All LLMs drift from instructions over long sessions. These rules reduce drift regardless of provider:

1. **Keep system instructions under 150 lines.** Beyond that, rules get lost in ALL models. Move domain knowledge into separate context files loaded on demand.
2. **Phrase positively.** "Modify ONLY files listed" beats "Don't modify other files" — true for every model.
3. **Scope tasks tightly.** Name exact files, exact functions, exact changes. Broad prompts cause scope creep in every model.
4. **Fresh sessions for new tasks.** Long sessions degrade quality across all providers.
5. **Verify, don't trust.** If test output isn't shown in the response, it didn't run. No model is exempt.
6. **Use tool-specific enforcement when available.** Claude: hooks. Codex: task constraints. Gemini: grounding configs. Advisory instructions < enforced constraints in every system.
7. **Git safety is non-negotiable.** No AI agent may run destructive git operations (`checkout --`, `pull`, `merge`, `reset --hard`, `stash drop`, `clean -f`, `push --force`) without explicit user permission. Even in YOLO/autonomous modes. `git status` first, ask permission second, execute third. NO EXCEPTIONS.

Provider-specific guides:
- Claude Code: `references/CLAUDE-CODE-INSTRUCTION-FOLLOWING.md`
- Other providers: add guides as needed to `references/`

---

## Prompt Engineering Rules

Always: define the task clearly, define the output format, provide examples when possible, separate context from instructions.

Avoid: vague instructions, unnecessary verbosity, hidden output formats, conflicting constraints.

When iterating on prompts: start simple, test results, add constraints only when necessary. Prefer **removing instructions** before adding new ones.

Check `references/prompt-antipatterns.md` for common mistakes (vague tasks, context dumps, missing output formats, unbounded tasks).

Check `references/prompt-pathologies.md` for systemic failures across iterations (Fractal Prompt, Prompt Drift, Prompt Collapse, Prompt Illusion).

---

## Reasoning Effort

Always specify effort level with model recommendations. All providers support some form of effort control:

- **high** — Implementation, debugging, multi-file, anything where missing something is costly
- **medium** — Refactoring with clear patterns, data extraction, test writing
- **low** — Mechanical changes, config updates, documentation writing

Don't default to max. Match effort to task complexity. This saves credits/tokens across all providers.

For personal Codex defaults such as the preferred default model, reasoning effort, global MCPs, and trigger phrases, use the global Codex home config rather than copying those assumptions into downstream projects.

---

## AI Collaboration Modes

Use the minimum relevant skill for the task:
- Architecture / planning → Architect Advisor
- Prompt creation → My Precious (Claude) / My Precious Codex (OpenAI/Codex)
- Design critique → Design Reviewer
- Documentation → Docs Strategy
- AGENTS.md generation → Generate Agents
- Stubborn multi-step bugs → Forensic Debug Loop

Don't activate a skill if plain mode is enough.

---

## ⛔ INVIOLABLE: Git Safety Rules

**WHY THIS EXISTS:** On 2026-03-11, an AI agent ran `git reset --hard` to "clean up" before a push. It destroyed uncommitted work the user had not staged. This section exists because that must never happen again.

### NEVER (requires explicit user permission):
- `git checkout -- <file>` or `git checkout -- .` (discards working changes)
- `git pull` or `git fetch` (alters local state from remote)
- `git merge` (alters branch state)
- `git reset --hard` (destroys uncommitted work)
- `git stash drop` (permanently destroys stashed work)
- `git clean -f` or `git clean -fd` (deletes untracked files)
- `git push --force` or `git push --force-with-lease` (overwrites remote history)

### ALWAYS ALLOWED (no permission needed):
- `git status`
- `git diff` (any form)
- `git log` (read-only)
- `git show` (read-only)

### Before any destructive operation:
1. STOP
2. Describe exactly what the command will do and what will be lost
3. Ask for explicit permission ("Can I run X?")
4. Wait for "yes" — a previous "yes" does not count
5. Execute only the exact command approved

### Panic Rule:
If something unexpected happened: STOP → explain what changed → WAIT. Do NOT attempt to fix it with more git commands.

---

## Branch Workflow

- Prefer a non-`main` working branch for substantial work.
- Keep branch naming simple and meaningful for the project.
- Do not encode Maria-only personal git workflow details in copied project AI_OS files.
- If a project already has its own branch conventions, follow those instead of imposing new ones here.

---

## Session Handoff Checklist

At the end of any substantial session:

1. Run the relevant project verification commands for the work that changed.
2. Write a handoff file → `AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/YYYY-MM-DD_HH-MM_topic_handoff.md`
3. Update the project's authoritative docs index or routing doc if docs were created, moved, or deleted.
4. Record stable architectural decisions in `AI_OS/AI_DECISION_LOG.md` when they are worth preserving across sessions.
5. State clearly: what is done, what must not be broken, and the next concrete step.

---

## File Placement — Prompts and Session Artifacts

All prompts, session artifacts, and handoffs go in:

```
AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/
```

Project documentation should follow the repo's own docs structure such as `docs/`, `docs/DOCS_INDEX.md`, or another documented local index. Do not hardcode one repo's folder layout into the master `AI_OS`.

---

## Regression Prevention

IMPORTANT: Breaking something that already works is worse than not fixing the new thing.

- Verify existing working functionality before AND after changes
- If shared code is touched, check downstream consumers
- Never assume a fix is isolated — check boundaries
- If impact is unclear, STOP and ask
- If a regression happens: STOP, report what broke, do NOT cascade-fix without approval

This applies to ALL coding agents — Claude Code, Codex, Antigravity, Cursor, any CLI.

---

## Architectural Escalation (2-Strike Rule)

If two fix attempts fail on the same issue:
- STOP — do not attempt fix #3
- The problem is structural, not local
- Report what each failed fix revealed
- Present options: refactor, accept limitation, or scrap approach
- Escalate to the user for decision

---

## Project-Specific Knowledge

When project docs describe capabilities that conflict with general knowledge or vendor docs:
- Trust project documentation and working code FIRST
- Do NOT "correct" working implementations
- Surface conflicts explicitly to the user
- Document breakthroughs in project docs

---

## Verification Before Completion

- If you claim tests pass, show the output
- If you claim a build succeeds, show the output
- Never say "should work" or "looks correct" without running verification
- Unverified claims waste more time than running the test

This applies to every model and every tool.

---

## Documentation Governance

Use the active tool's documentation-governance skill when available, such as Codex `docs-strategy` or the Claude-native equivalent. Key rules:
- One source of truth per topic
- Predictable naming and placement
- Wrong documentation steers models wrong — accuracy is critical
- Check if a better home exists before creating new docs

---

## Context Rules

See `CONTEXT_RULES.md` for conflict resolution, handoff discipline, stable vs temporary context, and tool-specific configuration boundaries.

---

## Reference Loading

Load references ONLY when needed:
- `references/prompt-antipatterns.md` — common prompt mistakes (vague tasks, context dumps, missing output formats, unbounded tasks)
- `references/prompt-pathologies.md` — systemic iteration failures (Fractal Prompt, Prompt Drift, Prompt Collapse, Prompt Illusion)
- `references/advanced-patterns.md` — advanced prompt patterns for complex workflows
- `references/PROJECT_DOCS_BOOTSTRAP.md` — template for initializing project documentation
- `references/CLAUDE-CODE-INSTRUCTION-FOLLOWING.md` — Claude Code-specific instruction following guide (hooks, plan mode, nuclear options)
