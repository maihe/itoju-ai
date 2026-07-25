# ARQUITETURA COGNITIVA DO COMPANION

Este documento descreve o *modelo cognitivo* do Companion: não a
arquitetura de software (ver `ARCHITECTURE_DECISIONS.md`), mas a
lógica de comportamento que faz o Companion decidir o que lembrar, o
que perguntar, quando ouvir e como transformar conversas soltas em uma
jornada contínua.

Cada resposta abaixo é dividida em duas partes quando relevante:
**hoje** (o que está de fato implementado na Fase 1 — ver
`ROADMAP.md`) e **visão** (o modelo para o qual a arquitetura já foi
preparada, ainda não implementado). Essa distinção é deliberada: este
documento não deve prometer no papel o que o código ainda não faz.

---

## 1. O que é um Companion?

Um Companion não é definido pelo que ele sabe responder, mas pelo que
ele acompanha ao longo do tempo. A unidade central do domínio não é a
"conversa" — é a **jornada** (`LifeJourney`): uma sequência ordenada e
persistente de eventos da vida da pessoa, dos quais uma troca de
mensagens é apenas um tipo (`chat_message`) entre outros já previstos
(`achievement`, `decision`, `insight`, `weekly_review`,
`goal_completed`, `memory_created` — ver ADR-002).

Isso significa que, estruturalmente, o Companion não trata cada
mensagem como uma interação isolada a ser respondida da melhor forma
possível. Ele trata cada mensagem como **mais um evento em uma
continuidade que já existe** — o que foi dito antes, o que foi
reconhecido como conquista, o que foi decidido, tudo faz parte do
mesmo objeto de domínio que a mensagem atual.

O propósito do Companion (ver `VISION.md`) é ser parceiro de
desenvolvimento pessoal de longo prazo — ganhar clareza, manter
continuidade, caminhar em direção a uma vida mais alinhada com quem a
pessoa quer ser. Ele é avaliado não por tarefas concluídas, mas pelo
critério de sucesso declarado em `VISION.md`: se, depois de conversar,
a pessoa sente mais clareza, menos sobrecarga e vontade de voltar no
dia seguinte.

## 2. O que diferencia um Companion de um chatbot?

| | Chatbot genérico | Companion |
|---|---|---|
| Unidade de trabalho | mensagem → resposta | evento → jornada |
| Estado entre sessões | tipicamente nenhum (ou histórico bruto) | `LifeJourney` persistente, com identidade própria (`id`, `startedAt`) |
| Contrato com a IA | histórico de mensagens | `CompanionContext` — histórico **+** memórias **+** perfil **+** objetivos/projetos ativos (ADR-003) |
| Critério de sucesso | tarefa resolvida, resposta correta | clareza percebida, continuidade, ausência de culpa |
| Postura diante de falha do usuário | neutra ou corretiva | nunca gera culpa; falha é dado, não julgamento (`CONSTITUTION.md` #1) |
| Memória | opcional, geralmente implícita no prompt | modelo explícito com proveniência e consentimento (`MEMORY_MODEL.md`) |

A diferença mais estrutural está em `AIService.generateResponse`: ele
recebe um `CompanionContext`, não uma lista de mensagens. Um chatbot
comum poderia ser implementado com `history: ChatMessage[]` apenas; o
Companion foi desenhado desde a Fase 1 para que memórias, perfil e
(no futuro) objetivos entrem na decisão de resposta sem jamais
quebrar o contrato — porque a intenção do produto nunca foi
"responder bem uma mensagem", e sim "responder bem dentro do
contexto de uma vida inteira".

Outra diferença é de **constituição** (`CONSTITUTION.md`): um chatbot
não tem princípios inegociáveis embutidos no comportamento. O
Companion tem seis, e eles são visíveis no código, não só na
intenção — por exemplo, a `AchievementStrategy` existe porque
"celebrar conquistas" é princípio #5, não um nice-to-have de UX.

## 3. Como ele decide o que lembrar?

**Hoje:** nada é decidido automaticamente. `LoadMemoriesUseCase`
apenas semeia memórias de exemplo na primeira execução
(`buildSeedMemories`), todas já com `status: "confirmed"`. Não há,
ainda, um mecanismo que observe a conversa e proponha uma nova
memória — esse é um gap consciente da Fase 1, não um comportamento
desenhado.

**Visão (Fase 2, `MEMORY_MODEL.md`):** o Companion propõe memórias a
partir de eventos da jornada, nunca as grava direto como fato
permanente. Uma memória nasce como **sugerida** e só se torna ativa
quando a pessoa confirma — "memória é confiança" é o princípio
central do modelo. O que é candidato a virar memória tende a ser:

- algo dito com convicção declarativa (fato, preferência, objetivo);
- uma decisão explícita ("decidi fazer X");
- um padrão que se repete ao longo de várias conversas, não uma única menção;
- uma conquista nomeada como tal — que já é reconhecida hoje na
  conversa pela `AchievementStrategy`, mesmo sem ainda virar `Memory`
  persistida.

Toda memória deve ter **proveniência**: o evento da jornada que a
originou, para que a sugestão seja auditável e explicável — nunca uma
inferência opaca. Isso é o mesmo princípio de `CONSTITUTION.md` #3
("sempre explicar recomendações") aplicado à memória: o Companion
nunca lembra de algo que não possa justificar de onde veio.

## 4. Como ele decide o que esquecer?

"Esquecer" no Companion nunca significa apagar. `LifeJourney` é um
log de eventos apend-only — mesmo `ClearJourneyUseCase` não apaga a
jornada anterior tecnicamente, ele encerra e persiste uma nova vazia
(a mesma lógica de preservação histórica está prevista para memória).

**Visão (`MEMORY_MODEL.md`):** uma memória pode ter quatro estados —
`suggested`, `confirmed`, `rejected`, `archived`. "Esquecer" tem dois
significados distintos nesse modelo:

- **Rejeitar** — a pessoa nega explicitamente uma sugestão; a memória
  não é usada e, principio importante, **não é ressugerida**. Isso
  evita o Companion insistir em algo que já foi recusado.
- **Arquivar** — a memória foi verdadeira e útil, mas deixou de ser
  relevante (um objetivo antigo concluído, um projeto encerrado). Ela
  é preservada como histórico, mas para de entrar no contexto ativo
  (`CompanionContext.memories` / futuro `relevantMemories`).

Ou seja, o Companion decide o que esquecer não pela idade da
informação, mas pela **relevância presente** dela — o dado continua
existindo para fins de continuidade e auditoria, só deixa de
participar da conversa atual.

**Hoje:** essa lógica de relevância ainda não existe —
`ContextEngine.build()` carrega e injeta *todas* as memórias sem
filtro. A decisão de "o que esquecer" (isto é, o que não deveria mais
entrar em contexto) é o próximo trabalho real da Fase 2, não algo já
resolvido.

## 5. Como ele decide quando fazer perguntas?

**Hoje**, essa decisão vive inteiramente no motor de estratégias de
`PrototypeCompanionAIService` (`infrastructure/ai/prototype/`). Cada
`ResponseStrategy` declara uma condição de correspondência
(`matches`) avaliada em ordem de prioridade — casos específicos antes
do fallback:

1. **Overwhelm** — se a mensagem sinaliza sobrecarga/exaustão/ansiedade,
   o Companion não sugere um plano; ele faz uma única pergunta para
   localizar o que pesa mais agora, antes de qualquer solução.
2. **Planning** — se a mensagem sinaliza intenção de organizar ou
   priorizar, o Companion pergunta pelo resultado desejado antes de
   ordenar tarefas — a pergunta serve para achar a prioridade real, não
   para coletar informação por coletar.
3. **Default** — quando nenhum sinal específico é detectado, o
   Companion faz exatamente uma pergunta aberta e curta (nunca um
   questionário) para entender o que a pessoa quer que aconteça
   naquela conversa.

O padrão comum é: **no máximo uma pergunta por resposta**, sempre a
serviço de entender antes de agir — nunca perguntas para preencher
espaço ou parecer engajado. Isso concretiza `CONSTITUTION.md` #3
("sempre explicar recomendações") e #6 ("preservar autonomia"): o
Companion pergunta para que a pessoa decida com mais clareza, não
para conduzir a pessoa a uma resposta pré-definida.

**Visão:** quando `AIService` for substituído por uma LLM real, o
*mecanismo* de correspondência por palavra-chave desaparece, mas o
princípio "perguntar é uma ferramenta de clareza, usada com
parcimônia" precisa sobreviver à troca — é comportamento do produto,
não detalhe da implementação atual.

## 6. Como ele decide quando apenas ouvir?

A `AchievementStrategy` é o caso mais claro de "ouvir antes de agir":
quando a pessoa relata algo concluído ou conquistado, o Companion não
pula direto para "e agora, o que vem depois?". A resposta primeiro
**reconhece e valida** ("isso é uma conquista real — vale pausar um
segundo") e só depois de validar é que faz uma pergunta — e mesmo
essa pergunta é reflexiva, não prospectiva (o que tornou isso
possível, não qual é o próximo passo).

Esse é o princípio #5 da `CONSTITUTION.md` em código: "não existe
conquista pequena demais para ser notada". A ordem importa —
reconhecer antes de perguntar é, na prática hoje, a forma que "ouvir"
assume no Companion: não é literalmente ficar em silêncio, é recusar
o reflexo de emendar imediatamente na próxima cobrança ou tarefa.

**Honestidade sobre o estado atual:** nenhuma das quatro estratégias
de hoje termina sem alguma pergunta — não existe ainda um modo de
resposta "puramente de escuta", sem nenhum convite a continuar. Isso é
uma limitação real do protótipo baseado em regras, não uma decisão de
produto. O princípio #2 da constituição ("continuidade é mais
importante que intensidade") sugere que o Companion deveria, em
certos momentos, ser capaz de responder apenas validando, sem abrir
uma nova pergunta — esse é um refinamento em aberto para quando o
`AIService` deixar de ser baseado em regras fixas.

## 7. Como ele transforma conversas em continuidade?

A transformação acontece porque a conversa nunca é o objeto final —
ela é matéria-prima para eventos de uma jornada que persiste além da
sessão atual:

- Toda mensagem trocada vira um `ChatMessageEvent` **permanente**,
  com `id` e `createdAt` próprios, anexado a uma `LifeJourney` que
  sobrevive ao fechamento da aba (persistida hoje em `localStorage`,
  ADR-004). Um chatbot comum recomeça em branco a cada sessão; o
  Companion sempre volta para o mesmo objeto de domínio.
- A cada nova mensagem, o `ContextEngine` reconstrói o histórico
  completo da jornada (`extractChatHistory`) e o injeta no
  `CompanionContext` — a resposta gerada é sempre condicionada por
  tudo que já aconteceu naquela jornada, não apenas pela última
  mensagem.
- O modelo de eventos foi desenhado (ADR-002) para que continuidade
  não fique restrita a texto de chat: `achievement`, `decision`,
  `insight` e `weekly_review` são marcos deliberadamente distintos de
  uma mensagem comum — a visão de produto é que a jornada acumule uma
  linha do tempo de momentos que importam, não um log plano de
  conversas (isso alimenta a Fase 6 — Dashboard).
- **Visão (Fases 2–3):** memórias confirmadas e retomada consciente
  entre sessões ("da última vez você disse...") são os dois
  mecanismos que fecham o ciclo — a jornada guarda o que aconteceu, a
  memória guarda o que importa lembrar sobre a pessoa, e a
  continuidade ativa é o Companion usar essas duas coisas para
  recomeçar cada conversa já sabendo onde a pessoa parou, em vez de
  perguntar de novo o que ela já disse.

Continuidade, portanto, não é um recurso de UI (como "histórico de
chat visível") — é uma propriedade estrutural do domínio: a jornada
existe independentemente da UI que a renderiza, e cada novo tipo de
evento que a Fase N adicionar entra nessa mesma continuidade sem
precisar recriar o conceito.

---

## Referência cruzada

| Pergunta | Documentos relacionados | Código relacionado |
|---|---|---|
| O que é um Companion | `VISION.md` | `LifeJourney.ts`, `JourneyEvent.ts` |
| Diferença de chatbot | `VISION.md`, `CONSTITUTION.md` | `AIService.ts` (`CompanionContext`) |
| O que lembrar | `MEMORY_MODEL.md` | `Memory.ts`, `LoadMemoriesUseCase.ts` |
| O que esquecer | `MEMORY_MODEL.md` | `Memory.ts` (`MemoryStatus`), `MemoryRepository.ts` |
| Quando perguntar / ouvir | `CONSTITUTION.md` | `ResponseStrategy.ts` e `strategies/*` |
| Conversas → continuidade | `ARCHITECTURE_DECISIONS.md` (ADR-002), `ROADMAP.md` | `ContextEngine.ts`, `SendChatMessageUseCase.ts` |

Este documento deve ser atualizado sempre que uma fase do `ROADMAP.md`
mudar o comportamento cognitivo real do Companion — a distinção
**hoje / visão** em cada seção é o que impede este documento de
divergir do código como aconteceu em produtos que documentam intenção
e esquecem de revisar quando a intenção vira (ou não vira)
implementação.
