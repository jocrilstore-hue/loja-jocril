---
🎯 Model: Opus 4.7 — adaptive thinking, effort: high
Why: marketing site is the brand's public face. Visual fidelity is paramount.
Location: `C:\Users\maria\Desktop\pessoal\jocril\site-marketing\` (NOT LOJA-ONLINE/)
---

# Session M_MKT — Port marketing site

## Pre-read

1. Plan §6 M_MKT
2. `LOJA-ONLINE\_design_src\jocril-design-system\project\ui_kits\marketing_site\README.md` (if exists)
3. `LOJA-ONLINE\_design_src\jocril-design-system\project\ui_kits\marketing_site\index.html`
4. All 8 JSX in that folder: `App.jsx`, `Header.jsx`, `Hero.jsx`, `Badge.jsx`, `Button.jsx`, `PortfolioGrid.jsx`, `ServiceRow.jsx`, `ContactBlock.jsx`

## Location

ALL work happens in `C:\Users\maria\Desktop\pessoal\jocril\site-marketing\`, NOT LOJA-ONLINE.
Do NOT import from `LOJA-ONLINE/`. The marketing site is a standalone Next.js project.

## Prerequisites

- `site-marketing/` already scaffolded in M0b (git branch `feature/jocril-port`)
- Tokens loaded via `public/styles/colors_and_type.css`
- Geist fonts in `public/fonts/`
- 36 assets in `public/assets/`

## Deliverables

### components/ (in site-marketing/)

- `Header.tsx` — sticky nav, theme toggle, logo, hamburger mobile
- `Hero.tsx` — full-viewport hero, IDEIAS & PRECISÃO
- `Badge.tsx` — dot + mono label (duplicated from shop — each project standalone)
- `Button.tsx` — pill + outline variants
- `PortfolioGrid.tsx` — dashed-frame cards with filter
- `ServiceRow.tsx` — numbered rows with hover image reveal
- `ContactBlock.tsx` — full-bleed contact panel
- `Footer.tsx` — bottom strip
- (optional) `StoreThemeProvider.tsx` or inline theme state in Header

### app/

- `app/layout.tsx` — already scaffolded in M0b; extend if needed
- `app/page.tsx` — replace M0b stub with the one-page marketing site (Header + Hero + Portfolio + Services + Contact + Footer)

## Constraints

- Port philosophy same as LOJA-ONLINE: inline styles verbatim, CSS custom properties, Portuguese copy verbatim.
- Dark theme default, light toggle in Header.
- Mobile responsive (640px breakpoint) — prototype has its own responsive rules, port from the compiled CSS or re-derive from the `index.html` media queries.

## Verification

- `cd site-marketing && npm run build` passes
- `npm run dev` on port 3001 — all sections render
- Dark→light theme toggle works
- Mobile viewport (375px) in DevTools — no horizontal scroll

## Git

- `git checkout feature/jocril-port` (already on it from M0b)
- Commit: `M_MKT: marketing site port — Hero, Portfolio, Services, Contact`

## Handoff

`site-marketing/AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/..._jocril_M_MKT_handoff.md`
