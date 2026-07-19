# Plano de Execução Noturno — Jocril LOJA-ONLINE

**Data:** 2026-07-18 (run noturno autónomo)
**Base:** `2026-07-18_cold-review-launch-readiness.md`
**Princípio:** ordem invertida. Esta noite corre **só código** (não depende da Maria). De manhã a Maria trata dos "bicudos" (segredos, contas, DB real, domínios).

## Regras de execução (todas as tarefas)
- Uma tarefa = um subagente de contexto fresco, **sequencial** (sem paralelismo em ficheiros).
- **Build-gate:** correr `bun run build` (fallback `npm run build`) após cada tarefa. Verde obrigatório.
- **Two-strike:** 2 tentativas de correção; se continuar vermelho, o agente **reverte as suas próprias edições** (reescreve os ficheiros ao estado original — sem git destrutivo) para deixar o build verde, e marca a tarefa como `failed`.
- **SEM commits, SEM branches, SEM push, SEM git destrutivo.** Tudo fica uncommitted para revisão.
- Respeitar o port: inline styles + CSS vars, **sem novas libs**, strings PT verbatim, `next/link`, `'use client'` onde há estado. Não tocar em `_design_src/`.
- Handoff de manhã no fim.

## ✅ INCLUÍDO (autónomo, código)
| # | Tarefa | Ficheiros | Aceitação |
|---|--------|-----------|-----------|
| T1 | **Endurecer pagamento** — webhook EuPago falha fechado (exige chave presente; rejeita se ausente) + centralizar URL do site num helper e remover domínios hardcoded divergentes | `lib/payments/eupago.ts`, novo `lib/site-url.ts` | Webhook rejeita sem chave; URLs derivam de 1 fonte |
| T2 | **Recalcular total no servidor** — recomputar `subtotal = Σ(preço_DB×qtd)`, portes e `total` server-side; rejeitar 400 se o total do cliente divergir | `app/api/orders/route.ts` | Total do cliente nunca é confiado; mismatch → 400 |
| T3 | **Endurecer email** — exigir `EMAIL_FROM` (sem fallback silencioso para sandbox); logar falhas de envio | `lib/email/send.ts` | Sem `EMAIL_FROM` → erro claro; falhas logadas |
| T4 | **Tirar chave hardcoded** — ler `SUPABASE_SERVICE_ROLE_KEY`/URL de env (a *rotação* é da Maria) | `scripts/sync-images.mjs` | Zero segredos no ficheiro |
| T5 | **Migration RLS (DRAFT)** — apertar policies em `customers/orders/shipping_addresses/order_items/email_logs` (auth/service-role). **Não aplicar à DB** | nova `supabase/migrations/*_tighten_rls.sql` | SQL pronto para a Maria aplicar |
| T6 | **Migration anon-insert (DRAFT)** — fechar INSERT anónimo em `product_reviews`/`product_analytics` | nova migration | SQL pronto (não aplicado) |
| T7 | **Página de registo** `/registar` (`<SignUp>` Clerk, estilo do design) + alinhar URLs Clerk | `app/(store)/registar/page.tsx` | Cliente novo consegue registar-se |
| T8 | **Banner de cookie consent** (hand-rolled, inline styles, localStorage) ligado ao layout da loja | novo `components/store/CookieConsent.tsx`, `app/(store)/layout.tsx` | Banner aparece; política deixa de mentir |
| T9 | **Link Livro de Reclamações Eletrónico** (`livroreclamacoes.pt`) | `components/store/StoreFooter.tsx`, legais | Link presente |
| T10 | **Esconder métodos de pagamento não-funcionais** (cartão/transferência) no checkout | `app/(store)/carrinho/page.tsx` | Só MB/MBWay visíveis |
| T11 | **Superficializar erros de fetch** — estados de erro/vazio quando query falha (conservador) | `lib/queries/*`, componentes store | Falha do Supabase mostra mensagem, não página vazia |
| T12 | **Metadata raiz** — openGraph/twitter/metadataBase | `app/layout.tsx` | OG/twitter/metadataBase presentes |
| T13 | **Sincronizar `.env.local.example`** com os nomes reais do código | `.env.local.example` | Exemplo = realidade |
| T14 | **Polish** — contagem de produtos dinâmica, remover query default de `/pesquisa`, `engines`+`.nvmrc`, `README` com passos de deploy, `loading.tsx` em páginas async chave | vários | Cada item feito ou marcado |

## ⛔ EXCLUÍDO (manhã — depende da Maria)
- **Rotar** a chave `service_role` no Supabase + **purgar histórico git** (reescreve história).
- **Aplicar** as migrations T5/T6 à DB real.
- **Verificar domínio** no Resend + definir valor de `EMAIL_FROM`.
- **Fixar domínio** e definir `NEXT_PUBLIC_SITE_URL` na Vercel.
- **EuPago produção** — chave real + confirmar base URL de produção.
- **Confirmar slugs de categoria** contra a DB real (a nav pode não filtrar).
- Analytics/Sentry (contas), rate limiting (infra/lib), cron de reconciliação de stock/webhooks (infra).

## Saída
- Alterações uncommitted no working tree.
- Handoff: `AI_OS/SESSION-PROMPTS/SESSIONS/2026-07-18/2026-07-18_HH-MM_overnight-run-handoff.md` com done/failed por tarefa + estado do build + a lista de manhã.
