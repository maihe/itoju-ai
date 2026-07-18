## Companion — estrutura inicial (final)

Companion de desenvolvimento pessoal de longo prazo. Nesta etapa entregamos apenas a base arquitetural + o primeiro tipo de evento (mensagem de chat), persistido em localStorage, sem LLM real, sem backend, sem auth.

### Modelo de domínio

Domínio gira em torno da **jornada** da pessoa. A conversa é apenas um tipo de evento.

- `LifeJourney` — agregado principal, contém lista ordenada de eventos.
- `JourneyEvent` — união discriminada por `type`. Base: `{ id, type, createdAt, payload }`.
  - Implementado: `ChatMessage` (`role: 'user' | 'companion'`, `content`).
  - Reservado (tipos declarados, sem implementação): `WeeklyReview`, `Achievement`, `Decision`, `Insight`, `MemoryCreated`, `GoalCompleted`.
- `UserProfile` — `{ id, name?, identity?, preferences, knownFacts }`, quase todo vazio no MVP.

### AIService — contrato baseado em contexto

```ts
export interface CompanionContext {
  history: ChatMessage[];
  profile?: UserProfile;
  // futuros: relevantMemories, activeGoals, projects, energy, weeklyReviews...
}
export interface AIService {
  generateResponse(context: CompanionContext): Promise<ChatMessage>;
}
```

Implementação inicial: `EchoAIService` stub. Trocar por LLM real depois é só criar nova classe e registrar no container.

### Estrutura

```text
docs/
  VISION.md
  CONSTITUTION.md
  ROADMAP.md
  ARCHITECTURE_DECISIONS.md
  MEMORY_MODEL.md

src/
  domain/
    entities/{LifeJourney,JourneyEvent,ChatMessage,UserProfile}.ts
    ports/{AIService,JourneyRepository}.ts
  application/
    {AppendEvent,SendChatMessage,LoadJourney,ClearJourney}UseCase.ts
  infrastructure/
    ai/EchoAIService.ts
    storage/{LocalStorageJourneyRepository,LocalStorageUserProfileRepository}.ts
  composition/container.ts
  presentation/
    hooks/useJourney.ts
    components/{JourneyView,ChatMessageBubble,Composer}.tsx
  routes/{__root,index}.tsx
```

Dependências: `presentation → application → domain`; `infrastructure` implementa portas; tudo conectado em `composition/container.ts`. `domain` não importa nada externo.

### Documentos

- **VISION.md** — propósito, hipótese do MVP, problema, e explicitamente o **critério de sucesso do MVP**:
  > «Após uma conversa de menos de 10 minutos, o usuário deve sentir mais clareza, menos sobrecarga mental, saber qual é o próximo passo e ter vontade de voltar no dia seguinte.»
- **CONSTITUTION.md** — princípios: nunca gerar culpa; continuidade > intensidade; sempre explicar recomendações; perguntar antes de salvar memória permanente; celebrar conquistas; preservar autonomia.
- **ROADMAP.md** — Fase 1 Conversa · Fase 2 Memória · Fase 3 Continuidade · Fase 4 Objetivos · Fase 5 Revisões · Fase 6 Dashboard.
- **ARCHITECTURE_DECISIONS.md** — ADRs: (1) Clean Architecture com portas/adapters; (2) domínio como `LifeJourney` + `JourneyEvent`; (3) `AIService` recebe `CompanionContext`; (4) persistência localStorage no MVP, trocável sem afetar domínio/aplicação; (5) sem backend/LLM/auth no MVP.
- **MEMORY_MODEL.md** — referência conceitual para a futura memória da IA. Nada implementado agora.
  - Tipos previstos: Fato, Objetivo, Projeto, Preferência, Hipótese, Padrão observado, Conquista, Decisão, Relacionamento, Evento importante.
  - Estados previstos: Sugerida, Confirmada, Rejeitada, Arquivada.

### UI

- `src/routes/index.tsx` substitui o placeholder e renderiza `JourneyView`.
- `JourneyView` faz *switch* por `type` — hoje só renderiza `ChatMessage`, estrutura pronta para novos tipos.
- `Composer` envia texto → `SendChatMessageUseCase`. Textarea mantém foco ao montar, após enviar e após "Nova jornada".
- Tokens semânticos em `src/styles.css`, sem cores hardcoded. Metadata Companion em `__root.tsx`.

### Fora de escopo

Auth, backend/Supabase, múltiplas jornadas, LLM real, streaming, implementação de memória, objetivos, revisões, dashboard, testes.
