# Handoff — Execução do Plano v2 (correção pós-auditoria)

**Data:** 2026-07-19
**Estado:** `READY-FOR-MARIA-REVIEW` — confirmado por revisor independente (2 rondas: FAIL com 4 defeitos → todos corrigidos → PASS).
**Nada commitado. Nenhuma migration aplicada.** Migrations continuam drafts até ao cutover.

## O que foi feito (tudo verificado)

**Fase A — trust boundary:** `server-only` + `createServiceClient` em `lib/supabase/admin.ts`; 7 caminhos migrados do anon client para service client, cada um com autorização própria (Clerk+ownership, admin allowlist, **capability token HMAC** novo em `lib/orders/token.ts` para guests, chave EuPago fail-closed no webhook); mutations críticas exigem exatamente 1 row (mbway/multibanco/webhook); rota de status deixou de permitir enumeração anónima de encomendas; carrinho passa o token aos pagamentos e ao polling.

**Fase B — pricing autoritativo:** `lib/pricing.ts` (cêntimos, tier determinístico: maior `min` aplicável vence, duplicado = erro de config); `/api/orders` POST deriva TODOS os valores do servidor e só compara os do cliente para UX (`total_mismatch` 400); PDP sem scaling proporcional (tiers por variante, fetch para todas as irmãs); carrinho recalcula `unitPrice` ao mudar quantidade e ao fundir linhas (snapshot `basePrice`+`tiers`); PDP espelha exatamente a regra do servidor (fix D3).

**Fase C — migrations (drafts):**
- `20260718090000` T5: drop das 5 policies permissivas + das 5 policies `auth.uid()` mortas (fix D1) em customers/shipping_addresses/orders/order_items/email_logs; shipping tables fechadas (FOR ALL + SELECT público); **REVOKE de `create_complete_order` + 2 RPCs admin a PUBLIC/anon/authenticated, GRANT só service_role; `SET search_path`** (F-02).
- `20260718090100` T6: drop do INSERT anónimo em product_reviews/product_analytics, sem policies mortas.
- `20260719100000`: cria categorias `expositores` + `sinaletica` (decisão Gate 0; unique em `slug` provado live — fix D2).

**Fase D:** slugs da nav corrigidos (`caixas-acrilico`, `molduras-acrilico`, `tombolas-acrilico`); domínio único via `getSiteUrl()` (canónico `loja.jocril.pt`) em eupago/layout/robots/sitemap; MEMORY_INDEX curado restaurado + removido do generator (`.indexing.config.json`); pesquisa sem query default; `loading.tsx` em /produtos; README (envs + modos de falha); `.nvmrc`/`engines`; line-endings normalizados.

## Provas (gate local)
- `bun test`: **19/19 pass** (pricing 12 + token 7)
- `bun run build`: **exit 0**
- `git diff --check`: limpo
- Diff ⊆ allowlist do plano v2
- Revisão independente: PASS (defeitos D1-D4 corrigidos e re-verificados)
- DB live provada: drafts NÃO aplicadas; anon ainda lê orders/customers (cutover urgente); `price_tiers` vazia; unique constraint em categories.slug existe

## Notas não-bloqueantes (do revisor, para consciência)
- Token guest viaja em `?t=` no polling (pode ficar em access logs) — mitigável com header em follow-up.
- Rota de status: 403 vs 404 é um oráculo de existência para users autenticados (baixo risco).
- Carrinhos persistidos antigos mantêm o preço congelado até re-adicionar (compat intencional).
- Portes validados por allow-list de valor, não por método (design pré-existente).

## PRÓXIMO PASSO — Cutover (ordem FIXA, plano v2)
1. Maria revê o diff (`git status` / `git diff`) e autoriza commit.
2. Maria **roda a chave service_role** + atualiza `.env.local`/Vercel (provar que a antiga morreu).
3. Commit + deploy do código (compatível com RLS antigo E novo — funciona já antes das migrations).
4. Smoke pré-migration no ambiente alvo (checkout guest sandbox, status, admin).
5. **"Go" explícito da Maria** → aplicar as 3 migrations pela ordem dos timestamps.
6. Provas pós-migration (queries no fim da T5: pg_policies zero rows, has_function_privilege false; anon negado; checkout guest OK; callback válido muda 1 row; idempotência).
7. `DB-CUTOVER-VERIFIED` → purga da chave do histórico git (operação separada, coordenada).

## Envs obrigatórias na Vercel (modo de falha no README)
`NEXT_PUBLIC_SITE_URL=https://loja.jocril.pt` · `EUPAGO_API_KEY` (sem ela o webhook rejeita TUDO) · `EMAIL_FROM` (domínio verificado no Resend) · `RESEND_API_KEY` · `SUPABASE_*` (chave NOVA pós-rotação) · `CLERK_*` + `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/conta` · `ADMIN_EMAIL(S)`.

**Fontes:** plano `../2026-07-18/2026-07-19_correction-execution-plan-v2.md` · review adversarial `..._adversarial-review.md` · auditoria-base `2026-07-19_post-overnight-audit.md`.
