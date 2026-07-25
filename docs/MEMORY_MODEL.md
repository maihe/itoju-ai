# MEMORY MODEL

Referência conceitual para a futura memória do Companion.
**Nada aqui está implementado no MVP.** Este documento existe para
orientar as Fases 2+ e manter coerência entre design, produto e
código quando a memória for construída.

Memória aqui é **infraestrutura, não o diferencial do produto** (ver
`PRODUCT_STRATEGY.md`, "Onde competimos"). Ela existe para que o
Companion reduza carga cognitiva — nunca para ser exibida como prova
de que o sistema lembra.

## Princípio

Memória é confiança. O Companion nunca grava um fato permanente sobre
a pessoa sem consentimento explícito (ver `CONSTITUTION.md`).

Memória também só vale a pena recuperar quando muda a qualidade da
resposta atual. Uma memória confirmada não entra automaticamente em
todo `CompanionContext` futuro — se recuperá-la não muda o que o
Companion diria, ela permanece invisível. A IA nunca recupera uma
memória apenas para demonstrar que lembra.

## Tipos de memória previstos

- **Fato** — algo estável sobre a pessoa ou seu contexto.
- **Objetivo** — algo que a pessoa quer alcançar.
- **Projeto** — um esforço em andamento, com começo e (idealmente) fim.
- **Preferência** — gostos, estilos, formas de trabalhar.
- **Hipótese** — algo que o Companion suspeita mas ainda não confirmou.
- **Padrão observado** — regularidade percebida ao longo do tempo.
- **Conquista** — algo realizado que merece ser lembrado.
- **Decisão** — escolha importante feita pela pessoa.
- **Relacionamento** — pessoas relevantes na vida da pessoa.
- **Evento importante** — marco significativo no tempo.

## Estados de uma memória

Toda memória vive em uma máquina de estados:

- **Sugerida** — o Companion propôs, aguarda confirmação.
- **Confirmada** — a pessoa validou; a memória é usada em contexto.
- **Rejeitada** — a pessoa negou; não é usada e não é resugerida.
- **Arquivada** — deixou de ser relevante mas é preservada como
  histórico; não entra mais no contexto ativo.

## Notas para implementação futura

- Cada memória deve ter proveniência (evento da jornada que a
  originou) para permitir auditoria e explicabilidade.
- A recuperação de memórias **relevantes** (não todas as confirmadas)
  alimentará o campo `relevantMemories` de `CompanionContext` (ver
  ADR-003) — relevância aqui significa "muda a resposta", não "está
  confirmada".
- A criação de uma memória gera um evento `MemoryCreated` na jornada.
