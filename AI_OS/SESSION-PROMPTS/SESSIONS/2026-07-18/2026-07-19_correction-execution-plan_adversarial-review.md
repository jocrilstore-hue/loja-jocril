# Revisão adversarial — Plano de Execução de Correções

## Sumário Executivo

**Pedido:** analisar `2026-07-19_correction-execution-plan.md` e propor correções. **Veredito: REJEITAR o plano atual para execução.** A direção geral está certa, mas os findings `F-01` a `F-04` provam quatro bloqueadores: `proxy.ts` não protege os endpoints guest elevados a `service_role`; `20251227200000_create_complete_order_rpc.sql` mantém um RPC `SECURITY DEFINER` executável por clientes; `lib/queries/pdp.ts` e `pdp-client.tsx` produzem pricing incompatível com A4; e a Fase B permite alterar a DB antes do deploy/rotação da Fase C.

**Prova disponível:** leitura e comandos read-only sobre o plano, `proxy.ts`, as rotas API, o carrinho/PDP, os clients Supabase, os RPCs, as migrations e o tooling de índices; um segundo verificador repetiu cinco amostras e devolveu `fail` em todas. **Não provado nesta revisão:** estado live de policies/ACLs, migration history e runtime do checkout no projeto Supabase Jocril; essas superfícies continuam obrigatórias no cutover.

**Recomendação e próxima ação:** produzir uma v2 com gate de decisões, baseline, capability por encomenda, preço derivado pelo servidor, migrations validadas localmente e cutover na ordem rotação/envs → deploy compatível → smoke → `go` DB → provas pós-migration. **Não executar agora:** A1/A2, B1/B2/B3, o mapeamento automático de `Expositores`/`Sinalética` ou o restauro de `MEMORY_INDEX.md`. O plano-fonte permanece intacto.

## Contrato desta revisão

- **cwd/project:** `C:\Users\maria\Desktop\pessoal\jocril\LOJA-ONLINE`
- **Fonte read-only:** `AI_OS/SESSION-PROMPTS/SESSIONS/2026-07-18/2026-07-19_correction-execution-plan.md`
- **Resultado pretendido:** decidir se o plano pode ser executado e propor alterações verificáveis.
- **Done when:** todos os requisitos críticos do plano têm owner, ordem, comando/prova, regra de bloqueio e preservação do comportamento existente.
- **Superfícies de evidência:** ficheiros e migrations atuais, `git status`/`git diff`, contratos locais, auditoria-base, implementação atual e documentação oficial PostgreSQL para privilégios de funções.
- **Substituições proibidas:** build por autorização, server-side por autorização, policy name por policy efetiva, source inspection por DB live, self-audit por verificador independente, `merged` por `deployed`.
- **Side effects permitidos:** apenas este relatório derivado e o seu HTML de revisão; nenhuma alteração ao plano-fonte, código, migrations ou DB.
- **Ask vs proceed:** análise e artefactos de revisão podem prosseguir; decisões de taxonomia/domínio/indexação, rotação de segredos, deploy, DB e história git exigem Maria.
- **Blocker rule:** qualquer gap P0/P1 abaixo bloqueia execução; duas tentativas falhadas no mesmo problema obrigam a parar e escalar.
- **Final status deste trabalho:** `completed-audit` se o relatório e a verificação independente fecharem; o plano analisado permanece `Fail/REJECT`.

## O que o plano acerta

1. Mantém as migrations como drafts e exige `go` explícito antes da DB.
2. Preserva execução sequencial e mudanças cirúrgicas depois do ruído de reindentação.
3. Reconhece a incompatibilidade entre Clerk e as policies `auth.uid()`.
4. Separa código local de ações de conta/segredos.
5. Exige build e uma revisão final, embora as provas ainda precisem de ser tornadas mecânicas e independentes.

Estes pontos devem ser preservados na v2.

## Findings bloqueadores

| ID | Severidade | Finding e evidência | Correção obrigatória |
|---|---:|---|---|
| F-01 | P0 | **A1 confunde “server-side” com “autorizado”.** O plano afirma que os sete caminhos estão atrás de handlers/Clerk (`correction-execution-plan.md:22-32`). Porém `proxy.ts:3-8` protege `/admin`, `/conta` e `/encomendas`, não `/api/payment/*` nem `/api/orders/*`. `app/api/payment/mbway/route.ts:16-75` e `multibanco/route.ts:14-85` aceitam apenas `orderId` e não chamam `auth()`. O checkout guest precisa destes endpoints. Trocar apenas o client transforma-os em gateways públicos para uma chave que ignora RLS. | Antes de usar `service_role`, definir uma matriz por rota: utilizador Clerk e ownership para list/detail; capability assinada e ligada a uma única encomenda para payment/status guest; segredo EuPago para webhook; admin check para backoffice. Adicionar `import "server-only"` ao client privilegiado e preferir um nome semântico como `createServiceClient()` para não violar a invariável atual de `lib/supabase/admin.ts:3-4`. |
| F-02 | P0 | **O RPC de checkout contorna todas as novas validações.** `create_complete_order` é `SECURITY DEFINER` (`20251227200000_create_complete_order_rpc.sql:7-16`), aceita `p_order`, `unit_price` e `total_price` do chamador (`:130-135`, `:147-151`, `:207-210`) e tem `GRANT EXECUTE` para `authenticated` e `anon` (`:243-247`). Funções novas têm `EXECUTE` para `PUBLIC` por defeito; PostgreSQL recomenda revogar `PUBLIC` e conceder seletivamente, dentro da mesma transação. Assim, um cliente pode chamar o RPC diretamente com o anon key, ignorar `app/api/orders/route.ts` e criar preços/PII arbitrários ou consumir stock. | A rota POST validada deve chamar o RPC com service-role; a migration deve executar `REVOKE ALL ... FROM PUBLIC, anon, authenticated` e conceder só a `service_role`. O RPC deve usar `SET search_path = public, pg_temp`. Antes de chamar a correção “total”, inventariar todos os `SECURITY DEFINER` e respetivos ACLs; `admin_apply_price_tiers` e `admin_save_product_template` apresentam a mesma família de risco. Referência: [PostgreSQL — Writing SECURITY DEFINER Functions Safely](https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY). |
| F-03 | P0 | **A ordem de cutover pode partir produção.** B2 permite aplicar T5 depois de A1 estar “merged/verificado” (`correction-execution-plan.md:74-79`), mas não exige que o código esteja deployed no ambiente que usa a DB. A rotação da chave comprometida aparece só em C1 (`:81-87`), depois da DB. O plano também exige que tudo fique uncommitted até revisão (`:95-99`), portanto não existe uma ponte explícita A → commit/review → deploy → DB. | Reordenar: aprovação Maria → rotação da chave e atualização coordenada de envs → commit/deploy de código compatível com RLS antigo e novo → smoke no ambiente alvo → `go` DB → aplicar migrations → smoke positivo e negativo. Purgar história fica depois da rotação, numa operação separada. `merged` nunca substitui `deployed + runtime proof`. |
| F-04 | P0 | **A4 especifica o algoritmo errado para os escalões.** O PDP carrega tiers apenas para a variante do slug (`lib/queries/pdp.ts:100-105`) e aplica proporcionalmente esse tier às variantes irmãs (`pdp-client.tsx:43-47`). O plano manda aceitar um tier associado à variante submetida (`correction-execution-plan.md:47-50`). Quando existirem tiers, uma variante irmã pode não ter linha própria e o servidor rejeitará o preço que a própria UI produziu. O carrinho também não recalcula `unitPrice` ao mudar quantidade (`contexts/cart-context.tsx:103-119`) e, ao fundir linhas, pode conservar o preço antigo enquanto calcula `totalPrice` com o preço novo (`:70-82`). “Aceitar qualquer base ou tier aplicável” deixa o cliente escolher entre preços em vez de o servidor determinar o preço canónico. | Decidir o modelo de dados antes de implementar. Recomendação mínima e coerente com o schema: tiers por `product_variant_id`; o PDP carrega tiers da variante selecionada; o carrinho recalcula ao cruzar tiers; o servidor escolhe exatamente um tier segundo regra determinística e calcula `unit_price`, `line_total`, subtotal e total em cêntimos. Os valores do cliente são apenas comparados para UX e nunca enviados ao RPC como fonte. Testar base, limites inclusivos, `max_quantity IS NULL`, variante irmã, merge, carrinho stale/persistido, tier ausente/sobreposto e arredondamento. |
| F-05 | P1 | **T6 repete a mesma autenticação morta que A2 pretende remover.** A2 reconhece que Supabase `auth.uid()`/`authenticated` não representa utilizadores Clerk (`correction-execution-plan.md:34-39`). Mas B1 manda aplicar T6 sem alterações (`:74-77`), e T6 recria INSERT policies `TO authenticated` (`20260718090100...sql:66-86`). O config local confirma a integração Clerk third-party desativada (`supabase/config.toml:303-305`). | Se não existe write path atual, T6 deve remover os INSERT públicos e não recriar policies de utilizador. Se surgir um write path, deve passar por rota server-side validada/rate-limited. Uma policy Clerk/Supabase só pode existir depois de integração JWT real e teste de claims. |
| F-06 | P1 | **A1 não elimina o antigo “silent success”.** MB Way e Multibanco apenas registam `updateError` e continuam a devolver success (`mbway/route.ts:68-89`; `multibanco/route.ts:76-100`). O webhook verifica `error`, mas não exige uma row devolvida/afetada (`webhooks/eupago/route.ts:56-72`). Mudar para admin client não prova que o estado persistiu nem que a encomenda correta foi afetada. | Para cada mutation crítica, pedir uma row/ID de retorno e falhar se a cardinalidade não for exatamente 1. Testar zero-row, erro DB, repetição idempotente e transição de estado inválida. O cliente não pode receber payment success quando a persistência falhou. |
| F-07 | P1 | **O gate de verificação é autoavaliado e prose-only.** “diff inspecionado + checagem semântica” e “self-audit sem findings” (`correction-execution-plan.md:12-16`, `:69-70`, `:95-96`) não têm comandos, fixtures nem re-verificador. O repo não tem script de testes em `package.json`; só build. `AI.md:34-35` exige testes antes/depois e downstream consumers. | Adicionar baseline antes da primeira edição; testes Bun para pricing/capability; local DB reset e policy validator; testes runtime positivos/negativos; `bun run build`; `git diff --check`; allowlist de ficheiros; e verificador read-only separado. Build é necessário, nunca suficiente para auth, dinheiro, DB ou webhook. |
| F-08 | P1 | **Aplicação das migrations não tem identidade, histórico, método ou pós-condição.** O repo não está ligado localmente a um project-ref; o plano diz “definimos no momento” (`correction-execution-plan.md:79`). T5 tem timestamp anterior a T6, mas B1 tenta aplicar só T6. Não há query a `supabase_migrations.schema_migrations`, matriz `pg_policies`, ACL de routines, transação/abort ou recovery. Se a draft já tiver sido aplicada manualmente, reescrever o mesmo ficheiro não produz uma migration corretiva. | Antes de editar/aplicar: provar o project ref/host esperado sem expor segredo; consultar migration history; se T5/T6 constarem, criar nova migration, nunca reescrever história aplicada; validar toda a cadeia local; escolher um único método audível; aplicar pela ordem registada; capturar policy/ACL before-after; definir abort e forward-recovery. |
| F-09 | P1 | **A2 conserva SELECT público de shipping sem consumidor storefront atual.** O plano diz que o carrinho “pode precisar” (`correction-execution-plan.md:38`), mas o carrinho usa `4.90/7.90` hardcoded e a API usa `[0, 4.9, 7.9]`; só o endpoint admin lê as tabelas. | Least privilege: bloquear também SELECT público enquanto não existir um read path necessário e validado, ou documentar explicitamente a função pública e testá-la. “Pode precisar” não é justificativa de acesso. Separadamente, decidir quando os portes DB substituem os hardcodes; não misturar essa feature na correção RLS. |
| F-10 | P1 | **A3 inventa uma decisão de informação/negócio.** Três substituições são mecânicas (`caixas`, `molduras`, `tombolas`), mas mapear `Expositores`/`Sinalética` para categorias “próximas” não tem regra. O próprio plano deixa labels para Maria corrigir depois (`correction-execution-plan.md:41-45`). `category-groups.ts` já contém os seis slugs atuais, logo “rever” não justifica editá-lo. | Fazer só as três correções inequívocas. Colocar `Expositores` e `Sinalética` num gate Maria: mapear, remover ou criar categorias. Se Maria não decidir, mantê-los bloqueados sem inventar. Verificar `category-groups.ts` e não tocar se a matriz já bate. |
| F-11 | P2 | **A6 contradiz a decisão pendente sobre o tooling.** O plano restaura o índice curado e mantém o tooling (`correction-execution-plan.md:57-59`), mas `.indexing.config.json:23-35` continua a declarar `AI_OS/MEMORY_INDEX.md` como output gerado e o tooling indica regeneração no post-commit. C6 deixa a decisão para depois (`correction-execution-plan.md:88`). | Decidir antes de A6: ou `MEMORY_INDEX.md` é curado e sai do generator, ou é gerado e o conteúdo curado migra para uma fonte própria. Restaurar agora e decidir depois apenas recria a mesma perda no commit seguinte. |
| F-12 | P2 | **Escopo e done-when misturam três contratos.** A7 junta entregáveis T14, limpeza cosmética e rename não exigido; o done-when exige também checklist Maria (`correction-execution-plan.md:61-70`, `:95-99`). Isso impede distinguir “código pronto para revisão” de “cutover DB concluído” e “lançamento pronto”. | Separar em: v2 local correction; manual cutover; launch follow-ups. Remover cosmética não necessária (`error` vs `fetchError`) ou torná-la opcional depois dos gates críticos. Usar estados distintos: `READY-FOR-MARIA-REVIEW`, `READY-FOR-DB-CUTOVER`, `DB-CUTOVER-VERIFIED`; nunca “Correção Total” enquanto rate limiting/stock recovery/E2E de produção continuam fora. |

## Plano v2 proposto

### Gate 0 — decisões e baseline, sem alterações

1. Maria decide:
   - destino de `Expositores` e `Sinalética`;
   - domínio canónico;
   - `MEMORY_INDEX.md` curado vs gerado;
   - manutenção do comportamento PDP 500 em erro DB;
   - ambiente de cutover e project ref Supabase esperado.
2. Capturar baseline:
   - `git status --short --branch`;
   - `git diff --check`;
   - `git diff --name-only` e allowlist de ficheiros;
   - `bun run build`;
   - smoke atual de guest checkout, list/detail autenticado e payment/status.
3. Se o baseline já estiver vermelho, parar; não misturar reparação anterior com esta execução.

### Fase A — trust boundary e checkout, código local

1. Criar/ajustar um client service-role explicitamente server-only.
2. Implementar matriz de autorização:
   - `/api/orders` GET/list/detail: Clerk + ownership;
   - páginas de encomenda: Clerk + ownership, preferencialmente filtrado na query;
   - guest order create: público, validado e rate-limit registado como blocker de lançamento se ainda ausente;
   - payment/status guest: capability assinada, expirada e ligada a `order_id/order_number`;
   - webhook: chave EuPago + amount + state transition;
   - backoffice: admin allowlist/role.
3. POST `/api/orders` chama `create_complete_order` via service-role.
4. Toda mutation crítica exige exatamente uma row afetada ou resultado explícito.
5. Testes:
   - token ausente/incorreto/expirado;
   - token de A não atua em B;
   - utilizador Clerk não lê encomenda alheia;
   - guest válido inicia pagamento e consulta apenas o seu status;
   - update zero-row não devolve success.

### Fase B — pricing autoritativo

1. Fechar o modelo: tiers por variante (recomendado) ou redesign explícito a template-level.
2. Extrair uma função server-side pura que escolhe o tier e arredonda a cêntimos.
3. O servidor consulta base/tier, calcula todos os montantes e passa apenas valores server-derived ao RPC.
4. Alinhar o PDP/cart com o mesmo modelo; remover scaling proporcional se não for regra de negócio persistida.
5. Criar testes Bun para:
   - preço base;
   - limite mínimo/máximo;
   - `max=null`;
   - variante irmã;
   - nenhum tier;
   - tiers sobrepostos (deve falhar configuração ou escolher por regra documentada);
   - total/IVA e rounding.

### Fase C — migrations draft e validator

1. Consultar live migration history read-only.
2. Se timestamps T5/T6 não foram aplicados, reescrever drafts; se foram, criar nova corrective migration.
3. T5:
   - schema-qualificar objetos;
   - remover policies PII e policies Clerk-incompatíveis;
   - remover `FOR ALL` de shipping e só preservar SELECT com owner/racional comprovado;
   - revogar `PUBLIC/anon/authenticated` dos RPCs privilegiados;
   - conceder apenas às roles necessárias;
   - corrigir `search_path` dos `SECURITY DEFINER`.
4. T6:
   - remover INSERT anon;
   - não criar policy `authenticated` morta.
5. Validação local:
   - cadeia completa de migrations em DB local limpa;
   - query `pg_policies` contra matriz esperada;
   - `has_function_privilege`/ACL contra matriz esperada;
   - chamadas anon negativas a PII, shipping writes e RPCs;
   - chamada service-role positiva através da app, não diretamente como substituto do fluxo.

### Fase D — correções independentes e T14

1. Aplicar as três trocas de slug inequívocas.
2. Aplicar a decisão Maria para `Expositores`/`Sinalética`; sem decisão, não editar esses links.
3. `category-groups.ts` é verification-only se já contém os seis slugs.
4. Unificar site URL com normalização de trailing slash e validação de URL absoluta.
5. Fazer apenas os T14 originalmente definidos: README, runtime Node suportado, pesquisa vazia e loading essencial.
6. Separar limpeza cosmética numa lista opcional; não a misturar no gate de segurança.

### Gate local — pronto para revisão, não pronto para DB

Exigir em conjunto:

- testes targeted verdes;
- `bun run build` verde;
- `git diff --check` sem erros;
- diff limitado à allowlist;
- cada finding aceite com teste observável;
- revisão independente read-only;
- migrations ainda não aplicadas;
- status `READY-FOR-MARIA-REVIEW`.

Depois, pausar para a Maria rever, autorizar commit/deploy e resolver blockers manuais.

### Cutover manual coordenado

1. Maria roda `service_role` e atualiza `.env.local`/Vercel; verificar que a chave antiga já não funciona.
2. Commit/deploy do código compatível com RLS antigo e novo.
3. Smoke runtime pré-migration no ambiente alvo.
4. Confirmar target DB + migration history; pedir `go` explícito.
5. Aplicar migrations na ordem registada, por um único método audível.
6. Capturar:
   - `pg_policies` e ACL before/after;
   - anon PII/RPC/shipping-write negados;
   - guest checkout/payment/status válidos;
   - utilizador Clerk vê só as suas encomendas;
   - callback errado/amount errado não muda estado;
   - callback válido muda exatamente uma order;
   - repetição é idempotente.
7. Só então usar `DB-CUTOVER-VERIFIED`.
8. Purgar a chave da história git numa operação separada, com backup/coordenação e autorização explícita.

## Done-when corrigido

O plano revisto só pode fechar como `completed-as-requested` quando:

1. os findings F-01 a F-10 têm mecanismo observável;
2. código e migrations passaram os gates locais;
3. Maria aprovou decisões, rotação, deploy e DB;
4. o código foi deployed antes do RLS restritivo;
5. a DB alvo e migration history foram provadas;
6. a policy/ACL matrix live bate com a matriz esperada;
7. os testes runtime positivos e negativos passaram;
8. o receipt foi re-verificado por um auditor independente.

Se apenas o código local estiver pronto, o estado é `READY-FOR-MARIA-REVIEW`, não `done`. Se DB/deploy estiverem por fazer, o plano global permanece `partial`.

## Blocker ledger e loophole labels

| Label | Positive purpose | Misuse prohibition | Detection rule |
|---|---|---|---|
| `blocked-user-decision` | Pausar apenas o item cuja semântica depende de uma escolha da Maria. | Não pode bloquear trabalho local independente nem autorizar um default inventado. | O ledger tem owner Maria, opções concretas, evidência e menor próxima ação; outras lanes continuam. |
| `external-db-proof` | Reservar mutation/prova live para depois do `go` e do target check. | Não pode substituir migration validation local, target identity, before/after ou smoke runtime. | Sem os quatro recibos live, o estado máximo é `READY-FOR-MARIA-REVIEW`/`partial`. |
| `not-in-correction-scope` | Manter follow-ups de lançamento fora desta correção bounded. | Não pode excluir a segurança dos caminhos que esta mudança eleva a service-role nem sustentar “launch ready”. | O título, sumário e done-when não usam “total”/“launch ready”; blockers de lançamento ficam explícitos. |

## Verification Report

**Type**

- Mixed: plano, código, auth, API, database, config.

**Checks Run**

- Leitura integral do plano-fonte e auditoria-base.
- `git status --short --branch`, `git diff --stat`, `git diff --name-only`.
- Inspeção dos sete paths A1, `proxy.ts`, clients Supabase, cart/PDP/pricing, RPCs e migrations.
- `rg` direcionado para `createClient`, `createAdminClient`, `SECURITY DEFINER`, `GRANT EXECUTE`, policies e shipping consumers.
- Comparação do `MEMORY_INDEX.md` atual/HEAD com `.indexing.config.json` e o tooling de indexação.
- Leitura da documentação oficial PostgreSQL para ACL default e `SECURITY DEFINER`.

**Evidence**

- Os findings F-01 a F-12 indicam ficheiro e linha/símbolo.
- A working tree já contém WIP não commitado; nenhuma dessas alterações foi modificada por esta revisão.
- Não foi feita ligação à DB Jocril nem mutation; os factos “DB real” sobre slugs/tiers provêm da auditoria-base nomeada e não foram refrescados live nesta revisão.

**Result**

- **Fail / REJECT para executar o plano atual.**

**Remaining Risk**

- O ACL/policy state live e migration history continuam por provar no projeto Supabase correto.
- A escolha de taxonomia, domínio e ownership do índice depende da Maria.
- O inventário completo de `SECURITY DEFINER` foi identificado como necessário, mas não é substituído por esta revisão estática.

## Receipt Audit

[receipt-audit]
- Re-verifier-agent:         /root/plan_receipt_audit — independente, read-only
- Source verification:      C:\Users\maria\Desktop\pessoal\jocril\LOJA-ONLINE\AI_OS\SESSION-PROMPTS\SESSIONS\2026-07-18\2026-07-19_correction-execution-plan.md
- Sample re-verified:       5/5 grupos pedidos
- Per-sample re-verdict:    A1/A2 fail; A4 fail; sequencing fail; T6 fail; A6 fail
- Validator commands re-run: rg/Get-Content/git show/git diff + assertions PowerShell read-only
- Verdict:                  fail

## Closeout Review

[closeout-review]
Status: completed-as-requested
Artifact reviewed: this derived adversarial review
Source contract checked: yes
Findings found: 1 local artifact finding (receipt audit pending); 12 source-plan findings reported
Findings fixed: 1 local artifact finding
Remaining findings: none in this report; the 12 plan findings intentionally remain proposed corrections because the source is read-only
Evidence limitations: no live Jocril DB connection or runtime checkout execution in this audit-only task
Final artifact ready: yes, subject to the adjacent HTML validator result
