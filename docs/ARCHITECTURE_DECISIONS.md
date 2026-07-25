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

---

## ADR-006 — IA real via OpenRouter, atrás de uma fronteira de servidor

**Contexto.** O ADR-005 postergou LLM real, backend e autenticação
para depois da Fase 1, para validar a hipótese de valor descrita em
`VISION.md` o mais rápido possível com um stub. Essa hipótese já foi
testada até o limite possível com um motor de regras fixas —
`COGNITIVE_ARCHITECTURE.md` documenta a limitação estrutural (nenhuma
das quatro estratégias hoje termina sem alguma pergunta).
`PRODUCT_STRATEGY.md` já prioriza IA real como item #1, e o próprio
propósito do produto — cuidar do corpo e dos projetos da mente,
reduzir atrito no que é imprescindível manter, ajudar a decidir e
agir (ver `VISION.md`) — depende de uma conversa que responda de
verdade ao que a pessoa diz, não de respostas fixas por
palavra-chave. Adicionalmente, decidimos não acoplar o produto a um
único fornecedor de IA.

**Decisão.** `AIService` (porta de domínio, inalterada — ADR-003)
ganha uma implementação real, `OpenRouterCompanionAIService`, que
fala com o OpenRouter (API compatível com OpenAI) em vez do SDK de
um provedor específico. A chamada roda inteiramente atrás de uma
server function do TanStack Start — a chave de API nunca chega ao
cliente. A escolha de modelo é uma `ModelConfiguration` lida de
variáveis de ambiente do servidor, nunca hardcoded nem exposta ao
bundle do cliente. A etapa de perceber estado da pessoa e escolher
intervenção permanece encapsulada no prompt (ver
`COGNITIVE_ARCHITECTURE.md`, seção 8) — não é um componente novo de
código, é comportamento descrito em linguagem dentro da mesma
chamada.

**Consequência.** `domain/` e `application/` permanecem sem qualquer
conhecimento de Anthropic, OpenAI, Gemini ou OpenRouter. Trocar de
modelo — inclusive de fornecedor — passa a ser mudança de
configuração, não de código. Não introduzimos um backend novo — a
mudança usa o servidor SSR que a TanStack Start já provisiona
(Nitro), só adicionando uma rota autenticada por variável de
ambiente. Este ADR qualifica o ADR-005 — que permanece registrado
como estava, sem edição — apenas nas cláusulas "sem LLM real" e "sem
backend"; ADR-003 (`CompanionContext`) e ADR-004 (persistência local)
seguem válidos sem alteração. Uma interface formal de "provider" não
é introduzida agora — só se justificaria diante de um segundo
mecanismo de chamada concreto, que ainda não existe.
