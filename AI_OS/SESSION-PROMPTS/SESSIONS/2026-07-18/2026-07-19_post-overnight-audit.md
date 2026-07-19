# Auditoria Pós-Run Noturno — Jocril LOJA-ONLINE

**Data:** 2026-07-19 (manhã)
**Âmbito:** auditoria adversarial de TODAS as alterações do run noturno antes de qualquer avanço. 4 agentes independentes + verificações diretas (incl. DB real, read-only).
**Regra:** nada avança sem este veredicto.

---

## Veredicto global

**O código do run noturno está BOM — veredicto KEEP em todos os ficheiros. Zero regressões encontradas.**
**MAS: a migration RLS principal (T5) NÃO PODE ser aplicada como está — partia checkout, pagamentos e webhook em silêncio.** Foi por isso que ficou em draft; a auditoria confirmou que aplicá-la seria desastre.

Correções ao meu reporte de ontem à noite:
1. "Os 14 tasks executaram" — **errado**: T14 ficou maioritariamente por fazer (sem README, `.nvmrc`, `engines`, `loading.tsx`; query default de /pesquisa ainda presente). Só a contagem dinâmica foi feita.
2. "Diff de 480 linhas suspeito" — **falso alarme**: `git diff -w` = 6 linhas reais; resto é re-indentação. 3 hunks substantivos, todos no âmbito.
3. "Alterações fora do plano" — **não foram os agentes**: é o teu tooling de indexação do ai-brain (Stop hook em `.claude/settings.json` → `Check-NewDocs.ps1`). O `MEMORY_INDEX.md` curado foi substituído pelo gerado, mas o original está intacto no HEAD (recuperável com `git show HEAD:AI_OS/MEMORY_INDEX.md`).

---

## Resultados por área (4 auditorias adversariais)

### 1. Storefront (produtos-client + queries) — KEEP
- `produtos-client.tsx`: 480 linhas de diff = **6 reais** (`-w`), prop opcional `fetchError` + 1 ternário no empty-state. Happy path byte-idêntico. `tsc --noEmit` exit 0.
- `products.ts`: wrappers mantêm shapes; todos os callers verificados (search API, pesquisa) — semântica idêntica.
- **Única mudança de comportamento real:** `pdp.ts` agora **atira** em erro de DB → PDP mostra error boundary (500) em vez de 404 enganoso. Em missão, mas é decisão a confirmar por ti. ✔ para manter.
- Nota: re-indentação em massa polui o blame — opcional normalizar antes de commit.

### 2. UI (footer, cookies, registar, carrinho, metadata, env) — SHIP
- Footer: 229 linhas = **13 reais** (resto re-indentação); só o link Livro de Reclamações.
- CookieConsent: 'use client', localStorage, aria, vars CSS, PT, sem analytics. Nota: só "Aceitar" + link (sem "Recusar" — nice-to-have RGPD).
- `/registar`: `<SignUp routing="hash" signInUrl="/entrar">`, pt-PT via provider. **Depende de `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/conta` estar definido no deploy.**
- Carrinho: exatamente as 2 linhas (cartão/transferência removidos); resto intacto.
- Metadata: OK; nota: sem imagem OG definida (cosmético).
- `.env.local.example`: todos os nomes agora corretos vs código.
- Notas menores: ternário degenerado em `entrar` (comportamento igual); badge "Desde 1983" copiado de entrar vs "1994" no resto do site (inconsistência pré-existente propagada).

### 3. Caminho do dinheiro — SAFE com condições de deploy
- `site-url.ts`: não atira (fallback `loja.jocril.pt`). **Três domínios em jogo** no código (`loja.jocril.pt` em site-url/robots/sitemap, `www.jocril.pt` em layout). Definir `NEXT_PUBLIC_SITE_URL` em prod é obrigatório.
- Orders route: recompute server-side correto. **Risco de 400 falso com escalões de preço VERIFICADO CONTRA A DB REAL: `price_tiers` está VAZIA → risco zero hoje.** Fica LATENTE: se criares escalões com desconto no admin sem corrigir a validação, o checkout parte para esses produtos. Corrigir antes de usar escalões.
- `item.totalPrice` por linha continua confiado do cliente (só integridade de display, total cobrado é server-derived) — corrigir em follow-up.
- Email: `requireEmailFrom()` lazy, sem crash em module-load. Mudança: form de contacto agora dá 500 se `EMAIL_FROM` faltar (antes usava sandbox). **Landmine pré-existente:** `new Resend(RESEND_API_KEY)` em module-scope atira se a env faltar → rota de orders crasharia. Env obrigatória em prod.
- Webhook: fail-closed correto. Consequência operacional: `EUPAGO_API_KEY` em falta em prod = **nenhuma encomenda marcada como paga** (só log). Confirmar no dashboard EuPago que o callback envia `chave_api`.
- Segredos: zero chaves vivas na working tree. A chave antiga persiste no HISTÓRICO git → rotação obrigatória.

### 4. Migrations RLS — VEREDICTO CRÍTICO
- **T5 (`20260718090000_tighten_rls...`): DO-NOT-APPLY como está.** 7 caminhos (checkout GET/list, mbway, multibanco, **webhook UPDATE**, status, páginas de encomenda do cliente) usam a **anon key** — a migration assumia service-role. Aplicá-la: webhook faria UPDATE de 0 rows **em silêncio** → encomendas pagas nunca marcadas pagas. As policies `auth.uid()` são letra morta (Clerk, sem bridge JWT Supabase). O RPC `create_complete_order` sobreviveria (SECURITY DEFINER).
  **Caminho correto:** migrar os 7 ficheiros para `createAdminClient()` (todos já atrás de handlers server-side) e SÓ DEPOIS aplicar a migration. Os DROP names batem certo com as policies originais (verificado).
- **T6 (`20260718090100_lock_anon_insert...`): SAFE-TO-APPLY.** Zero referências no código a reviews/analytics; DROP names corretos; SELECT público mantido.
- **Gap:** tabelas de shipping (`20251221100000`) continuam `USING(true)` — anon pode ALTERAR portes. Sem PII mas é integridade de preços; fechar na mesma ronda.

---

## Factos novos verificados contra a DB real (read-only)
1. **`price_tiers` vazia** → risco de checkout-400 é zero hoje (latente).
2. **Slugs de categoria: os 5 links da nav estão TODOS partidos** — DB tem `acrilicos-chao, acrilicos-mesa, acrilicos-parede, caixas-acrilico, molduras-acrilico, tombolas-acrilico`; a nav manda `?cat=caixas|molduras|tombolas|expositores|sinaletica` → nenhum bate → mostram todos os produtos silenciosamente. **Pré-existente, não é do run.** Corrigir nav (e decidir se `expositores`/`sinaletica` devem existir como categorias).

## Ficheiros de indexação (teu tooling, não do run)
- `AI_OS/MEMORY_INDEX.md` substituído por versão gerada — original no HEAD, recuperável.
- Novos `DOCS_INDEX.md`, `HANDOFF_INDEX.md`, `.claude/settings.json` (Stop hook), `.indexing.config.json`, `.indexing-backup/`.
- Decisão tua: manter o tooling ou restaurar o MEMORY_INDEX curado.

## Pendentes do run (não feitos)
- T14: README, `.nvmrc`/`engines`, `loading.tsx`, remover query default de `/pesquisa`.

## Ordem recomendada agora
1. (Tu) Rotar chave service-role + purgar histórico.
2. (Tu) Aplicar **só T6**. NÃO aplicar T5.
3. (Código) Migrar os 7 caminhos anon→admin client; depois aplicar T5 revisada (+ shipping tables).
4. (Código) Corrigir slugs da nav (agora é facto, não suspeita).
5. (Tu) Envs em prod: `NEXT_PUBLIC_SITE_URL`, `EUPAGO_API_KEY`, `EMAIL_FROM`, `RESEND_API_KEY`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` — qualquer uma em falta tem modo de falha conhecido (acima).
6. (Código) Follow-ups: validar `totalPrice` por linha; tier-aware price check antes de usares escalões; T14 pendentes.
