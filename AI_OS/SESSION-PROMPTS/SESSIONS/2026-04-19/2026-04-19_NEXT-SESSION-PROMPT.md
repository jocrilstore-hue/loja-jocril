# Next-session starter prompt

Copy everything below the `---` into the new Claude Code session.

---

Continuing the Jocril LOJA-ONLINE backend wiring.

**Project:** `C:\Users\maria\Desktop\pessoal\jocril\LOJA-ONLINE`
**Branch:** `main` (clean, all work committed)
**Stack:** Next.js 16.2.3 LTS · React 19 · TypeScript strict · Tailwind 4.2.2 · Supabase (same prod DB as old project at `SITES/loja-jocril`).

**Read these first in order (10 sec each):**
1. `CLAUDE.md` — project rules (no scope creep, no new libs without asking, port philosophy).
2. `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/2026-04-18_BACKEND-WIRING_plan.md` — master plan, B0→B9.
3. `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B1-COMPLETE_handoff.md` — what's done, gotchas, file map, what's next.

**What's already live (don't re-do):**
- B0 · Supabase clients + 16 migrations copied
- B1a · Homepage featured products (DB-backed)
- B1b · PDP (variants, tiers, images, related)
- B1c · PLP (category filter + follow-up join for sku/material)
- B1d · `/categorias` (grouped via `lib/data/category-groups.ts`)
- B1e · Homepage CategoriesBlock (DB-backed)

**Adapter pattern locked:** DB shape (snake_case, template+variant split) → UI shape (`ProductMock`, flat PT camelCase) via `lib/adapters/`. UI types in `lib/types.ts` and `components/store/ProductCard.tsx` are not rewritten — everything funnels through adapters.

**Env ready:** `.env.local` is copied from the old project (Supabase, Eupago, Resend keys all set, same prod DB).

**Clerk is NOT installed yet** — B2 adds it.

---

## Pick one next

- **B2 — Clerk auth** (install `@clerk/nextjs`, wire `proxy.ts`, gate `/admin/*` `/conta` `/encomendas`). Unblocks auth-gated pages. Headless API for login/register so port visuals stay intact.
- **B3 — Cart state** (port `contexts/cart-context.tsx` from old project, localStorage-backed, replace mock `[{qty:3}]` in StoreHeader).
- **B4 — Checkout + Eupago** (depends on B3).
- **B5+ — Customer account, admin writes, admin ops, deploy.**

## Hard rules

1. **Ask before installing libraries.** Allowed already: `@supabase/supabase-js`, `@supabase/ssr`. Pre-approved for later: `@clerk/nextjs`, `zod`, `resend`.
2. **No scope creep.** Do only what's asked. No "while I'm here" cleanup.
3. **Port philosophy:** inline styles stay inline. No shadcn, no form libs, no framer-motion.
4. **Confirm before coding** for non-trivial work: list files + changes first, wait for sign-off.
5. **Verification before completion:** `npm run build` + runtime curl check for any wired page before claiming done.
6. **Git safety:** read-only git OK. Any write (commit, checkout, push) needs explicit permission.
7. **Stop after 2 failed fix attempts** — report status, don't spiral.

## First action for next session

1. `git log --oneline -10` to confirm current state.
2. State which B-milestone you're picking, list files you plan to touch, wait for my OK.
3. Then execute.

Portuguese is fine. I use voice dictation so read transcription artifacts charitably.
