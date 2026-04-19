---
🎯 Model: Opus 4.7 (claude-opus-4-7) — adaptive thinking, effort: high
Why: admin mutations span multiple API routes with auth guards, Supabase schema introspection,
     form wiring across 6+ pages, and stock-locking patterns. Cost of mistakes = broken admin.
Cost note: expect ~1.3× Sonnet token spend. Escalate to xhigh only if high stalls on schema issues.
---

# Session B6 — Admin writes

## Pre-read (mandatory before touching any file)
1. `CLAUDE.md` in project root
2. `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B4a_handoff.md` (API patterns)
3. `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B5-B8_MASTER-PLAN.md`
4. `lib/auth/permissions.ts` (userIsAdmin pattern)
5. `app/api/orders/route.ts` (API pattern to follow)

## State entering this session
B1–B4b on `main`. Admin pages were ported as presentational in M3. They display data but form submissions do nothing. Admin read paths (product list, order list) may still use mock/Supabase read-only data.

## Behavioral Rules

### 1. Think Before Coding — No Silent Assumptions
- Before writing any mutation API, read the Supabase table schema first.
- Map every form field to its exact DB column. If uncertain, query Supabase to check.
- State assumptions before implementing. Wrong column = broken admin.

### 2. Simplicity First — Minimum Viable Code
- No extra validation beyond what was asked.
- No file upload, no image management in this session (images are already migrated).
- No role management, no price tier mutations — those are future.
- Portuguese strings verbatim.

### 3. Surgical Changes — Touch Only What You Must
- Wire existing form elements. Don't redesign the UI.
- Don't touch presentational components that aren't being wired.
- If a form field doesn't map to a DB column, leave it disabled or add a `// TODO` comment.

### 4. Goal-Driven Execution
After every new API route: test it manually or via curl before wiring the UI.
`npm run build` must pass before moving to next step.

---

## Phase 0 — Schema introspection (DO THIS FIRST)

Before writing a single line of mutation code, use the Supabase MCP tool or read migration files to confirm exact column names for:

```
products:        id, name, slug, description, category_id, featured, active, created_at
product_variants: id, product_id, sku, size_format, base_price_including_vat, stock_quantity, active
orders:          id, order_number, status, payment_status, paid_at, notes
```

The field `status` on orders — confirm the allowed values (likely: `pending`, `processing`, `shipped`, `delivered`, `cancelled`).

If columns differ from above, use the actual DB column names — not the names above.

---

## Phase 1 — Admin API routes

All admin API routes must:
1. Call `await userIsAdmin()` from `lib/auth/permissions.ts`
2. Return 403 if not admin
3. Use zod for body validation
4. Return consistent `{ success, data?, error? }` envelope

Create these routes:

### `app/api/admin/products/route.ts`
- `POST` — create product. Body: `{ name, slug?, description?, category_id?, featured?, active? }`
- `GET` — list products (if admin read path currently uses mock data, wire it here)

### `app/api/admin/products/[id]/route.ts`
- `PATCH` — update product. Body: partial of above fields.
- `DELETE` — soft delete (set `active = false`) or hard delete — check if orders reference products first. If FK constraints exist, soft delete only.

### `app/api/admin/products/[id]/variants/route.ts`
- `POST` — create variant. Body: `{ sku, size_format, base_price_including_vat, stock_quantity, active? }`

### `app/api/admin/products/[id]/variants/[variantId]/route.ts`
- `PATCH` — update variant. Body: partial of above.
- `DELETE` — soft delete (set `active = false`).

### `app/api/admin/orders/[id]/route.ts`
- `PATCH` — update order status. Body: `{ status }`. Validate against allowed values. Add `paid_at` timestamp if status → `paid`.

---

## Phase 2 — Wire admin UI forms

For each page below: read the current file, identify the form submit handler (currently a no-op or `console.log`), and replace it with a `fetch()` call to the API route built in Phase 1.

### Product forms

`app/(admin)/admin/produtos/novo/page.tsx` (or similar path — use Glob to find)
- On submit → `POST /api/admin/products`
- On success → `router.push('/admin/produtos')` + show success toast/message
- On error → show error message inline

`app/(admin)/admin/produtos/[id]/edit/page.tsx`
- On mount → fetch current product data from Supabase (or via `GET /api/admin/products/[id]` if you build that, or directly from Supabase server client)
- On submit → `PATCH /api/admin/products/[id]`
- On success → `router.refresh()` or redirect

### Variant forms

`app/(admin)/admin/produtos/[id]/variantes/nova/page.tsx`
- On submit → `POST /api/admin/products/[id]/variants`

`app/(admin)/admin/produtos/[id]/variantes/[variantId]/edit/page.tsx`
- Pre-fill from current variant data
- On submit → `PATCH /api/admin/products/[id]/variants/[variantId]`
- Include `stock_quantity` field — this is stock management

### Order status

`app/(admin)/admin/encomendas/[id]/page.tsx`
- Find the status update control (dropdown or buttons)
- On change → `PATCH /api/admin/orders/[id]` with `{ status }`
- Refresh the page state after success

---

## Phase 3 — Admin reads (if still using mock data)

Quick check: does `/admin/produtos` currently show real Supabase data or hardcoded mock? Read the file.

If mock:
- `app/(admin)/admin/produtos/page.tsx` → wire to `SELECT * FROM products JOIN product_variants` via Supabase server client
- `app/(admin)/admin/encomendas/page.tsx` → wire to `SELECT * FROM orders JOIN customers JOIN order_items`

If already real: skip this phase.

---

## Phase 4 — Verify

```bash
npm run build   # must pass clean
```

Manual smoke test (requires admin Clerk account):
1. Sign in as admin → navigate to `/admin/produtos`
2. Click "Novo produto" → fill form → submit → confirm product appears in list
3. Edit that product → change name → save → confirm change persists
4. Navigate to `/admin/encomendas` → open an order → change status → confirm DB update

---

## Phase 5 — Handoff

Create: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B6_handoff.md`

Include:
- All API routes created (with accepted body + responses)
- All form pages wired
- Any schema surprises (column names that differed, FK constraints found)
- What must not be broken
- Next step

Update `docs/DOCS_INDEX.md`.

---

## Key patterns

```typescript
// Admin guard (every admin API route)
import { userIsAdmin } from '@/lib/auth/permissions';
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
if (!userId || !(await userIsAdmin())) {
  return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 403 });
}

// Supabase server mutation
const { data, error } = await supabase
  .from('products')
  .update({ name: 'new name' })
  .eq('id', id)
  .select()
  .single();
```

## CSS/style rules
- Inline styles only — no Tailwind conversion.
- Use existing admin component patterns from the page you're editing.
- For loading/error states, match the pattern already in the file.
