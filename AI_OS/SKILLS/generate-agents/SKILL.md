---
name: generate-agents
description: Generate hierarchical AGENTS.md documentation for AI coding agents. Use when setting up a new codebase for AI-assisted development, creating agent-friendly documentation, or improving AI agent efficiency in a repository. Triggers on "generate AGENTS.md", "create agents documentation", "setup for AI agents", "make this repo agent-friendly", or any request for hierarchical agent documentation. Works with any AI model or CLI.
---

# Generate AGENTS.md

Create hierarchical AGENTS.md documentation that helps AI coding agents work efficiently with minimal token usage.

This is a multi-tool skill — use it with Claude Code, ChatGPT, Gemini, Antigravity, or any other AI coding agent.

---

# Prerequisites

Before generating AGENTS.md, verify:

1. The project documentation is in a reasonable state (not a mess of contradictions)
2. The repo structure is stable enough to describe
3. Major directories, packages, and services are known

If the project has significant documentation debt, address that first using `SKILLS/docs-strategy/SKILL.md`. AGENTS generation is downstream of docs strategy, not upstream.

If the project has a `docs/DOCS_INDEX.md`, read it before starting — it shows what authoritative docs already exist.

---

# Core Principles

1. **Root is LIGHTWEIGHT** — Universal guidance only, links to sub-files (~100-200 lines max)
2. **Nearest-wins hierarchy** — Agents read the closest AGENTS.md to the file being edited
3. **JIT indexing** — Provide paths/globs/commands, NOT full content
4. **Token efficiency** — Small, actionable guidance over encyclopedic docs
5. **Sub-folders have MORE detail** — Specific patterns, examples, commands
6. **AGENTS.md is operational guidance for AI, not general documentation** — Don't duplicate architecture docs or project docs

---

# Workflow

## Phase 1: Repository Analysis

Analyze the codebase and present a structured map before generating anything:

1. **Repository type**: Monorepo, multi-package, or simple single project?
2. **Primary tech stack**: Languages, frameworks, key tools
3. **Major directories** that should have their own AGENTS.md:
   - Apps (e.g. `apps/web`, `apps/api`, `apps/mobile`)
   - Services (e.g. `services/auth`, `services/transcribe`)
   - Packages/libs (e.g. `packages/ui`, `packages/shared`)
   - Workers/jobs (e.g. `workers/queue`, `workers/cron`)
4. **Build system**: pnpm/npm/yarn workspaces? Turborepo? Lerna? Or simple?
5. **Testing setup**: Jest, Vitest, Playwright, pytest? Where are tests?
6. **Key patterns to document**:
   - Code organization patterns
   - Important conventions (naming, styling, commits)
   - Critical files that serve as good examples
   - Anti-patterns to avoid
7. **Breakthrough knowledge**: Does the project achieve things that contradict vendor docs or general AI knowledge? These MUST be flagged in AGENTS.md so future agents don't "fix" working implementations.

Present this as a **structured map** and wait for approval before generating files.

---

## Phase 2: Generate Root AGENTS.md

Create a **lightweight root AGENTS.md** (~100-200 lines max).

### Required Sections:

**1. Project Snapshot** (3-5 lines)
- Repo type (monorepo/simple)
- Primary tech stack
- Note that sub-packages have their own AGENTS.md files

**2. Root Setup Commands** (5-10 lines)
- Install dependencies (root level)
- Build all
- Typecheck all
- Test all

**3. Universal Conventions** (5-10 lines)
- Code style (TypeScript strict? Prettier? ESLint?)
- Commit format (Conventional Commits?)
- Branch strategy
- PR requirements

**4. Security & Secrets** (3-5 lines)
- Never commit tokens
- Where secrets go (.env patterns)
- PII handling if applicable

**5. Regression Prevention** (5-10 lines)
**THIS SECTION IS MANDATORY — it protects the project from AI agents breaking working code.**

```
## Regression Prevention

Before modifying any code:
1. Identify what currently works in the affected area
2. Run the test suite BEFORE and AFTER changes
3. If the change touches shared code, verify downstream consumers
4. Never assume a fix is isolated — check boundaries
5. If impact is unclear, STOP and ask

Breaking something that already works is worse than not fixing the new thing.

If this project has documented capabilities that contradict official vendor docs
or general AI knowledge — trust the project docs. Do NOT "correct" working code
based on external sources.
```

**6. Git Safety (MANDATORY — All Projects with Git)**

```
## ⛔ Git Safety (ALL MODES — No Exceptions)

These rules override both Default and YOLO modes. Even in YOLO Mode, destructive git operations require explicit user permission.

**NEVER run without asking:** `git checkout -- <path>`, `git pull`, `git merge`, `git rebase`, `git reset --hard`, `git stash drop`, `git clean -f`, `git push --force`, `git checkout <branch>` with dirty working tree.

**ALWAYS allowed:** `git status`, `git log`, `git diff`, `git show`, `git reflog`, `git add`, `git commit`, `git stash push`.

**Before any destructive git operation:** Run `git status` first. If uncommitted changes exist, STOP and report to user. Get explicit permission.

**The Panic Rule:** When stuck in a loop, STOP. Do not escalate to destructive git operations. A broken feature is recoverable. Destroyed uncommitted work is not.
```

**7. Branch Workflow & Session Handoff (MANDATORY)**

```
## Branch Workflow

Three branches: `main` (production, user-only merges), `checkpoint/daily` (session checkpoints), working branch (active dev).

## Session Handoff Checklist (Mandatory)

At every session handoff ("wrap up", "commit this", "end of session"):

1. Create dated handoff file in `AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`
2. Update `docs/DOCS_INDEX.md` with ALL new files created this session
3. `git add -A` and commit with descriptive message
4. Ask user: "Should I merge to checkpoint/daily?"
5. If yes: merge to checkpoint and return to working branch

Skipping step 2 (DOCS_INDEX) is not allowed. Every new file must be indexed.
```

**8. JIT Index - Directory Map** (10-20 lines)

```
## JIT Index (what to open, not what to paste)

### Package Structure
- Web UI: `apps/web/` → [see apps/web/AGENTS.md](apps/web/AGENTS.md)
- API: `apps/api/` → [see apps/api/AGENTS.md](apps/api/AGENTS.md)
- Shared packages: `packages/**/` → see individual AGENTS.md

### Quick Find Commands
- Search for a function: `rg -n "functionName" apps/** packages/**`
- Find a component: `rg -n "export.*ComponentName" apps/web/src`
- Find API routes: `rg -n "export const (GET|POST)" apps/api`
```

**9. Breakthrough Knowledge** (if applicable, 3-10 lines)
- Capabilities that contradict official vendor documentation
- Things AI agents might try to "correct" but that actually work
- Point to detailed docs where the breakthrough is documented

**10. Definition of Done** (3-5 lines)
- What must pass before a PR is ready
- Minimal checklist

---

## Phase 3: Generate Sub-Folder AGENTS.md Files

For EACH major package/directory identified in Phase 1, create a **detailed AGENTS.md**.

### Required Sections:

**1. Package Identity** (2-3 lines)
- What this package/app/service does
- Primary tech/framework for THIS package

**2. Setup & Run** (5-10 lines)
- Install command (if different from root)
- Dev server command
- Build command
- Test command
- Lint/typecheck commands

**3. Patterns & Conventions** (10-20 lines)
**THIS IS THE MOST IMPORTANT SECTION**

- File organization rules (where things go)
- Naming conventions specific to this package
- Preferred patterns with **file examples**:
  ```
  - ✅ DO: Use functional components like `src/components/Button.tsx`
  - ❌ DON'T: Use class components like `src/legacy/OldButton.tsx`
  - ✅ Forms: Copy pattern from `src/components/forms/ContactForm.tsx`
  - ✅ API calls: Use `src/lib/api/client.ts` wrapper, see example in `src/hooks/useUser.ts`
  ```

**4. Touch Points / Key Files** (5-10 lines)

```
- Auth logic: `src/auth/provider.tsx`
- API client: `src/lib/api.ts`
- Types: `src/types/index.ts`
- Config: `src/config.ts`
```

**5. JIT Index Hints** (5-10 lines)

```
- Find a React component: `rg -n "export function .*" src/components`
- Find a hook: `rg -n "export const use" src/hooks`
- Find route handlers: `rg -n "export async function (GET|POST)" src/app`
- Find tests: `find . -name "*.test.ts"`
```

**6. Common Gotchas & Breakthrough Knowledge** (3-10 lines, if applicable)
- Known pitfalls specific to this package
- Things that seem wrong but are intentionally designed that way
- Capabilities that contradict external documentation but work in this project
- "DO NOT change X because it enables Y, even though vendor docs say it shouldn't work"

**7. Regression Prevention** (3-5 lines, package-specific)
- List the specific working behaviors that must be preserved in this package
- Name the fragile areas where fixes commonly break other things
- Example: "Changing overflow handling in style-builder.ts breaks sticky positioning — read memory/sticky-reveal-fix.md first"
- Point to tests that serve as regression guards

**8. Pre-PR Checks** (2-3 lines)

```
pnpm --filter @repo/web typecheck && pnpm --filter @repo/web test && pnpm --filter @repo/web build
```

---

## Phase 4: Special Sections

Add domain-specific sections when applicable:

### Design System / UI Package
```markdown
## Design System
- Components: `packages/ui/src/components/**`
- Use design tokens from `packages/ui/src/tokens.ts` (never hardcode colors)
- See component gallery: `pnpm --filter @repo/ui storybook`
```

### Database / Data Layer
```markdown
## Database
- ORM: Prisma / Drizzle / TypeORM
- Schema: `prisma/schema.prisma`
- Migrations: `pnpm db:migrate`
- **NEVER** run migrations in tests; use `test-db` script
```

### API / Backend Service
```markdown
## API Patterns
- REST routes: `src/routes/**/*.ts`
- Auth middleware: `src/middleware/auth.ts`
- Validation: Use Zod schemas in `src/schemas/**`
- Example endpoint: See `src/routes/users/get.ts`
```

### Testing Package
```markdown
## Testing
- Unit tests: `*.test.ts` colocated with source
- Integration tests: `tests/integration/**`
- E2E tests: `tests/e2e/**` (Playwright)
- Run single test: `pnpm test -- path/to/file.test.ts`
```

---

# Reference Files

Use these load-on-demand references instead of bloating the main skill body:

- `references/root-template.md` -> root `AGENTS.md` template and section guidance
- `references/sub-template.md` -> sub-folder `AGENTS.md` template and section guidance
- `references/special-sections.md` -> optional package/domain sections

---

# Output Format

Present files in this order:

1. **Analysis Summary** (from Phase 1)
2. **Root AGENTS.md** (complete, ready to use)
3. **Each Sub-Folder AGENTS.md** (one at a time, with file path)

Use this format:

```
---
File: `AGENTS.md` (root)
---
[full content here]

---
File: `apps/web/AGENTS.md`
---
[full content here]
```

---

# Quality Checklist

Before generating, verify:

- [ ] Root AGENTS.md is under 200 lines
- [ ] Root links to all sub-AGENTS.md files
- [ ] Each sub-file has concrete examples (actual file paths)
- [ ] Commands are copy-paste ready (no placeholders unless unavoidable)
- [ ] No duplication between root and sub-files
- [ ] JIT hints use actual patterns from the codebase (ripgrep, find, glob)
- [ ] Every "DO" has a real file example
- [ ] Every "DON'T" references a real anti-pattern or legacy file
- [ ] Pre-PR checks are single copy-paste commands
- [ ] Breakthrough knowledge is flagged where applicable
- [ ] AGENTS.md does not duplicate content from docs/ — it points to docs instead
- [ ] Root AGENTS.md has a Regression Prevention section (mandatory)
- [ ] Root AGENTS.md has a Git Safety section (mandatory)
- [ ] Root AGENTS.md has a Branch Workflow & Session Handoff section (mandatory)
- [ ] Sub-folder AGENTS.md files list package-specific fragile areas
