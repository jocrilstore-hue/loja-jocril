# Plano de Execução — Correção Total Pós-Auditoria

**Data:** 2026-07-19
**Base:** `2026-07-19_post-overnight-audit.md` (auditoria adversarial completa, 4 agentes + verificação DB real)
**Objetivo:** corrigir tudo o que a auditoria encontrou — os erros do run de ontem, os bugs pré-existentes confirmados, e desbloquear a segurança RLS — deixando o projeto pronto para os passos de conta/deploy que só a Maria pode fazer.

---

## Lições de ontem aplicadas a este plano

1. **Sem run noturno autónomo.** Execução em sessão, sequencial, comigo (Claude) a fazer as edições diretamente — não subagentes a solo sem supervisão.
2. **Build-gate após cada fase** (`bun run build` verde obrigatório antes de passar à seguinte).
3. **Verificação após cada tarefa** — diff inspecionado + checagem semântica, não só "compila".
4. **Âmbito mínimo por edição** — sem re-indentações em massa, sem "already here" (a re-indentação de ontem poluiu o blame e disparou falsos alarmes).
5. **Nada commitado, nada aplicado à DB sem a Maria.** Migrations continuam drafts até ela mandar aplicar.
6. **Auditoria final** (`closeout`) sobre o diff completo antes de reportar "done".

---

## FASE A — Código (eu, agora, sem dependências da Maria)

### A1. Migrar os 7 caminhos anon→admin client *(desbloqueia a RLS — a correção mais importante)*
Trocar `createClient()` (anon) por `createAdminClient()` (service-role) nos caminhos server-side que tocam `orders`/`customers`/`shipping_addresses`/`order_items`:
1. `app/api/orders/route.ts` (GET by number / list — o POST/RPC já sobrevive por SECURITY DEFINER)
2. `app/api/payment/mbway/route.ts` (SELECT + UPDATE orders)
3. `app/api/payment/multibanco/route.ts` (idem)
4. `app/api/webhooks/eupago/route.ts` (SELECT + UPDATE — o caminho que falharia EM SILÊNCIO)
5. `app/api/orders/[orderNumber]/status/route.ts`
6. `app/(store)/encomenda/[id]/page.tsx`
7. `app/(store)/encomendas/page.tsx`
Todos já estão atrás de handlers server-side (e os de cliente atrás do Clerk via proxy.ts) — o admin client nunca chega ao browser.
**Verificação:** grep para garantir zero usos restantes do anon client nessas tabelas; build verde.

### A2. Reescrever a migration T5 (continua DRAFT, não aplicada)
- Remover as policies permissivas `USING(true)` de `customers`, `shipping_addresses`, `orders`, `order_items`, `email_logs` (DROP names exatos — já verificados).
- **Remover as policies `auth.uid()`** da draft atual (letra morta — a app autentica com Clerk, não há sessões Supabase).
- Resultado: tabelas PII acessíveis apenas via service-role (que ignora RLS). Sem policies anon.
- **Acrescentar as tabelas de shipping** (`shipping_zones/classes/rates/settings`): remover o `FOR ALL USING(true)`, manter o SELECT público existente (o carrinho pode precisar de ler; escritas só admin — já usa admin client).
**Verificação:** cada DROP name confrontado com a migration original que o criou.

### A3. Corrigir os slugs de categoria da navegação *(bug confirmado na DB real)*
- `StoreHeader.tsx` + `StoreFooter.tsx`: `?cat=caixas` → `caixas-acrilico`, `molduras` → `molduras-acrilico`, `tombolas` → `tombolas-acrilico`.
- `expositores` e `sinaletica` **não existem na DB** (slugs reais: `acrilicos-chao`, `acrilicos-mesa`, `acrilicos-parede`) → mapear para as categorias reais mais próximas ou remover os links. Decisão default: substituir por links às categorias reais existentes; a Maria ajusta labels depois se quiser.
- Rever `lib/data/category-groups.ts` para alinhamento com os 6 slugs reais.
**Verificação:** cada `?cat=` da nav corresponde a um slug existente na DB (lista verificada: `acrilicos-chao, acrilicos-mesa, acrilicos-parede, caixas-acrilico, molduras-acrilico, tombolas-acrilico`).

### A4. Fechar as pontas soltas do dinheiro
- **Validar `totalPrice` por linha** no `app/api/orders/route.ts`: `|totalPrice − unitPrice×qty| ≤ 0.01` senão 400 (fecha a integridade dos line totals que o RPC usa para IVA).
- **Validação tier-aware de `unitPrice`**: aceitar o preço se bater com o base **ou** com um `price_tiers.price_per_unit` aplicável (variant + `min_quantity ≤ qty ≤ max_quantity`). Desarma o bug latente ANTES de a Maria criar escalões no admin.
**Verificação:** lógica revista contra o schema real de `price_tiers` (`product_variant_id`, não `variant_id`).

### A5. Unificar o domínio do site
- `app/layout.tsx`: usar `getSiteUrl()` (remover o fallback divergente `www.jocril.pt`).
- `robots.ts` + `sitemap.ts`: usar `getSiteUrl()` em vez de hardcode.
- Fica UMA fonte (`lib/site-url.ts`, fallback `loja.jocril.pt`) — a Maria confirma o domínio final na Fase C.

### A6. Restaurar o `MEMORY_INDEX.md` curado
- `git show HEAD:AI_OS/MEMORY_INDEX.md > AI_OS/MEMORY_INDEX.md` (restauro por conteúdo, sem git destrutivo).
- Os índices gerados (`DOCS_INDEX`, `HANDOFF_INDEX`) ficam — são novos, não destroem nada. O Stop hook do tooling fica como está (decisão da Maria mantê-lo ou não).

### A7. Completar o T14 em falta + micro-correções da auditoria
- `README.md` (build/dev/deploy + envs obrigatórias e o modo de falha de cada uma).
- `.nvmrc` (20) + `engines` no `package.json`.
- Remover a query default `'expositor acrilico a3'` de `/pesquisa` (estado vazio limpo).
- `loading.tsx` em `/produtos` (mínimo, seguro).
- Corrigir o ternário degenerado em `entrar/page.tsx` (limpeza trivial).
- Uniformizar prop `error` vs `fetchError` (nomenclatura, cosmético).

### Gate da Fase A
`bun run build` verde + diff completo re-inspecionado (self-audit) + resumo por tarefa com evidência.

---

## FASE B — Base de dados (eu executo, MAS só com "go" explícito da Maria)

- **B1.** Aplicar `20260718090100_lock_anon_insert_reviews_analytics.sql` (auditada: SAFE-TO-APPLY).
- **B2.** Aplicar a T5 **reescrita** (A2) — SÓ depois do A1 estar merged/verificado, senão parte checkout/webhook.
- **B3.** Smoke test pós-apply: criar encomenda de teste (sandbox), verificar status page, simular callback, confirmar transição para paid.
- Nota: o MCP Supabase desta sessão não vê o projeto Jocril (conta IMACX) — aplicação via `SUPABASE_DB_URL` local ou pela Maria no dashboard. Definimos no momento.

## FASE C — Contas/Deploy (só a Maria)

- **C1.** Rotar a chave `service_role` no Supabase (a antiga vive no histórico git) + atualizar `.env.local`/Vercel.
- **C2.** Purgar a chave do histórico git (`git filter-repo` — combinamos juntos; reescreve história, NUNCA autónomo).
- **C3.** Resend: verificar domínio + definir `EMAIL_FROM`.
- **C4.** Vercel: `NEXT_PUBLIC_SITE_URL` (domínio final), `EUPAGO_API_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL(S)`, Clerk keys + `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/conta`. **Cada uma em falta tem modo de falha conhecido** (ver auditoria §3).
- **C5.** EuPago: chave de produção + confirmar que o callback envia `chave_api` + base URL prod.
- **C6.** Decisões pendentes: manter tooling de indexação? PDP 404→500 em erro de DB OK? Labels das categorias da nav? Badge "Desde 1983" vs "1994"?

## Follow-ups (fora deste plano, pré-lançamento mas não bloqueiam a correção)
Rate limiting nos POSTs públicos · libertação de stock de encomendas expiradas + reconciliação de webhooks perdidos (cron) · botão "Recusar" no cookie banner · imagem OG · analytics/Sentry · teste E2E de checkout em sandbox (Fase B3 cobre o essencial).

---

## Done-when
- Fase A: build verde, 7 caminhos migrados, migration T5 reescrita, slugs corrigidos e verificados contra a DB, line totals + tiers validados server-side, domínio unificado, MEMORY_INDEX restaurado, T14 completo, self-audit sem findings.
- Fase B: migrations aplicadas + smoke test de encomenda a passar.
- Fase C: checklist da Maria riscada.
- Tudo uncommitted até a Maria rever e mandar commitar.
