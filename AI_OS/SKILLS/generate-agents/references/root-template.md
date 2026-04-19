# Root AGENTS.md Template

Use this template to generate the root AGENTS.md file. Keep it under 200 lines.

---

## Template

~~~~markdown
# AGENTS.md

[Project name] — AI agent guidance for this repository.

## Project Snapshot

- **Type**: [Monorepo with pnpm workspaces / Simple single project / etc.]
- **Stack**: [Primary languages and frameworks]
- **Sub-packages**: See individual AGENTS.md files in each directory

## Root Commands

```bash
[package-manager] install
[package-manager] build
[package-manager] typecheck
[package-manager] test
[package-manager] lint
```

## Universal Conventions

- **Code style**: [TypeScript strict mode / Prettier / ESLint config]
- **Commits**: [Conventional Commits / format description]
- **Branches**: [Branch naming convention]
- **PRs**: [PR requirements]

## Security & Secrets

- **NEVER** commit API keys, tokens, or secrets
- Environment variables go in `.env.local` (gitignored)
- See `.env.example` for required variables

## JIT Index

### Package Structure

| Directory | Purpose | AGENTS.md |
|-----------|---------|-----------|
| `apps/web/` | [Description] | [apps/web/AGENTS.md](apps/web/AGENTS.md) |
| `apps/api/` | [Description] | [apps/api/AGENTS.md](apps/api/AGENTS.md) |
| `packages/ui/` | [Description] | [packages/ui/AGENTS.md](packages/ui/AGENTS.md) |

### Quick Find Commands

```bash
rg -n "functionName" apps/** packages/**
rg -n "export.*ComponentName" apps/web/src
rg -n "export const (GET|POST)" apps/api
find . -name "*.test.ts" -o -name "*.spec.ts"
find . -name "*.config.*" -type f
```

## Definition of Done

Before any PR:
- [ ] `[package-manager] typecheck` passes
- [ ] `[package-manager] test` passes
- [ ] `[package-manager] build` passes
~~~~

---

## Section Guidelines

### Project Snapshot
- State the repo type clearly
- List primary tech, not every dependency
- Point to sub-files for details

### Root Commands
- Only root-level commands
- Package-specific commands go in sub-files
- Use the actual package manager

### JIT Index
- Link to sub-AGENTS files
- Include copy-paste-ready search commands
