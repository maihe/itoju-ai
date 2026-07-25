# Itọ́ju

Projeto pessoal de desenvolvimento — um "Companion" de acompanhamento
contínuo, construído com TanStack Start (React) e Clean Architecture.

## Status

Projeto pessoal, em desenvolvimento ativo, para uso próprio diário.
Não está aberto a contribuições externas — issues e pull requests não
serão avaliados.

## Stack

- TanStack Start (React 19, SSR)
- TypeScript
- Tailwind CSS
- Clean Architecture (`domain` / `application` / `infrastructure` / `presentation`)
- OpenRouter como camada de acesso ao modelo de IA

## Rodando localmente

```bash
bun install
bun run dev
```

Requer um arquivo `.env` com as variáveis descritas em `.env.example`
(chave de API do OpenRouter).

## Estrutura

Ver `CLAUDE.md` para o mapa completo da arquitetura.
