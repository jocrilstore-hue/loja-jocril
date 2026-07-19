# Plano de Execução v2 — Correção Pós-Auditoria (revisto após review adversarial)

**Data:** 2026-07-19
**Substitui:** `2026-07-19_correction-execution-plan.md` (v1 — REJEITADO pela review adversarial; preservado)
**Incorpora:** os 12 findings de `2026-07-19_correction-execution-plan_adversarial-review.md` (F-01..F-12)
**Âmbito:** *bounded correction* — não é "correção total" nem "launch ready". Estados: `READY-FOR-MARIA-REVIEW` → `READY-FOR-DB-CUTOVER` → `DB-CUTOVER-VERIFIED`. Rate limiting, stock recovery e E2E de produção ficam explícitos como blockers de lançamento fora deste plano (`not-in-correction-scope`).

---

## Correções da v1 aceites (mapa finding → mudança)

| Finding | Mudança na v2 |
|---|---|
| F-01 (P0) | A1 deixa de ser "swap de client". Passa a matriz de autorização por rota; capability token para guest payment/status; `import "server-only"` + client semântico `createServiceClient()`. |
| F-02 (P0) | Novo item obrigatório: `REVOKE` do RPC `create_complete_order` a `PUBLIC/anon/authenticated`, `GRANT` só a `service_role`, `SET search_path`; inventário de todos os `SECURITY DEFINER` (incl. `admin_apply_price_tiers`, `admin_save_product_template`). |
| F-03 (P0) | Ordem de cutover corrigida: aprovação → rotação chave/envs → commit/deploy código compatível → smoke → `go` DB → migrations → provas positivas E negativas. `merged` ≠ `deployed`. |
| F-04 (P0) | Pricing: o servidor DETERMINA o preço canónico (tier escolhido por regra determinística, cêntimos), nunca "aceita" valores do cliente. PDP/cart alinhados ao mesmo modelo. |
| F-05 | T6 reescrita: remover INSERT anon SEM recriar policies `authenticated` mortas. |
| F-06 | Mutations críticas de pagamento/webhook exigem exatamente 1 row afetada; zero-row ≠ success. |
| F-07 | Gates mecânicos: testes Bun targeted, validação local de migrations, `git diff --check`, allowlist de ficheiros, verificador independente read-only. Build nunca é suficiente sozinho. |
| F-08 | Antes de tocar migrations: provar project ref, consultar migration history; se drafts já aplicadas → migration corretiva nova, nunca reescrever. Método único e audível. |
| F-09 | Shipping: least privilege — bloquear também SELECT público (sem consumidor storefront atual); portes-da-DB é feature separada, fora desta correção. |
| F-10 | Slugs: só as 3 trocas inequívocas (`caixas→caixas-acrilico`, `molduras→molduras-acrilico`, `tombolas→tombolas-acrilico`). `Expositores`/`Sinalética` = `blocked-user-decision`. `category-groups.ts` verification-only. |
| F-11 | A6 removido até decisão: restaurar MEMORY_INDEX sem resolver o generator recria a perda no commit seguinte. |
| F-12 | Escopo separado em 3 contratos: correção local / cutover manual / follow-ups de lançamento. Cosmética (`error` vs `fetchError`) fora dos gates críticos, lista opcional. |

---

## GATE 0 — Decisões da Maria + baseline (NENHUMA alteração antes disto)

**Decisões (`blocked-user-decision`, cada uma com opções concretas):**
1. **`Expositores`/`Sinalética` na nav:** (a) mapear para categorias existentes (quais?), (b) remover os links, (c) criar as categorias na DB.
2. **Domínio canónico:** `loja.jocril.pt` | `www.jocril.pt` | outro.
3. **`MEMORY_INDEX.md`:** (a) curado → sai do generator (`.indexing.config.json`) e restaura-se o conteúdo do HEAD, (b) gerado → conteúdo curado migra para ficheiro próprio indexável.
4. **PDP em erro de DB:** manter 500/error-boundary (atual pós-run) ou voltar a 404.
5. **Ambiente de cutover:** project ref Supabase esperado + onde corre o deploy (Vercel env) — confirmar antes de qualquer operação DB.

**Baseline (capturar antes da primeira edição):**
`git status --short --branch` · `git diff --check` · `git diff --name-only` + allowlist · `bun run build` verde · smoke manual atual (guest checkout, list/detail autenticado, payment/status). Baseline vermelho = parar.

---

## FASE A — Trust boundary e checkout (código local)

1. **Client privilegiado:** `lib/supabase/admin.ts` → adicionar `import "server-only"`; expor `createServiceClient()` (nome semântico; alias mantém compat).
2. **Matriz de autorização por rota** (nenhum uso de service-role sem a linha correspondente):
   | Rota | Autorização |
   |---|---|
   | `/api/orders` GET/list/detail | Clerk + ownership (filtrado na query) |
   | `/conta`, `/encomendas`, `/encomenda/[id]` pages | Clerk + ownership na query |
   | `/api/orders` POST (guest create) | público, validação total server-side; rate-limit registado como blocker de lançamento |
   | `/api/payment/*` + `/api/orders/[n]/status` (guest) | **capability token** assinado (HMAC, expira, ligado a `order_id`), emitido na criação da encomenda |
   | `/api/webhooks/eupago` | chave EuPago (fail-closed, já feito) + validação de amount + transição de estado válida |
   | `/api/admin/*` | admin allowlist (já existe) |
3. **POST `/api/orders`** chama `create_complete_order` via service-role (deixa de depender do GRANT anon).
4. **Cardinalidade:** toda a mutation crítica (mbway, multibanco, webhook) exige exatamente 1 row afetada/devolvida; zero-row → erro, nunca success (F-06).
5. **Testes (Bun):** token ausente/errado/expirado; token de A não atua em B; Clerk user não lê encomenda alheia; guest só consulta o seu status; update zero-row falha.

## FASE B — Pricing autoritativo (código local)

1. Modelo fechado: tiers por `product_variant_id` (sem scaling proporcional a irmãs, salvo decisão de negócio explícita da Maria).
2. Função server-side pura: escolhe exatamente um tier por regra determinística (`min_quantity ≤ qty`, maior `min_quantity`; conflito → erro de configuração), calcula `unit_price`, `line_total`, subtotal, portes, total — **em cêntimos**.
3. Servidor passa APENAS valores server-derived ao RPC; valores do cliente servem só para UX/mismatch-warning.
4. PDP/cart alinhados: PDP carrega tiers da variante selecionada; cart recalcula ao mudar quantidade e ao fundir linhas.
5. Testes Bun: base, limites inclusivos, `max_quantity NULL`, variante irmã, sem tier, tiers sobrepostos, rounding/IVA.

## FASE C — Migrations (drafts + validação local; SEM aplicar)

1. Provar project ref + consultar `supabase_migrations.schema_migrations` (read-only) ANTES de editar: se T5/T6 já constarem, criar migrations corretivas novas.
2. **T5 reescrita:** schema-qualificada; remove policies PII `USING(true)` + policies Clerk-incompatíveis; remove `FOR ALL` E o SELECT público de shipping (F-09); **revoga `PUBLIC/anon/authenticated` dos RPCs privilegiados e concede só a `service_role`; `SET search_path = public, pg_temp` nos `SECURITY DEFINER`** (F-02).
3. **T6 reescrita:** remove INSERT anon; NÃO recria policies `authenticated`.
4. Validação local: cadeia completa de migrations numa DB local limpa; `pg_policies` vs matriz esperada; `has_function_privilege` vs matriz; chamadas anon negativas (PII, shipping write, RPC); fluxo positivo via app com service-role.

## FASE D — Correções independentes + T14 (código local)

1. As 3 trocas de slug inequívocas (F-10). `Expositores`/`Sinalética` só após decisão 1 do Gate 0.
2. `category-groups.ts`: verification-only (já contém os 6 slugs).
3. Site URL: unificar via `getSiteUrl()` (layout/robots/sitemap) com normalização de trailing slash — domínio final entra pela decisão 2.
4. T14 original: README (com envs + modos de falha), runtime Node (`engines`/`.nvmrc`), pesquisa vazia, `loading.tsx` essencial.
5. Lista cosmética opcional (fora dos gates): ternário `entrar`, naming `error`/`fetchError`, re-indentação.

## GATE LOCAL — `READY-FOR-MARIA-REVIEW`

Todos em conjunto: testes targeted verdes · `bun run build` verde · `git diff --check` limpo · diff ⊆ allowlist · cada finding aceite com teste observável · **revisão independente read-only** (novo Codex/agent, não self-audit) · migrations NÃO aplicadas · nada commitado.
→ Pausa: Maria revê, autoriza commit/deploy, resolve blockers manuais.

## CUTOVER MANUAL COORDENADO (ordem fixa — F-03)

1. Maria roda `service_role` + atualiza `.env.local`/Vercel; **provar que a chave antiga já não funciona**.
2. Commit/deploy do código (compatível com RLS antigo E novo).
3. Smoke runtime pré-migration no ambiente alvo.
4. Confirmar target DB + migration history → `go` explícito da Maria.
5. Aplicar migrations pela ordem registada, método único audível.
6. Provas: `pg_policies`/ACL before-after · anon negado (PII/RPC/shipping) · guest checkout+payment+status OK · Clerk user vê só o seu · callback inválido/amount errado não muda estado · callback válido muda exatamente 1 order · repetição idempotente.
7. → `DB-CUTOVER-VERIFIED`.
8. Purga da chave no histórico git: operação separada, com backup e autorização explícita.

## Done-when

- `READY-FOR-MARIA-REVIEW`: gates locais todos verdes + revisão independente fechada.
- `DB-CUTOVER-VERIFIED`: passos 1-7 do cutover com provas capturadas.
- O plano global fica `partial` enquanto deploy/DB não estiverem provados. Sem "correção total" no vocabulário de fecho.

## Fora de âmbito (blockers de lançamento, explícitos)
Rate limiting nos endpoints públicos · libertação de stock/reconciliação (cron) · E2E produção · analytics/Sentry · botão "Recusar" cookies · imagem OG · portes-da-DB em vez de hardcoded.
