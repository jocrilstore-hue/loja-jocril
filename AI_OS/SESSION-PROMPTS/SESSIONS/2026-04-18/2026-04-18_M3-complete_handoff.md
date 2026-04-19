# M3 Complete Handoff — 2026-04-18

## Goal
Port all admin back-office pages (M3a product axis, M3b operations axis) from prototype JSX to Next.js 16 TSX. Faithful 1:1 port, inline styles, CSS custom properties, Portuguese strings preserved.

## Completed

### M3a — Product axis
- `app/admin/page.tsx` — Dashboard with KPI grid, charts stub, recent orders table
- `app/admin/produtos/page.tsx` — Product list with filter/sort, stock badges, multiselect
- `app/admin/produtos/novo/page.tsx` — New product form (redirects to form)
- `app/admin/produtos/[id]/page.tsx` — Product edit form, FormCard sections, FieldSelect, ToggleSwitch
- `app/admin/produtos/[id]/variante/[vid]/page.tsx` — Variant edit form
- `app/admin/produtos/[id]/variante/novo/page.tsx` — New variant form
- `app/admin/escaloes-preco/page.tsx` — Price tiers overview table
- `components/admin/AdminShell.tsx` — Shell with sidebar, breadcrumbs, top bar
- `components/admin/styles.ts` — `adminPrimary`, `adminGhost`, `adminDanger` button styles
- `app/admin/layout.tsx` — Admin layout wrapper

### M3b — Operations axis
- `app/admin/login/page.tsx` — Standalone dark split-screen login with 2FA digit boxes
- `app/admin/clientes/page.tsx` — Customer list with KPI strip, filter/sort, multiselect table
- `app/admin/clientes/[id]/page.tsx` — Customer detail: KPIs, orders, address, notes, activity
- `app/admin/encomendas/page.tsx` — Orders list: status tabs, baseForTabs counts, bulk actions bar
- `app/admin/encomendas/[id]/page.tsx` — Order detail: items+totals, timeline, notes, sidebar cards
- `app/admin/definicoes/page.tsx` — Settings hub: identity form + config groups grid with Link cards
- `app/admin/definicoes/envios/page.tsx` — Shipping: zones table, carriers table, global rules
- `app/admin/definicoes/descontos/page.tsx` — Discounts: filter tabs, codes table, global rules
- `app/admin/definicoes/impostos/page.tsx` — VAT: IVA rates table, regime fiscal FormRows
- `app/admin/definicoes/equipa/page.tsx` — Team: users table, roles matrix, security settings
- `app/admin/definicoes/escaloes/page.tsx` — Tiers: stats strip, tiers table, auto-upgrade settings
- `app/admin/emails/page.tsx` — Email gallery: sidebar template list, inline preview placeholder
- `app/admin/componentes/page.tsx` — Component showcase: 8 sections with live demos
- `components/admin/SettingsHelpers.tsx` — Shared: PageHeader, SettingsTabs, FormRow, AdminInput, AdminToggle
- `components/admin/ComponentLibrary.tsx` — Shared: DataTable, FilterBar, Drawer, Modal, ToastStack, EmptyState, Skeleton, DropdownMenu, Badge

## Build state
`npm run build` passes clean — 33 routes, 0 TypeScript errors, 0 warnings.

## Routes added in M3
```
/admin                          (dashboard)
/admin/login
/admin/produtos                 (list)
/admin/produtos/novo
/admin/produtos/[id]            (edit)
/admin/produtos/[id]/variante/[vid]
/admin/produtos/[id]/variante/novo
/admin/escaloes-preco
/admin/clientes
/admin/clientes/[id]
/admin/encomendas
/admin/encomendas/[id]
/admin/definicoes
/admin/definicoes/envios
/admin/definicoes/descontos
/admin/definicoes/impostos
/admin/definicoes/equipa
/admin/definicoes/escaloes
/admin/emails
/admin/componentes
```

## Must NOT be broken
- All M2 storefront routes still build and render (confirmed via `npm run build`)
- `AdminShell.tsx` `AdminActiveKey` union now includes `"tiers"` — do not remove it
- `SettingsHelpers.tsx` is "use client" (AdminToggle uses useState) — settings pages must import from this file
- `ComponentLibrary.tsx` exports `Badge` with `tone: "accent"|"warn"|"danger"|"neutral"` — used in componentes page
- `AdminCard` requires `title: string` prop — all usages must supply it (even empty string for untitled cards)

## Next step
**M4** — Legal & transactional pages: `/termos`, `/privacidade`, `/cookies`, `/acessibilidade` + transactional email templates (EmailOrderReceived, EmailOrderConfirmed, etc.) as proper React components.

Prompt at: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-18/prompt-M4-legal-transactional.md`

## Open questions
- Email template components (EmailOrderReceived etc.) were not ported in M3b — placeholder preview used in `/admin/emails`. Will need real components when M4 email templates are built.
- `/admin/login` has no auth logic — standalone shell only, as per port-only brief.
- Mock data is all inline / module-level. No DB abstraction planned until M5.
