# Special Sections

Add these sections to sub-folder AGENTS.md files when applicable.

---

## Design System / UI Package

```markdown
## Design System

- **Components**: `packages/ui/src/components/**`
- **Tokens**: `packages/ui/src/tokens.ts` (never hardcode colors/spacing)
- **Storybook**: `pnpm --filter @repo/ui storybook`
```

---

## Database / Data Layer

```markdown
## Database

- **ORM**: [Prisma / Drizzle / TypeORM]
- **Schema**: `prisma/schema.prisma`
- **Migrations dir**: `prisma/migrations/`
```

---

## API / Backend Service

```markdown
## API Patterns

- **Routes**: `src/routes/**/*.ts` or `src/app/api/**`
- **Middleware**: `src/middleware/`
- **Schemas**: `src/schemas/`
- **Errors**: `src/lib/errors.ts`
```

---

## Testing Package

```markdown
## Testing

- **Framework**: [Jest / Vitest / Playwright]
- **Unit tests**: `*.test.ts` colocated with source
- **Integration**: `tests/integration/**`
- **E2E**: `tests/e2e/**`
```
