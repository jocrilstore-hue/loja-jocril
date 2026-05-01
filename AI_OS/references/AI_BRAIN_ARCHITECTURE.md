# AI Brain Architecture

> Canonical architecture note for Maria's AI Brain setup.
> Created: 2026-04-30

---

## Purpose

The AI Brain is the multi-machine, multi-project operating layer for Maria's AI-assisted work.

It must keep project continuity portable through Git while keeping personal tool configuration, secrets, and cross-project preferences out of project repositories.

---

## Four-Layer Model

| Layer | Owner | Lives In | Sync Mechanism | Purpose |
|---|---|---|---|---|
| L1 Master template | AI_OS | `C:\Users\maria\Desktop\AI_OS` | AI_OS template repo | Portable cross-project standards, setup docs, runbooks, references |
| L2 Project memory | Each project | `<project>\AI_OS\` plus root `AGENTS.md`, `AI.md`, `CLAUDE.md` | The project's own Git repo | Project decisions, handoffs, prompts, local references, repo-specific agent guidance |
| L3 Global agent config | `ai-brain` | Private repo, target local path `C:\Users\maria\Desktop\ai-brain` | Private GitHub repo + copy-based installers | Codex/Claude global config templates, hooks, commands, machine bootstrap notes |
| L4 Personal/cross-project memory | Maria-approved memory surfaces | Tool memory, optional private notes, future workspace if needed | Tool-native memory or private sync | Voice, preferences, routing, cross-project facts that are not project-specific |

---

## Boundary Rules

- Keep a committed `AI_OS\` inside each project. This is what makes `git pull` enough to continue project work from another machine.
- Keep the master `AI_OS` as a template and standard, not as the live memory for every project.
- Keep `ai-brain` for global tool setup only. It must not contain project memory, project secrets, live `.env` files, or local auth state.
- Keep `AGENTS.md`, `AI.md`, and `CLAUDE.md` separate by default:
  - `AGENTS.md` is the Codex / multi-agent operational entrypoint.
  - `AI.md` is a tiny universal loader and fallback.
  - `CLAUDE.md` is Claude-specific when a project uses Claude Code.
- Do not symlink `CLAUDE.md` to `AGENTS.md` by default. Claude-specific guidance should not become universal guidance accidentally.
- Defer any `Co-work OS` workspace. Create it only if the four-layer model leaves a concrete recurring gap.

---

## Secrets Policy

Secrets live per project or per machine, never in `ai-brain` or the master AI_OS.

Use:

- project `.env.local`, Vercel/Supabase/GitHub secrets, or equivalent for project runtime secrets
- local keychain/auth stores or gitignored local files for machine/tool secrets
- committed examples only, such as `.env.example`, `config.toml.template`, and `settings.json.template`

Never commit:

- API keys
- OAuth tokens
- Claude/Codex auth or session files
- live `.env` values
- cookies
- local override files
- logs, caches, or conversation/session dumps

---

## Machine Targets

| Machine | Role | OS | User | Tailscale |
|---|---|---|---|---|
| Legion Pro 5 | Main driver | Windows | Maria | `100.114.220.49` |
| Rune Home | Services, automation, local models | Ubuntu | `mj` | `100.110.190.12` |
| iMac M1 | Creative station | macOS | `imac2` | `100.80.185.95` |

Machine-specific paths and user names may be documented here, but shared config should use templates or installer variables when possible.

---

## Rollout Targets

Current first rollout set:

```text
C:\Users\maria\Desktop\Imacx\IMACX_PROD\NOVO\imacx\NEW-APP\imacx-clean
C:\Users\maria\Desktop\pessoal\FLOW_PARTY\Flowbridge-claude
C:\Users\maria\Desktop\pessoal\FLOW_PARTY\MASTER-COLLECTION
C:\Users\maria\Desktop\pessoal\jocril
```

Rollout must be audit-first. Project-specific `AI_OS\AI_DECISION_LOG.md`, session handoffs, local prompts, local references, and local skills are preserved unless Maria explicitly approves a change.

---

## Current Implementation Order

1. Update the master AI_OS to document this architecture.
2. Create the private `ai-brain` repo skeleton.
3. Capture Codex and Claude global config as templates, not live state.
4. Add copy-based installers for Windows, Ubuntu, and macOS.
5. Audit global skills separately before migrating any skill body.
6. Audit the four target projects.
7. Safe-sync only projects classified as low-risk.
8. Publish and roll out `ai-brain` across machines only after Maria approves.

No commits or pushes are made without Maria's explicit approval.
