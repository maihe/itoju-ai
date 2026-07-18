# ARCHITECTURE DECISIONS

Registro de decisões arquiteturais (ADRs) do Companion. Cada entrada
descreve contexto, decisão e consequências. Novas decisões são
adicionadas ao final; decisões antigas não são apagadas — são
superseded por outras mais recentes se necessário.

---

## ADR-001 — Clean Architecture com portas e adapters

**Contexto.** O Companion é um produto de longo prazo cujas
implementações concretas (LLM, persistência, autenticação) vão mudar
várias vezes. Precisamos que essas trocas não afetem o núcleo do
produto.

**Decisão.** Adotamos Clean Architecture com quatro camadas:
`domain`, `application`, `infrastructure`, `presentation`. As
dependências apontam sempre para dentro. O domínio não importa nada
externo. A infraestrutura implementa portas declaradas no domínio.

**Consequência.** Um pouco mais de código de estrutura no MVP, mas
qualquer troca futura (localStorage → Supabase, Echo → LLM real,
autenticação, etc.) é isolada em `infrastructure/` + `composition/`.

---

## ADR-002 — Domínio modelado como `LifeJourney` + `JourneyEvent`

**Contexto.** O produto não é um chat. O chat é apenas a primeira
interface. No futuro coexistirão conversas, revisões, conquistas,
decisões, insights, memórias e objetivos.

**Decisão.** O agregado central é `LifeJourney`, que contém uma lista
ordenada de `JourneyEvent`. `JourneyEvent` é uma união discriminada
por `type`. Hoje só `ChatMessage` é implementado; os demais tipos
(`WeeklyReview`, `Achievement`, `Decision`, `Insight`, `MemoryCreated`,
`GoalCompleted`) já estão declarados como marcadores para orientar a
evolução.

**Consequência.** A UI passa a ser "renderer de eventos" e não
"renderer de mensagens". Novos tipos entram sem refatorar o domínio.

---

## ADR-003 — `AIService` recebe `CompanionContext`, não histórico

**Contexto.** Um contrato baseado apenas em histórico de mensagens
seria retrabalhado assim que memória, objetivos e perfil entrassem.

**Decisão.** A porta `AIService` expõe
`generateResponse(context: CompanionContext)`. `CompanionContext` é
um objeto extensível cujo único campo obrigatório hoje é `history`;
os demais (perfil, memórias relevantes, objetivos ativos, energia,
revisões) já estão previstos como opcionais.

**Consequência.** Adicionar uma nova fonte de contexto não muda a
assinatura da porta nem quebra implementações existentes.

---

## ADR-004 — Persistência local no MVP, trocável sem tocar em domínio

**Contexto.** O MVP não tem backend e precisa ser usável imediatamente
no navegador.

**Decisão.** Implementamos `LocalStorageJourneyRepository` e
`LocalStorageUserProfileRepository` como adapters da porta
`JourneyRepository` (e equivalente para perfil). Qualquer repositório
remoto futuro (Supabase, outro backend) implementa a mesma porta.

**Consequência.** Migração para backend não afeta `domain/` nem
`application/`. Basta trocar as implementações registradas no
`composition/container.ts`.

---

## ADR-005 — Sem backend, sem LLM real e sem autenticação no MVP

**Contexto.** A prioridade é validar a hipótese de valor descrita em
`VISION.md` o mais rápido possível.

**Decisão.** Nenhum backend, nenhum provedor de LLM e nenhuma
autenticação são incluídos na Fase 1. O `AIService` é um stub
(`EchoAIService`) suficiente para exercitar a interface e o fluxo.

**Consequência.** Uso imediato, sem contas nem chaves. As integrações
reais entram em fases posteriores como implementações das portas já
existentes.
