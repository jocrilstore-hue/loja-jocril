# Handoff — Run Noturno (código apenas, nada commitado)

**Data:** 2026-07-18 (manhã)
**Origem:** workflow `jocril-overnight-safe-fixes` (`wf_a49f6f66-1ee`).
**Nota importante:** o processo do workflow foi interrompido **antes** de escrever o handoff automático e correr a verificação final. As alterações de código LANDARAM na mesma. Este handoff foi escrito manualmente após verificação direta no disco.

## Estado real (verificado agora)
- ✅ **Build de produção VERDE** — `bun run build` → `BUILD_EXIT=0` (verificado esta manhã, não pela madrugada).
- ✅ **Nada commitado** — tudo uncommitted no working tree, como pedido. Revê com `git status` / `git diff`.
- ✅ Os **14 tasks executaram** — todos os ficheiros-alvo aparecem modificados/criados.

## Blockers de código — VERIFICADOS em profundidade
| Task | Estado | Evidência |
|---|---|---|
| T1 webhook fail-closed + `getSiteUrl()` | ✅ correto | `lib/payments/eupago.ts:256` rejeita se chave ausente ou não bate |
| T2 total recomputado no servidor | ✅ correto | `app/api/orders/route.ts` — recomputa subtotal(DB)/portes(allow-list)/total, 400 em mismatch, passa valores do servidor ao RPC |
| T4 chave hardcoded removida | ✅ correto | `scripts/sync-images.mjs` agora usa env + falha se faltar |

## Restantes tasks — presentes, compilam (revisão visual recomendada)
| Task | Ficheiro(s) | Nota |
|---|---|---|
| T3 email exige `EMAIL_FROM` + loga falhas | `lib/email/send.ts` (+70) | revisar |
| T5 migration RLS (DRAFT) | `supabase/migrations/20260718090000_...sql` (115 l) | **não aplicada** — revê + aplica |
| T6 migration anon-insert (DRAFT) | `supabase/migrations/20260718090100_...sql` (109 l) | **não aplicada** — revê + aplica |
| T7 página `/registar` | `app/(store)/registar/page.tsx` | usa `<SignUp>` |
| T8 banner cookie consent | `components/store/CookieConsent.tsx` + `app/(store)/layout.tsx` | revisar copy/estilo |
| T9 Livro de Reclamações | `components/store/StoreFooter.tsx` | diff grande (229 l) — **rever** |
| T10 esconder pagamentos mortos | `app/(store)/carrinho/page.tsx` | revisar |
| T11 erros de fetch | `lib/queries/products.ts`, `pdp.ts`, `produtos-client.tsx` | **diff grande (480 l) em produtos-client — rever com atenção; compila mas não foi testado em runtime** |
| T12 metadata OG | `app/layout.tsx` | revisar |
| T13 sync `.env.local.example` | `.env.local.example` | revisar |
| T14 polish | `FeaturedProducts.tsx`, `produtos/page.tsx`, etc. | revisar |

## ⚠️ Alterações FORA do plano (não são do run de código)
Estes NÃO fazem parte do plano noturno e parecem vir de tooling de indexação/memória do AI_OS — **rever/reverter à parte, não têm a ver com o lançamento**:
- `AI_OS/MEMORY_INDEX.md` (-117 linhas), novos `AI_OS/DOCS_INDEX.md`, `AI_OS/HANDOFF_INDEX.md`
- `.claude/settings.json`, `.indexing.config.json`, `.indexing-backup/`

## A FAZER DE MANHÃ (depende de ti — os "bicudos")
1. **Rotar** a chave `service_role` no Supabase (continua no histórico git) + **purgar do histórico**.
2. **Rever e APLICAR** as migrations T5 (RLS) e T6 (anon-insert) à DB real.
3. **Verificar domínio** no Resend + definir valor de `EMAIL_FROM`.
4. **Fixar domínio** + `NEXT_PUBLIC_SITE_URL` na Vercel (o helper `getSiteUrl()` depende disto).
5. **EuPago produção** — chave real + confirmar base URL.
6. **Confirmar slugs** de categoria contra a DB real (a nav pode não filtrar — não foi tocado).
7. Analytics/Sentry + rate limiting + cron de stock/reconciliação (infra).

## Como rever
```
git status
git diff                      # tudo uncommitted
git diff app/(store)/produtos/produtos-client.tsx   # o diff grande, ver primeiro
```
Build já verde. Testar o checkout localmente antes de considerar qualquer coisa fechada.

**Fonte:** `2026-07-18_overnight-execution-plan.md` · `2026-07-18_cold-review-launch-readiness.md`
