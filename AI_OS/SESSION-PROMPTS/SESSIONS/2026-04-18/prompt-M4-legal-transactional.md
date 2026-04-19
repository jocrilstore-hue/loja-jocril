---
🎯 Model: Sonnet 4.6 — adaptive thinking, effort: medium
Why: template instantiation. LegalPage does the heavy lifting; the 5 legal pages are thin wrappers.
---

# Session M4 — Legal + transactional pages

## Pre-read

1. Plan §6 M4
2. `_design_src/.../store/LegalPage.jsx` — the template
3. `_design_src/.../store/PoliticaPrivacidade.jsx`, `PoliticaCookies.jsx`, `PoliticaDevolucoes.jsx`, `PoliticaEnvios.jsx`, `TermosCondicoes.jsx` — all 5 legal pages
4. `_design_src/.../store/NotFound.jsx`, `ServerError.jsx`, `Maintenance.jsx`
5. `_design_src/.../store/TransactionalShell.jsx`

## Deliverables

### 1. Port shared components (first)

- `components/legal/LegalPage.tsx` — props `{ kicker, title, intro, updated, sections: {title, body}[] }`. Sticky ToC rail on desktop, collapses <=640px.
- `components/TransactionalShell.tsx` — layout for 404/500/maintenance

### 2. Legal routes (5)

| Route | Source |
|---|---|
| `app/(store)/legais/privacidade/page.tsx` | `PoliticaPrivacidade.jsx` |
| `app/(store)/legais/cookies/page.tsx` | `PoliticaCookies.jsx` |
| `app/(store)/legais/devolucoes/page.tsx` | `PoliticaDevolucoes.jsx` |
| `app/(store)/legais/envios/page.tsx` | `PoliticaEnvios.jsx` |
| `app/(store)/legais/termos/page.tsx` | `TermosCondicoes.jsx` |

Each is a thin wrapper: `export default () => <LegalPage kicker="…" title="…" sections={[...]} />`
Content Portuguese verbatim from the prototype.

### 3. Transactional routes

| Route | Source | Notes |
|---|---|---|
| `app/not-found.tsx` | `NotFound.jsx` | Next.js catch-all |
| `app/error.tsx` | `ServerError.jsx` | Must be `'use client'`, accepts `{ error, reset }` |
| `app/manutencao/page.tsx` | `Maintenance.jsx` | Standalone |

## Verification

- `npm run build` passes
- All 5 legal routes load; ToC links scroll to sections
- Deliberately visit `/does-not-exist` → NotFound renders
- `/manutencao` loads

## Git

`M4: legal pages + transactional (404, 500, maintenance)`

## Handoff

`AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/..._jocril_M4_handoff.md`
