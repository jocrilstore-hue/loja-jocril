---
🎯 Model: Sonnet 4.6 (claude-sonnet-4-6) — adaptive thinking, effort: high
Why: straightforward UI wiring — Clerk currentUser() + existing GET /api/orders. No novel architecture.
---

# Session B5 — Customer account pages

## Pre-read (mandatory before touching any file)
1. `CLAUDE.md` in project root
2. `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B4b_handoff.md`
3. `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B5-B8_MASTER-PLAN.md`

## State entering this session
B1–B4b complete on `main`. All storefront read paths live, checkout fully wired.

Relevant existing files (read before editing):
- `app/(store)/conta/page.tsx` — presentational port, mock data
- `app/(store)/encomendas/page.tsx` — presentational port, mock data (if exists; may be missing)
- `app/api/orders/route.ts` — GET handler: no params + auth → returns user's orders
- `lib/supabase/server.ts` — Supabase server client
- `middleware.ts` — `/conta` and `/encomendas` are already auth-gated

## Behavioral Rules

### 1. Think Before Coding — No Silent Assumptions
- State your assumptions BEFORE writing code. If uncertain, ASK.
- If the request has multiple valid interpretations, present them — don't pick silently.
- If something is unclear, STOP. Name the confusion. Ask.

### 2. Simplicity First — Minimum Viable Code
- Write the minimum code that solves the stated problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- Keep inline styles as-is — no Tailwind conversion, no CSS modules.
- Portuguese strings verbatim — do not translate.

### 3. Surgical Changes — Touch Only What You Must
- Don't refactor presentational code that isn't being wired.
- Match existing style of the file you're editing.
- Clean up only YOUR orphans.

### 4. Goal-Driven Execution
After each file change: `npm run build` must pass before continuing.

---

## Scope

Wire three pages using real data. No new features, no new API routes, no new libraries.

### Step 1 — Explore current state

Read these files:
```
app/(store)/conta/page.tsx
app/(store)/encomendas/page.tsx   (may not exist — check with Glob)
app/(store)/encomenda/[id]/page.tsx  (may not exist — check with Glob)
```

For each file that exists: identify what mock data it uses and what the component tree looks like.
For each file that is missing: create it fresh (see specs below).

### Step 2 — Wire `/conta`

Replace mock user data with real Clerk data.

```typescript
import { currentUser } from '@clerk/nextjs/server';
// ...
const user = await currentUser();
const name  = user?.fullName ?? user?.firstName ?? 'Cliente';
const email = user?.emailAddresses[0]?.emailAddress ?? '';
const since = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-PT') : '—';
```

Show: name, email, member since.
DO NOT wire address book or any feature beyond basic profile. Mark those sections with a `{/* TODO: B5b */}` comment if they exist in the presentational version.

### Step 3 — Wire `/encomendas`

Fetch user's orders from the existing API. This is a server component (no `'use client'`).

```typescript
// Server component — use server-side fetch or direct Supabase
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
```

**Or** use a client component with `useEffect` + `fetch('/api/orders')` if the presentational file is already a client component — match the existing pattern, don't switch paradigms.

Display: order number, date, status, total. Link each row to `/encomenda/[orderNumber]`.

If the user has no orders: show an empty state ("Ainda não tem encomendas.") with a link to `/produtos`.

### Step 4 — Create `/encomenda/[id]` order detail page

This page may not exist. If missing, create it at:
`app/(store)/encomenda/[id]/page.tsx`

Where `[id]` is the `order_number` (not the UUID). Use `GET /api/orders?order_number=[id]` to fetch.

Show:
- Order header: order number, date, status badge, payment status
- Items table: product name, SKU, size, quantity, unit price, total
- Shipping info: address block
- Totals: subtotal, shipping, total with VAT
- If `payment_status === 'pending'` and `payment_method === 'multibanco'`: show the entity/reference/amount from `orders.multibanco_entity`, `orders.multibanco_reference`, `orders.multibanco_amount` if those columns exist (check schema first — don't hardcode)

Keep the same inline-style patterns as the rest of the store.

### Step 5 — Verify

```bash
npm run build   # must pass clean, same route count or +1 if /encomenda/[id] was missing
```

Manual check: navigate to `/conta` and `/encomendas` in dev server, confirm no runtime errors in console.

### Step 6 — Handoff

Create: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-04-19/2026-04-19_B5_handoff.md`

Include:
- Files created/modified
- What each page now shows (real vs mock fields)
- Any schema columns that weren't found (flag for B8 verification)
- What must not be broken
- Next step

Update `docs/DOCS_INDEX.md` — add B5 handoff entry.

---

## Key patterns for this project

```typescript
// Server component auth pattern (Clerk)
import { currentUser, auth } from '@clerk/nextjs/server';
const user = await currentUser();           // full user object
const { userId } = await auth();            // just the ID

// Supabase server client
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();

// API fetch from server component (or just query Supabase directly)
const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/orders`, {
  headers: { cookie: request.headers.get('cookie') ?? '' },
  cache: 'no-store',
});
```

## CSS/style rules
- Inline styles only. `var(--color-*)` CSS custom properties.
- Typography classes: `.text-mono-xs`, `.text-mono-sm`, `.heading-1`, `.heading-2`, `.text-body`
- No new color hex — use existing vars from `public/styles/colors_and_type.css`
