---
🎯 Model: Opus 4.7 (claude-opus-4-7) — adaptive thinking, effort: high
Why: admin pages have complex filter/sort/multi-select state + 6-tab forms. Opus handles the coordination safer; Sonnet is fine for simpler pages if you want to split.
---

# Session M3 — Admin back-office

## Pre-read (MUST)

1. Plan: `C:\Users\maria\.claude\plans\write-down-a-plan-quiet-ember.md` §4, §6 M3
2. `LOJA-ONLINE\CLAUDE.md`
3. M1 handoff doc — know which primitives are already ported
4. M2 handoff doc — pattern confirmed
5. `_design_src/.../store/AdminShell.jsx` — full read, understand sidebar active keys
6. `_design_src/.../store/AdminProductForm.jsx` — the form you already know from M1; port to production TSX

## Prerequisites

- `components/admin/AdminShell.tsx`, `Field.tsx`, `FieldSelect.tsx`, `FieldTextarea.tsx`, `FormCard.tsx`, `ToggleSwitch.tsx`, `RichTextEditor.tsx`, `AdminCard` (from AdminShell.tsx), `styles.ts` — all built in M1.

## Layout strategy

- Create `app/admin/layout.tsx` that calls `<AdminShell>` — BUT AdminShell takes `active` + `breadcrumbs` props per page. So the layout should NOT be AdminShell directly. Instead:
  - `app/admin/layout.tsx` = simple passthrough (maybe just `<>{children}</>`)
  - Each page renders `<AdminShell active="..." breadcrumbs={[...]}>...</AdminShell>`
  - Exception: `app/admin/login/page.tsx` has NO shell (standalone admin login)

## Deliverables

### M3a — product axis

| Route | Source | Notes |
|---|---|---|
| `app/admin/page.tsx` | `AdminDashboard.jsx` | KPI cards, sparklines, recent orders |
| `app/admin/produtos/page.tsx` | `AdminProducts.jsx` | List + filters + sort + multi-select |
| `app/admin/produtos/novo/page.tsx` | `AdminProductForm.jsx` (create mode) | 6 tabs, passes no id |
| `app/admin/produtos/[id]/page.tsx` | `AdminProductForm.jsx` (edit mode) | 6 tabs with mock data |
| `app/admin/produtos/[id]/variante/novo/page.tsx` | `AdminVariantForm.jsx` | 7 sections |
| `app/admin/produtos/[id]/variante/[vid]/page.tsx` | `AdminVariantForm.jsx` | same, edit mode |
| `app/admin/escaloes-preco/page.tsx` | `AdminPriceTiers.jsx` | Tier editor |

### M3b — operations axis

| Route | Source | Notes |
|---|---|---|
| `app/admin/login/page.tsx` | `AdminLogin.jsx` | NO AdminShell, standalone |
| `app/admin/clientes/page.tsx` | `AdminCustomers.jsx` | List + filters |
| `app/admin/clientes/[id]/page.tsx` | `AdminCustomerDetail.jsx` | Read-only view |
| `app/admin/encomendas/page.tsx` | `AdminOrders.jsx` | List + status filters |
| `app/admin/encomendas/[id]/page.tsx` | `AdminOrderDetail.jsx` | Timeline view |
| `app/admin/definicoes/page.tsx` | `AdminSettings.jsx` | Hub |
| `app/admin/definicoes/envios/page.tsx` | `AdminSettingsShipping.jsx` | Zones + rates |
| `app/admin/definicoes/descontos/page.tsx` | `AdminSettingsDiscounts.jsx` | Coupon rules |
| `app/admin/definicoes/impostos/page.tsx` | `AdminSettingsTaxes.jsx` | IVA table |
| `app/admin/definicoes/equipa/page.tsx` | `AdminSettingsTeam.jsx` | Team members |
| `app/admin/definicoes/escaloes/page.tsx` | `AdminSettingsTiers.jsx` | Tiers config |
| `app/admin/emails/page.tsx` | `EmailGalleryPage.jsx` | 7 email previews |
| `app/admin/componentes/page.tsx` | `AdminComponentsPage.jsx` | Component gallery (mostly static showcase) |

## When to extract

If you see the same filter+sort+multi-select scaffold in AdminProducts + AdminCustomers + AdminOrders → extract `hooks/useTableFilter.ts` and `components/admin/DataTable.tsx` + `components/admin/FilterBar.tsx`. Do it the second time you'd duplicate, not the first.

## Port philosophy — same as M1/M2

Keep inline styles, CSS custom properties, Portuguese copy. `'use client'` where hooks are used.

## Verification

- `npm run build` passes after each axis
- `npm run dev`; navigate each admin route; confirm active sidebar item, breadcrumbs, form tabs work
- EmailShell (referenced by `/admin/emails`) — if not yet built, port it now to `components/email/EmailShell.tsx`

## Git commits

- `M3a: admin product axis — dashboard, products, forms, variants, price tiers`
- `M3b: admin operations axis — customers, orders, settings, emails, components gallery`

## Handoff

`AI_OS/SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/..._jocril_M3_handoff.md`
