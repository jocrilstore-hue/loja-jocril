# Jocril LOJA-ONLINE — project rules

**CRITICAL — Read first, read last:**
1. Stop after 2 failed fix attempts. Report status, don't keep trying.
2. Breaking something that already works is worse than not fixing the new thing.
3. Do only what was asked. No scope creep, no "improvements," no touching adjacent code.

## AI_OS entry point

- This repo uses project-local `AI_OS/` for cross-tool continuity and session memory.
- Start general AI sessions from `AI.md` -> `AI_OS/SESSION-PROMPTS/AI_SESSION_START.md`.
- Use `AI_OS/MEMORY_INDEX.md` to rank hot workstreams, proven paths, failed approaches, and regression risks before opening long handoffs.
- This root `AGENTS.md` remains the primary Codex/coding-agent operational guide; nearest nested `AGENTS.md` wins when present.
- `CLAUDE.md` remains Claude-specific project guidance.
- Durable findings belong in `AI_OS/AI_DECISION_LOG.md` or dated handoffs, not only in chat history.

## Stack (April 2026)

- **Next.js 16.2.3 LTS** — App Router, React 19, Turbopack
- **TypeScript 5.x** — strict mode
- **Tailwind CSS 4.2.2** — loaded via `@tailwindcss/postcss`. Utilities only. The design uses CSS custom properties from `public/styles/colors_and_type.css` — not Tailwind classes.
- **lucide-react 1.8.0** — icons
- **Geist Sans + Geist Mono** — self-hosted woff2 at `public/fonts/`

## Port philosophy — faithful 1:1 from the Codex Design bundle

The source of truth is `LOJA-ONLINE/_design_src/jocril-design-system/project/` (gitignored).

1. **Keep inline styles.** JSX `style={{...}}` → TSX `style={{...}}`. No CSS modules, no Tailwind conversion, no styled-components. Only exception: the utility classes already in `colors_and_type.css` (`.text-mono-xs`, `.heading-1`, `.heading-2`, `.text-body`).
2. **Keep CSS custom properties.** `var(--color-*)`, `var(--font-geist-*)`. No hardcoded hex.
3. **Extract shared primitives only where the prototype duplicates them verbatim** (`Field`, `FieldSelect`, `FormCard`, `ToggleSwitch`, `Button`, `Badge`, `DataTable`). No premature abstractions.
4. **Preserve Portuguese strings verbatim.** Do not translate, do not "improve."
5. **Mock data stays inline** or in `lib/mock-data.ts` if reused 2+ times. No DB abstraction yet.
6. **`'use client'`** on any component with `useState`/`useEffect`/`useRef`/onClick.
7. **`next/link`** for all internal navigation. Portuguese URLs (`/produtos`, `/admin/produtos`, etc.).
8. **No new libraries** without approval: no shadcn/ui, no react-hook-form, no zod, no framer-motion.

## URL convention

Portuguese URLs throughout. See plan §4.1 at `C:\Users\maria\.Codex\plans\write-down-a-plan-quiet-ember.md` for the full route map.

## Build & verification

```bash
bun run dev       # development (Turbopack, port 3000)
bun run build     # production build — must pass clean
bun run start     # production server
```

After ANY code change: run `bun run build` before declaring done.

## Orchestration plan

This project is being built in milestones (M0 → M5). The full plan lives at:
`C:\Users\maria\.Codex\plans\write-down-a-plan-quiet-ember.md`

Handoff docs per milestone:
`AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/*_jocril_M{N}_handoff.md`

## Do NOT

- Touch `_design_src/` — it's the source of truth, read-only reference.
- Add libraries not in `package.json` without asking.
- Convert the inline-style port to Tailwind or CSS modules.
- Translate Portuguese copy.
- Run destructive git (reset --hard, force push, clean -f) — the global `Codex.local.md` blocks these.
