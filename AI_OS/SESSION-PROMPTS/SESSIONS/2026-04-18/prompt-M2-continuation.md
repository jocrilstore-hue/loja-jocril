---
🎯 Model: Sonnet 4.6 (claude-sonnet-4-6) — adaptive thinking, effort: high
Why: pattern-matched porting from prototype JSX to Next.js TSX. Home page already done — follow its pattern.
---

# Session M2 continuation — port remaining storefront pages

## Pre-read (MUST)

1. `C:\Users\maria\.claude\plans\write-down-a-plan-quiet-ember.md` — §4.1 (folder structure), §4.3 (port philosophy)
2. `LOJA-ONLINE\CLAUDE.md` — project rules
3. `LOJA-ONLINE\AI_OS\SESSION-PROMPTS\SESSIONS\2026-04-18\2026-04-18_M1_handoff.md` — shared primitives inventory
4. `LOJA-ONLINE\AI_OS\SESSION-PROMPTS\SESSIONS\2026-04-18\2026-04-18_M2-partial_handoff.md` — pattern established
5. `LOJA-ONLINE\app\(store)\page.tsx` and one of the home-section components (e.g. `components/store/FeaturedProducts.tsx`) — reference patterns

## Port philosophy (non-negotiable)

- **Faithful 1:1** from prototype JSX → TSX. Keep inline styles verbatim. Keep CSS custom properties.
- **Portuguese copy verbatim.** Do not translate.
- Replace `.html` hrefs with **Portuguese** Next.js routes.
- Replace `../../assets/...` with `/assets/...`.
- `'use client'` only where hooks or event handlers are actually used.
- Use `<Link>` from next/link for internal nav.
- Reuse `Button`, `Badge`, `Field`, etc. from `@/components/store/` and `@/components/admin/`.
- NO new libraries (no shadcn/ui, react-hook-form, zod, framer-motion).

## Behavioral rules (Karpathy Guardrails)

1. **Think before coding.** If prototype JSX has ambiguity, state your interpretation before porting.
2. **Simplicity first.** Minimum code to recreate the prototype. No speculative abstractions.
3. **Surgical changes.** Don't touch shared components in `components/`; if they need changes, stop and report.
4. **Goal-driven.** Each page ported = `npm run build` still passes + route renders in dev.

## Deliverables (in order)

### M2a — shopping spine (4 pages left)

| Route | File | Source JSX |
|---|---|---|
| `/produtos` | `app/(store)/produtos/page.tsx` | `_design_src/.../store/PLP.jsx` |
| `/produtos/[slug]` | `app/(store)/produtos/[slug]/page.tsx` | `_design_src/.../store/PDP.jsx` |
| `/carrinho` | `app/(store)/carrinho/page.tsx` | `_design_src/.../store/Cart.jsx` |
| `/pesquisa` | `app/(store)/pesquisa/page.tsx` | `_design_src/.../store/Search.jsx` |

### M2b — account spine (6 pages)

| Route | File | Source JSX |
|---|---|---|
| `/conta` | `app/(store)/conta/page.tsx` | `Conta.jsx` |
| `/encomenda/[id]` | `app/(store)/encomenda/[id]/page.tsx` | `OrderDetail.jsx` |
| `/login` | `app/(store)/login/page.tsx` | `Login.jsx` |
| `/recuperar-palavra-passe` | `app/(store)/recuperar-palavra-passe/page.tsx` | `PasswordReset.jsx` |
| `/confirmar-email` | `app/(store)/confirmar-email/page.tsx` | `EmailVerification.jsx` |
| `/newsletter-confirmado` | `app/(store)/newsletter-confirmado/page.tsx` | `NewsletterConfirmed.jsx` |

### M2c — content spine (7 pages)

| Route | File | Source JSX |
|---|---|---|
| `/categorias` | `app/(store)/categorias/page.tsx` | `Categorias.jsx` |
| `/sobre` | `app/(store)/sobre/page.tsx` | `Sobre.jsx` |
| `/processos` | `app/(store)/processos/page.tsx` | `Processos.jsx` |
| `/portfolio` | `app/(store)/portfolio/page.tsx` | `Portfolio.jsx` |
| `/faq` | `app/(store)/faq/page.tsx` | `FAQ.jsx` |
| `/contacto` | `app/(store)/contacto/page.tsx` | `Contacto.jsx` |
| `/sitemap` | `app/(store)/sitemap/page.tsx` | `Sitemap.jsx` |

## Process per page

1. Read the prototype JSX file in full. Note: component name, hooks used, shared-component imports (Badge/Button), mock data shape.
2. Identify any shared sub-components needed — if they're not already in `components/store/`, create them there.
3. Write the TSX page file. Start with `'use client'` if the prototype uses hooks.
4. Replace hrefs. Replace asset paths. Port inline styles verbatim.
5. After every 2-3 pages: `npm run build`. If fails, fix before continuing.

## Verification

- `npm run build` passes after every sub-spine (M2a, M2b, M2c)
- Spin up `npm run dev`; navigate each ported route; confirm visual match to prototype HTML (open the `.html` file in a browser next to the dev server for side-by-side)
- After all 17 pages: git commit + update handoff doc

## Handoff

Write: `AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/YYYY-MM-DD_HH-MM_jocril_M2_handoff.md`
List every page ported, routes verified, any new sub-components added to `components/store/`, and any gotchas (e.g. "PDP uses an image gallery pattern not covered by M1 primitives — extracted to components/store/ImageGallery.tsx").

## Git

Working on `feature/jocril-port`. Commit after each sub-spine with message:
- `M2a: shopping spine — PLP, PDP, Cart, Search`
- `M2b: account spine — Conta, OrderDetail, Login, auth helpers`
- `M2c: content spine — Sobre, Processos, Portfolio, FAQ, Contacto, Categorias, Sitemap`

Use the HEREDOC pattern with `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
