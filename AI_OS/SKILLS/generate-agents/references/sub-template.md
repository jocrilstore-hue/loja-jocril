# Sub-Folder AGENTS.md Template

Use this template for each major directory identified in Phase 1. These files should have more detail than the root.

---

## Template

~~~~markdown
# AGENTS.md — [Package/App Name]

[One-line description of what this package does]

## Stack

- **Framework**: [Primary framework]
- **Language**: [TypeScript/JavaScript/Python/etc.]

## Commands

```bash
[package-manager] --filter @repo/[name] dev
[package-manager] --filter @repo/[name] build
[package-manager] --filter @repo/[name] test
[package-manager] --filter @repo/[name] typecheck
[package-manager] --filter @repo/[name] lint
```

## Patterns & Conventions

- ✅ DO: Use real file examples from the package
- ✅ DO: Point to canonical entry points and helpers
- ❌ DON'T: Invent parallel patterns that the package does not already use

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | API client wrapper |
| `src/types/index.ts` | Shared types |
~~~~

---

## Section Guidelines

- Most of the value lives in real examples and real commands.
- Keep package files more detailed than the root.
- Prefer `rg` and `find` examples that work in the actual repo.
