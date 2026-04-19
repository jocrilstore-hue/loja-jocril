# B5–B8 Master Plan — Jocril LOJA-ONLINE

**Date:** 2026-04-19  
**State entering this plan:** B1–B4b complete on `main`. Storefront + auth + cart + checkout fully wired.

---

## Execution order

```
Wave 1 — PARALLEL (no shared files)
  ├── Agent A → B5: Customer account pages
  └── Agent B → B6: Admin writes (API mutations + form wiring)

  Human gate before Wave 2:
  └── Maria sets RESEND_API_KEY in .env.local (or chooses alt provider)

Wave 2 — SEQUENTIAL
  └── B7: Transactional emails (3 call sites + email infra)

Wave 3 — SEQUENTIAL
  └── B8: Vercel deploy
```

---

## Wave 1 — Parallel split

| | Agent A — B5 | Agent B — B6 |
|---|---|---|
| **Scope** | `/conta`, `/encomendas`, `/encomenda/[id]` | Admin mutation APIs + existing form wiring |
| **Files touched** | `app/(store)/conta/`, `app/(store)/encomendas/`, `app/(store)/encomenda/[id]/` | `app/api/admin/**`, `app/(admin)/admin/produtos/**`, `app/(admin)/admin/encomendas/**` |
| **APIs consumed** | `GET /api/orders` (already built) | New: `POST/PATCH/DELETE /api/admin/products`, `POST/PATCH/DELETE /api/admin/products/[id]/variants`, `PATCH /api/admin/orders/[id]/status` |
| **Auth** | Clerk `currentUser()` server component | `userIsAdmin()` from `lib/auth/permissions.ts` |
| **Model** | Sonnet 4.6 @ high | Opus 4.7 @ high |
| **Prompt** | `2026-04-19_B5_customer-account.md` | `2026-04-19_B6_admin-writes.md` |
| **Dependency** | None | None |

**These agents can run in separate Claude Code sessions simultaneously.**  
Both commit to `main` when done.

---

## Wave 2 — B7: Transactional emails

**Human gate:** Before starting, Maria must:
1. Create a [Resend](https://resend.com) account and get an API key
2. Set `RESEND_API_KEY=re_...` in `.env.local`
3. Set `EMAIL_FROM=encomendas@jocril.pt` (or whatever sending address is verified in Resend)

**Scope:**
- Install `resend` package
- Create `lib/email/send.ts` with 3 functions: `sendOrderConfirmation`, `sendAdminNotification`, `sendPaymentReceived`
- Simple HTML email bodies (or React Email — see prompt for decision)
- Re-wire 3 stripped call sites in `app/api/orders/route.ts` and `app/api/webhooks/eupago/route.ts`
- Fire-and-forget (don't await in request handler)

**Note:** Invoice/receipt generation is out of scope. Portugal requires certified billing software (PHC or equivalent). The emails are confirmation-only, not legal documents.

**Prompt:** `2026-04-19_B7_emails.md`  
**Model:** Sonnet 4.6 @ high

---

## Wave 3 — B8: Deploy

Runs after B5+B6+B7 merged to `main`.

**Scope:**
- Verify `next.config.js` production settings
- Create `vercel.json` (env var mapping, headers, rewrites if needed)
- Produce env var checklist for Vercel dashboard
- Register Eupago webhook URL at `https://[production-domain]/api/webhooks/eupago`
- Configure Clerk production instance + allowed origins
- Verify Supabase RLS policies allow production domain
- Deploy to Vercel and smoke-test all critical paths

**Prompt:** `2026-04-19_B8_deploy.md`  
**Model:** Sonnet 4.6 @ high

---

## What must NOT break across all sessions

- B1 storefront read path (homepage, PLP, PDP, categorias)
- B2 auth gates (middleware, Clerk hooks)
- B3 cart context (localStorage, `useCart`)
- B4 checkout flow (`/carrinho` steps 1–3, all 5 API routes, webhook)

After each session: `npm run build` must pass clean.
