# Cold Review — Jocril LOJA-ONLINE — Prontidão para Produção

**Data:** 2026-07-18
**Âmbito:** Avaliação crítica de tudo o que falta para colocar a loja online e a funcionar face ao público.
**Método:** Build de produção + 4 auditorias paralelas (storefront, auth/segurança, encomendas/pagamentos/email, deploy/SEO/RGPD) + verificação direta dos achados de maior impacto.

---

## Veredicto

**NÃO está pronta para lançamento público.**

A base é sólida — o build passa limpo, a jornada de compra funciona ponta-a-ponta com dados reais, e a arquitetura (Clerk + Supabase + EuPago + Resend) está bem montada. Mas existem **6 blockers duros** que tornam o go-live perigoso: dois são vetores de **fuga de dados / RGPD** e três são vetores de **perda de receita / fraude**. Nenhum é grande em esforço, mas **todos têm de ser corrigidos antes de abrir ao público**.

Estimativa realista até go-live seguro: **os blockers são ~1-2 dias de trabalho focado**; os "importantes" acrescentam alguns dias conforme a exigência legal/qualidade.

---

## O que JÁ está sólido (não mexer)

- ✅ **Build de produção passa** — `next build` exit 0, TypeScript limpo, 53 páginas geradas, zero warnings.
- ✅ **Auth Clerk bem ligada** — `proxy.ts` (Next.js 16 renomeou `middleware.ts`→`proxy.ts`) com `clerkMiddleware()` protege `/admin`, `/conta`, `/encomendas`. `ClerkProvider` com localização pt-PT.
- ✅ **Admin com defesa em profundidade** — `app/admin/layout.tsx` chama `requireAdmin()`, e **todas** as 10 rotas `app/api/admin/**` verificam `getAdminContext()` (403) antes de qualquer escrita.
- ✅ **Dados reais do Supabase** ponta-a-ponta (produtos, categorias, pesquisa via RPC `search_products`). Carrinho persiste em localStorage. Checkout em 3 passos.
- ✅ **Criação de encomenda atómica** — RPC `create_complete_order` com `FOR UPDATE` (row locks) + verificação de stock. Race-safe.
- ✅ **Páginas legais têm conteúdo real e substantivo** (DL 84/2021, IVA 23%, CNPD, devoluções 14 dias) — não são placeholder.
- ✅ **`robots.txt` + `sitemap.xml` reais** (rotas dinâmicas), com `/admin` `/conta` `/carrinho` bloqueados no robots.

---

## 🔴 BLOCKERS — corrigir ANTES de qualquer lançamento

### B1. Chave `service_role` do Supabase commitada no git *(fuga de dados)*
`scripts/sync-images.mjs:12` tem a chave `service_role` em texto (project ref `qhzfpampacitsianmlpw`), e o ficheiro **está tracked no git**. Qualquer pessoa com acesso ao repo tem bypass total de RLS.
**Ação:** rodar a chave no Supabase **já**, remover do ficheiro (usar `process.env`), e purgar do histórico git.

### B2. RLS aberta (`USING(true)`) em tabelas de clientes e encomendas *(fuga de dados / RGPD)*
`20251220112000_create_order_tables.sql:103-149` define `FOR ALL USING(true) WITH CHECK(true)` em `customers`, `shipping_addresses`, `orders`, `order_items` (idem `email_logs`, `shipping_*`). A **anon key** — que é enviada para o browser (`lib/supabase/client.ts`) — pode **ler, alterar e apagar** todos os emails, telefones, NIFs, moradas e encomendas via API REST pública do Supabase. RLS está efetivamente desligada nestes dados.
**Ação:** reescrever as policies para `auth`/service-role apenas; nenhum `USING(true)` em tabelas com PII.

### B3. Total da encomenda é confiado no cliente *(perda de receita)*
**Verificado diretamente:** `create_complete_order` grava `subtotal`, `shipping_cost` e `total` verbatim do JSON do cliente (`20251227200000_...rpc.sql:130-135`) — `total_amount_with_vat` = `total` enviado pelo browser, que é **o valor cobrado no EuPago**. Nada recalcula `subtotal = Σ(preço×qtd)` nem valida `total = subtotal + portes`. Um comprador pode adulterar o total para pagar menos (ou €0), e o webhook confirma contra esse mesmo valor adulterado.
**Ação:** recalcular subtotal/portes/total **no servidor** a partir de preços de DB antes de criar o pagamento.

### B4. Webhook EuPago falha aberto *(fraude de pagamento)*
`lib/payments/eupago.ts:256` — `if (EUPAGO_API_KEY && chave_api !== EUPAGO_API_KEY)`. Se a env var não estiver definida, a verificação é **saltada por completo** → qualquer um pode fazer POST e marcar encomendas como `paid`. Mesmo definida, é um segredo partilhado em texto no body (sem HMAC, sem allowlist de IP, comparação não constante).
**Ação:** exigir chave presente (falhar fechado), validar assinatura/IP, comparação constante.

### B5. `EMAIL_FROM` cai em `onboarding@resend.dev` *(cliente não recebe emails)*
`lib/email/send.ts:6` — se `EMAIL_FROM` não apontar para um domínio verificado no Resend, o sender sandbox só entrega ao dono da conta → **clientes não recebem confirmação de encomenda nem de pagamento**. Todos os emails são fire-and-forget (`void ...catch()`), por isso as falhas são silenciosas.
**Ação:** verificar domínio no Resend, definir `EMAIL_FROM` para `@jocril.pt`, e logar falhas de envio.

### B6. `NEXT_PUBLIC_SITE_URL` / domínio inconsistente *(callbacks de pagamento partem)*
O `webhook/successUrl/failUrl/backUrl` do EuPago derivam de `NEXT_PUBLIC_SITE_URL` (`eupago.ts:7,194-196`). O exemplo aponta `localhost:3000`, o fallback do código é `jocril-store.vercel.app`, mas robots/sitemap hardcodam `loja.jocril.pt`. Valor errado/ausente = callbacks de pagamento partidos.
**Ação:** fixar o domínio final e defini-lo em produção (Vercel); alinhar os três sítios.

---

## 🟡 IMPORTANTES — corrigir à volta do lançamento

- **Não existe página de registo de cliente.** `.env.example` referencia `/registar` e `/login`, mas a rota real é `/entrar` e **não há página de sign-up**. Novos clientes não se conseguem registar pelo fluxo esperado. (auth)
- **Sem banner de consentimento de cookies, mas a política afirma que existe** — `legais/cookies/page.tsx:64` diz "é apresentado o banner de consentimento" e menciona Plausible Analytics (`:83`), nenhum dos quais está implementado. Exposição RGPD + declaração falsa.
- **Falta link do Livro de Reclamações Eletrónico** (`livroreclamacoes.pt`) — obrigatório para lojas online PT (DL 74-A/2017). As entidades RAL estão listadas, mas o link do livro eletrónico não.
- **Slugs de categoria da navegação podem não bater com a DB** — `StoreHeader.tsx`/`StoreFooter.tsx` linkam `?cat=caixas`, `molduras`, `tombolas`, `expositores`, `sinaletica`, mas `lib/data/category-groups.ts` usa `caixas-acrilico`, etc. e não tem `expositores`/`sinaletica`. Se os slugs da DB seguem a forma `-acrilico`, a PLP mostra **todos os produtos** em vez de filtrar (falha silenciosa). *Requer verificação na DB real.*
- **Erros de fetch são engolidos** — todas as queries devolvem `[]` em erro (`products.ts:36-38,120-123`; `pdp.ts:47-50`). Numa falha do Supabase, a homepage/PLP renderiza vazia sem mensagem; o boundary `app/error.tsx` nunca dispara.
- **Stock decrementado na criação (pending), antes do pagamento** — encomendas Multibanco abandonadas seguram stock para sempre; sem caminho de libertação.
- **Sem reconciliação para webhooks perdidos** — Multibanco é pagar-depois; se o callback se perde, a encomenda fica `pending` eternamente. `payment_deadline` é guardado mas nada atua sobre ele. Sem cron/polling.
- **Métodos de pagamento "cartão" e "transferência" são oferecidos mas não funcionam** — bloqueados com "ainda não está disponível online" (`carrinho/page.tsx:93-94`). Esconder ou implementar.
- **Sem rate limiting** em POSTs públicos (`/api/contact`, `/api/orders`, `/api/payment/*`, `/api/products/search`) → spam/flooding de encomendas.
- **INSERT anónimo em `product_reviews` e `product_analytics`** (`20251220130000:111,132`) → spam de reviews/analytics via anon key.
- **Metadata raiz sem openGraph/twitter/metadataBase/canonical** (`app/layout.tsx`) → partilha social pobre, URLs OG não resolvem absolutas.
- **Sem analytics nem monitorização de erros** (sem Sentry/GA/Vercel Analytics). `app/error.tsx` só faz `console.error` e inventa um ref de incidente que não vai a lado nenhum.
- **Drift do `.env.local.example`** — código usa `EMAIL_FROM`, `ADMIN_EMAIL`, `NEXT_PUBLIC_ADMIN_EMAILS`, `CLERK_JWT_KEY`, fallback redirects Clerk; o exemplo lista `RESEND_FROM_EMAIL`, `ADMIN_EMAILS` (nomes diferentes). Quem fizer deploy pelo exemplo configura mal.

---

## ⚪ MENOR / polish

- Contagem hardcoded "Ver todos os 183 produtos" (`FeaturedProducts.tsx:84`) — vai ficar desatualizada.
- Portefólio é conteúdo mock/inventado (`portfolio/page.tsx:9`) — confirmar se é intencional (showcase).
- PDP sem reviews reais — `rating: 0, reviews: 0` hardcoded (`pdp.ts:188-189`).
- `/pesquisa` sem `?q` faz query default `'expositor acrilico a3'` em vez de pesquisa vazia.
- Sem `loading.tsx` nas páginas async (ISR `revalidate=300` mitiga; cold requests bloqueiam).
- Multibanco tem host hardcoded (`eupago.ts` REST v0) enquanto MBWay alterna sandbox/prod — Multibanco não alterna corretamente se BASE_URL for sandbox.
- `package.json` `lint: "next lint"` — deprecado no Next 16.
- Sem `README`, `vercel.json`, `.nvmrc`/`engines` — versão de Node não fixada (usa default da Vercel).
- FAQ anuncia isenção de IVA intra-UE B2B, mas o código aplica sempre 23% (`/1.23`) — correto para B2C PT continental, mas incoerente com a FAQ.

---

## Checklist de go-live (ordem sugerida)

1. **[B1]** Rodar chave service-role + remover de `sync-images.mjs` + purgar histórico.
2. **[B2]** Reescrever policies RLS de `customers`/`orders`/`shipping_addresses`/`order_items`/`email_logs`.
3. **[B3]** Recalcular totais no servidor no RPC/rota de encomenda.
4. **[B4]** Webhook EuPago: falhar fechado + validar origem.
5. **[B5]** Verificar domínio Resend + `EMAIL_FROM` real + logar falhas.
6. **[B6]** Fixar domínio de produção e definir `NEXT_PUBLIC_SITE_URL` na Vercel.
7. Página de registo de cliente + alinhar URLs Clerk.
8. Banner de cookie consent (ou remover as afirmações da política) + link Livro de Reclamações.
9. Verificar slugs de categoria contra a DB real.
10. Libertação de stock + reconciliação de encomendas pending.
11. Rate limiting + fechar INSERT anónimo de reviews/analytics.
12. Metadata OG + analytics/monitorização de erros.
13. Sincronizar `.env.local.example`.
14. Testar checkout real (sandbox EuPago → produção) ponta-a-ponta.

---

*Achados de segurança e integridade de pagamento verificados diretamente contra o código. Restantes achados provêm das 4 auditorias paralelas com evidência file:line.*
