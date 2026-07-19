# Jocril LOJA-ONLINE

Loja online da Jocril (materiais para ponto de venda e hotelaria — acrílico e madeira). Next.js 16 (App Router) + Supabase + Clerk + EuPago (Multibanco/MB Way) + Resend.

## Comandos

```bash
bun install       # dependências
bun run dev       # desenvolvimento (Turbopack, porta 3000)
bun run build     # build de produção — tem de passar limpo antes de qualquer "done"
bun run start     # servidor de produção
bun test          # testes (tests/*.test.ts)
```

Node ≥ 20 (`.nvmrc` / `engines`).

## Variáveis de ambiente

Copiar `.env.local.example` → `.env.local` e preencher. **Todas as variáveis abaixo têm um modo de falha conhecido se faltarem em produção:**

| Variável | Se faltar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | app não arranca / catálogo vazio |
| `SUPABASE_SERVICE_ROLE_KEY` | checkout, pagamentos, webhook e admin falham (e os order tokens não assinam) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | auth não funciona |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/conta` | redirect pós-registo errado |
| `EUPAGO_API_KEY` | **webhook rejeita TODOS os callbacks (fail-closed) → encomendas nunca marcadas como pagas** |
| `EUPAGO_BASE_URL` | default produção (`clientes.eupago.pt`); sandbox: `https://sandbox.eupago.pt` |
| `NEXT_PUBLIC_SITE_URL` | callbacks EuPago/OG/sitemap usam o fallback `https://loja.jocril.pt` — tem de bater com o domínio real |
| `EMAIL_FROM` | emails de encomenda não são enviados (erro logado); form de contacto devolve 500 |
| `RESEND_API_KEY` | rota de encomendas crasha no cold start (Resend atira sem chave) |
| `ADMIN_EMAIL` | admin não recebe notificações de encomenda |
| `ADMIN_EMAILS` / `NEXT_PUBLIC_ADMIN_EMAILS` | allowlist do backoffice |

## Deploy (Vercel)

1. Definir TODAS as env vars acima (Production + Preview).
2. `NEXT_PUBLIC_SITE_URL` = domínio final (canónico: `https://loja.jocril.pt`).
3. Verificar domínio de envio no Resend e apontar `EMAIL_FROM` para ele.
4. **Migrations RLS** (`supabase/migrations/202607*`): aplicar SÓ depois do deploy do código compatível — ver ordem de cutover em `AI_OS/SESSION-PROMPTS/SESSIONS/2026-07-18/2026-07-19_correction-execution-plan-v2.md` (rotação de chave → deploy → smoke → go → migrations → provas).
5. Smoke test pós-deploy: checkout guest (Multibanco + MB Way sandbox), página de estado da encomenda, callback de teste do EuPago, email de confirmação.

## Segurança (modelo)

- Browser usa apenas a **anon key**; após o cutover RLS, as tabelas de PII/encomendas não têm policies anon — todo o acesso passa por rotas server-side com o service-role client, cada uma com a sua autorização (Clerk ownership, allowlist admin, **order capability token** para guests, chave EuPago no webhook).
- Preços são SEMPRE derivados no servidor (`lib/pricing.ts`); valores do cliente servem só para detetar carrinho desatualizado.
- Matriz de autorização por rota: ver plano v2 (link acima), Fase A.

## Estrutura

- `app/(store)` loja pública · `app/admin` backoffice · `app/api` rotas (orders, payment, webhooks, admin)
- `lib/` supabase clients, pricing, tokens, email, EuPago, queries
- `supabase/migrations/` schema + RLS (drafts 202607* pendentes de cutover)
- `AI_OS/` memória do projeto (decisões, handoffs, planos)
