# ROADMAP

Evolução prevista do Companion por fases. Cada fase é um incremento
sobre a anterior; nenhuma pula etapas.

## Fase 1 — Conversa (MVP atual)

- Uma única jornada contínua.
- Um único tipo de evento implementado: `ChatMessage`.
- Persistência local (localStorage).
- `AIService` como porta, com stub `EchoAIService`.
- Sem autenticação, sem backend, sem LLM real.

## Fase 2 — Memória

- Introduzir o modelo descrito em `MEMORY_MODEL.md`.
- Sugestão explícita de memórias pelo Companion.
- Confirmação/rejeição pela pessoa.
- Recuperação de memórias relevantes no `CompanionContext`.

## Fase 3 — Continuidade

- Retomada consciente entre sessões — a conversa continua de onde
  parou, sem pedir para a pessoa repetir contexto e sem citar o que
  foi dito apenas para provar que foi lembrado.
- Detecção de padrões ao longo do tempo.
- Check-ins leves.

## Fase 4 — Objetivos

- Objetivos como cidadãos de primeira classe do domínio.
- Ligação entre conversas, memórias e objetivos ativos.
- Progresso sem cobrança.

## Fase 5 — Revisões

- Revisões semanais e mensais estruturadas.
- Registradas como eventos da jornada (`WeeklyReview`).
- Celebração de conquistas e recalibração de rumo.

## Fase 6 — Dashboard

- Visão de longo prazo da jornada.
- Linha do tempo, padrões, conquistas, objetivos.
- Espaço para reflexão, não para métricas de produtividade.
