# Agent Skills Rectification Autonomous Mission

> Paste into a new Codex session when executing the full Agent Skills cleanup and migration without babysitting.
> Date: 2026-04-05

---

# Goal

Executar uma missão autónoma, de ponta a ponta, para retificar o setup completo de Agent Skills da Maria, alinhando Codex global + AI_OS Windows + camada local de repo com um modelo limpo, portável e otimizado para progressive disclosure no estilo `SKILL.md`.

A meta é sair com:
- arquitetura de contexto ratificada
- fronteiras corretas entre `AGENTS`, `AI_OS`, `skills`, `references`, `docs` e `tools`
- skills prioritárias refatoradas ou com plano de refactor suficientemente concreto quando o ficheiro-fonte não puder ser alterado nesta sessão
- documentação e handoff final claros
- zero babysitting intermédio, salvo blocker real

# Mode

Trabalhar em **autonomous bounded mission**.

Não parar para pedir confirmação entre passos normais.
Só perguntar se houver um blocker real que mude materialmente o resultado, como:
- falta de acesso a um path ou repo necessário
- conflito entre fontes de verdade impossíveis de resolver por inspeção
- ação destrutiva ou irreversível fora do escopo
- ausência de ficheiros-alvo indispensáveis para a migração

Se não houver blocker real, prosseguir até ao fim.

# Context

Resolver contexto por esta precedência:

1. Instruções globais já carregadas no ambiente Codex
2. `C:\Users\maria\Desktop\AI_OS`
3. Ficheiros locais do repo alvo, como `AGENTS.md`, `AI.md`, `CLAUDE.md`, `AI_OS/`, `docs/`

Assumir máquina **Windows-first**, mesmo quando o acesso é via WSL em `/mnt/c/...`.

Workspace de planeamento já criado:
- `/mnt/c/Users/maria/Desktop/pessoal/codex/AGENTS.md`
- `/mnt/c/Users/maria/Desktop/pessoal/codex/docs/AGENT_SKILLS_ARCHITECTURE.md`
- `/mnt/c/Users/maria/Desktop/pessoal/codex/docs/SKILL_MIGRATION_MATRIX.md`
- `/mnt/c/Users/maria/Desktop/pessoal/codex/docs/PRIORITY_SKILL_REFACTORS.md`
- `/mnt/c/Users/maria/Desktop/pessoal/codex/skills/_template/SKILL.md`

Paths relevantes a inspecionar se existirem:
- `/mnt/c/Users/maria/Desktop/AI_OS`
- `/mnt/c/Users/maria/.codex/skills`
- `/mnt/c/Users/maria/.codex/superpowers/skills`

Skills prioritárias para refactor:
- `architect-advisor`
- `verification-orchestrator`
- `code-review-pass`
- `git-workflow-for-maria`

# Autonomy Contract

- A main lane é dona da arquitetura, integração, decisões finais e quality bar.
- Side lanes só devem ser usadas para trabalho paralelo, concreto e não sobreposto.
- Não delegar o passo imediatamente bloqueante da main lane.
- Persistir até sucesso, blocker real, ou conclusão total da missão.
- Verificar depois de cada mudança estrutural relevante.
- No fim, deixar resultado consolidado e handoff útil, não um checkpoint vago.

# Orchestration

## Main lane
Responsável por:
- auditar contexto real
- decidir a fronteira correta entre camadas
- executar alterações de estrutura e documentação
- integrar resultados das side lanes
- correr verificação final
- produzir handoff final

## Side lanes permitidas, se úteis
Usar apenas se houver benefício claro.

### Side lane A — Inventory / Classification
Modelo recomendado: `gpt-5.4-mini`
Escopo:
- inventariar ficheiros relevantes em `AI_OS` e nas skills alvo
- classificar conteúdo como `policy`, `workflow`, `reference`, `project-doc`, `tool-surface`

### Side lane B — Skill Refactor Readiness
Modelo recomendado: `gpt-5.4-mini`
Escopo:
- para cada skill prioritária, identificar:
  - o que fica no `SKILL.md`
  - o que sai para `references/`
  - o que sobe para `AGENTS`
  - o que sobe para `AI_OS`

### Side lane C — Verification / Pressure Tests
Modelo recomendado: `gpt-5.4-mini`
Escopo:
- verificar se descrições são trigger-based
- verificar se há policy global duplicada dentro das skills
- verificar se o `SKILL.md` principal continua utilizável sem carregar tudo

Se o trabalho estiver fortemente acoplado, usar **single agent only**.

# Deliverables

## Required outcomes
1. Ratificar a arquitetura final de contexto e precedência.
2. Limpar duplicações entre `AGENTS`, `AI_OS` e skills.
3. Normalizar a estrutura de `SKILL.md` para progressive disclosure.
4. Refatorar ou preparar refactor executável das skills prioritárias.
5. Definir convenções para `references/`, `templates/`, `examples/` e `scripts/`.
6. Deixar documentação operacional suficiente para continuar sem reabrir esta discussão do zero.

## Preferred artifacts
Criar ou atualizar apenas o necessário.
Priorizar:
- `AGENTS.md` constitucional e curto
- docs de arquitetura e matriz de migração
- templates e convenções
- refactors reais nas skills prioritárias, se os ficheiros estiverem acessíveis e a alteração for segura

# Execution Plan

1. Inspecionar o estado real do `AI_OS`, das skills alvo e dos docs já criados.
2. Construir um inventário de artefactos relevantes.
3. Classificar cada artefacto por tipo e camada correta.
4. Identificar duplicações, conflitos e conteúdo mal colocado.
5. Fixar a arquitetura final:
   - `AGENTS` = constituição e guardrails
   - `AI_OS` = operating system e continuidade
   - `Skills` = workflows reutilizáveis
   - `references/` = material pesado de apoio
   - `docs/` = conhecimento factual e humano
   - `tools` = capability surfaces
6. Atualizar o workspace de planeamento para refletir a arquitetura final.
7. Se for seguro e útil, editar as skills prioritárias reais.
8. Se uma skill real não puder ser alterada nesta sessão, deixar plano de refactor exato, ficheiro a ficheiro.
9. Correr pressure tests de descoberta e progressive disclosure.
10. Consolidar resultados e produzir handoff final.

# Constraints

- Não inventar regras de projeto que não existam.
- Não duplicar conteúdo pesado sem necessidade.
- Não transformar `AGENTS.md` numa wiki.
- Não transformar skills em mini knowledge bases.
- Não usar `references/` para esconder conteúdo essencial sem o qual a skill deixe de funcionar.
- Não fazer mudanças destrutivas em git.
- Não parar em análise parcial.

# Verification

Antes de declarar sucesso, verificar explicitamente:

1. Cada ficheiro criado ou alterado tem um papel distinto.
2. `AGENTS.md` está curto e constitucional.
3. `AI_OS` ficou reservado a continuidade, operating rules e memória transversal.
4. Cada skill migrada tem:
   - descrição “Use when...”
   - workflow core curto
   - supporting resources opcionais
   - output contract
5. Conteúdo global não ficou duplicado dentro das skills.
6. O material pesado foi externalizado apenas quando isso reduziu contexto sem quebrar usabilidade.
7. A arquitetura final permite progressive disclosure real.

# Output

No fim, devolver apenas um closeout objetivo com estas secções:

## 1. Resultados
- o que foi efetivamente alterado
- onde ficaram as decisões principais

## 2. Decisões Fechadas
- regras de precedência
- fronteiras entre camadas
- convenções adotadas para skills

## 3. Pendências Reais
- o que não foi possível concluir
- blockers concretos, se existirem

## 4. Handoff
- próximos passos exatos
- ordem recomendada
- ficheiros a abrir a seguir

## 5. Evidência de Verificação
- que verificações foram feitas
- que critérios passaram
- que riscos residuais sobram

# Working style

- Dar updates curtos durante a execução, mas não pedir direção constante.
- Ser direto, factual e pragmático.
- Favorecer a menor mudança estrutural que aumente clareza, portabilidade e manutenção.
- Só voltar a envolver a utilizadora antes do fim se houver blocker real.
