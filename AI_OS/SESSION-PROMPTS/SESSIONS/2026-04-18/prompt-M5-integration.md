---
🎯 Model: Opus 4.7 — adaptive thinking, effort: high
Why: cross-cutting audit across both projects. Judgement calls on what to fix vs defer.
---

# Session M5 — Integration, polish, final build (both projects)

## Pre-read

1. Plan §6 M5, §7 verification
2. All handoff docs for M0→M_MKT
3. `LOJA-ONLINE\_design_src\jocril-design-system\project\ui_kits\store\store-responsive.css` — breakpoints reference

## Scope

### LOJA-ONLINE
1. **Link audit** — grep every `href=` in `app/`. Confirm each resolves. Fix dangling `.html` or misspelled PT routes.
2. **Responsive audit** — load every route at 375 / 768 / 1400. Fix layout breaks. Use `store-responsive.css` as spec.
3. **Theme audit** — toggle dark/light on every route. Fix any hardcoded colors that don't switch.
4. **Portuguese QA** — grep for English strings in user-facing content. Flag/fix.
5. **Metadata** — add `generateMetadata` per page with PT `<title>` + `<meta description>`.
6. **Sitemap** — `app/sitemap.ts` listing all storefront routes.
7. **Robots** — `app/robots.ts` disallowing `/admin/*`.
8. **Images** — audit `<img>` → `next/image` where meaningful (portfolio grid, product cards).
9. **Build** — `npm run build` zero errors zero warnings.
10. **Lighthouse** — home + PDP + admin dashboard. Report scores (target Perf ≥ 85, A11y ≥ 95).

### site-marketing
Same audit subset (items 1-4, 9, 10 — no admin disallow).

## Deliverables

- All regressions fixed in both projects
- `app/sitemap.ts` and `app/robots.ts` in LOJA-ONLINE
- Updated `CLAUDE.md` with "how to run" + final route map
- Final handoff with completion checklist + Lighthouse scores

## Verification

- `npm run build` clean in BOTH projects
- `npm run start` in LOJA-ONLINE (port 3000) → every route in plan §4.1 resolves
- `npm run start` in site-marketing (port 3001) → landing renders
- claude-in-chrome screenshot tour of 10 key pages

## Git

- LOJA-ONLINE: `M5: integration + polish — links, responsive, theme, metadata, sitemap, robots`
- site-marketing: `M5: integration + polish`

## Handoff

Final handoff per project:
- `LOJA-ONLINE/AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/..._jocril_M5_handoff.md`
- `site-marketing/AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/..._jocril_M5_handoff.md`

Include: completion checklist, Lighthouse scores, known-deferred items (Supabase wiring, real search, payment, etc.).
