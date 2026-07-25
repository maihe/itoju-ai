# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Itoju Companion — a long-term personal-development companion app (not a
task chatbot). Product intent, principles, and roadmap live in `docs/`
and should be read before any feature or copy change:

- `docs/VISION.md` — purpose and the MVP's single success criterion.
- `docs/CONSTITUTION.md` — non-negotiable behavioral principles (never
  induce guilt, always explain recommendations, ask before saving a
  permanent memory, celebrate achievements, preserve autonomy). Any
  change to response generation, memory handling, or Companion copy
  must respect these.
- `docs/MEMORY_MODEL.md` — the memory model planned for Phase 2+ (not
  yet implemented — see Roadmap).
- `docs/ROADMAP.md` — the 6 planned phases; the codebase is currently
  entirely in Phase 1 (Conversation).
- `docs/ARCHITECTURE_DECISIONS.md` — ADRs explaining *why* the layering
  and ports below exist. Read this before proposing a structural
  change; add a new ADR entry (never edit/delete old ones) if you make
  one.
- `docs/COGNITIVE_ARCHITECTURE.md` — the behavioral/cognitive model
  (how the Companion decides what to remember, forget, ask, or just
  acknowledge).

This project is connected to **Lovable** (see `AGENTS.md`): never
rewrite published git history (no force-push, no rebase/amend/squash of
already-pushed commits) — it desyncs the user's Lovable editor history.
Keep the connected branch in a working state.

## Commands

Package manager is **bun** (`bun.lock`, `bunfig.toml`).

```bash
bun install      # install deps
bun run dev      # vite dev server
bun run build    # production build
bun run build:dev  # build in development mode
bun run preview  # preview a production build
bun run lint     # eslint .
bun run format   # prettier --write .
```

There is no test suite in this repository (no test runner configured,
no `*.test.*`/`*.spec.*` files). Don't assume one exists or invent a
`bun test` command — verify before referencing tests to a user.

`bunfig.toml` enforces a 24h supply-chain guard on new dependencies
(`minimumReleaseAge`). Adding a dependency published in the last 24h
will fail install; adding an exclusion to `minimumReleaseAgeExcludes`
requires user confirmation first.

## Architecture

Clean Architecture with four layers under `src/`, dependencies always
pointing inward (`domain` ← `application` ← `infrastructure`/`presentation`).
The wiring between them lives in exactly one place:
`src/composition/container.ts` (`getContainer()`, a cached singleton).
Swapping any concrete implementation (real LLM instead of the rule
engine, a remote backend instead of localStorage) is a change localized
to `infrastructure/` + one line in `container.ts` — domain, application,
and presentation code should never need to change for that.

- **`src/domain`** — `entities/` (pure types/factories: `LifeJourney`,
  `JourneyEvent`, `ChatMessage`, `Memory`, `UserProfile`) and `ports/`
  (interfaces only: `AIService`, `JourneyRepository`,
  `MemoryRepository`, `UserProfileRepository`). No imports from outside
  this layer.
- **`src/application`** — use cases (`SendChatMessageUseCase`,
  `AppendEventUseCase`, `LoadJourneyUseCase`, `ClearJourneyUseCase`,
  `LoadMemoriesUseCase`) and `ContextEngine`, the *only* place allowed
  to read from repositories to assemble a `CompanionContext`. An
  `AIService` implementation must never talk to repositories directly.
- **`src/infrastructure`** — concrete adapters: `PrototypeCompanionAIService`
  (a rule-based `AIService` stub, not a real LLM — see ADR-005) built
  from a `ResponseStrategy` list evaluated in priority order
  (`infrastructure/ai/prototype/strategies/`, most specific first,
  `DefaultStrategy` last as fallback); and three `LocalStorage*Repository`
  classes (journey, memory, profile), each SSR-guarded
  (`typeof window === "undefined"` short-circuits to no-op).
- **`src/presentation`** — components and hooks (`useJourney`,
  `useMemories`). Components/hooks must go through use cases via
  `getContainer()`, never touch infrastructure or repositories
  directly.

Domain model shape worth internalizing: the product is not "a chat"
but a `LifeJourney` — an ordered, append-only list of `JourneyEvent`s
discriminated by `type`. Today only `chat_message` is implemented;
`weekly_review`, `achievement`, `decision`, `insight`, `memory_created`,
`goal_completed` are declared as typed placeholders (`payload: unknown`)
to signal where future phases plug in (ADR-002) — extend the union and
the `switch` in `JourneyView`'s `EventRenderer` when implementing one.

`AIService.generateResponse` takes a `CompanionContext`
(`domain/ports/AIService.ts`), not a raw message history — `history` and
`memories` are the only required fields today; `profile`, `activeGoals`,
`activeProjects`, `weeklyReview` are optional and reserved so that
future context sources never change the port's signature (ADR-003).

### Routing / framework

TanStack Start (file-based routing under `src/routes/`, see
`src/routes/README.md` for conventions — don't create `src/pages/` or
Next.js/Remix-style route files). `src/router.tsx` wires the router +
`QueryClient`; `src/routeTree.gen.ts` is auto-generated, never hand-edit
it. `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which
already bundles TanStack devtools/start, React, Tailwind, tsconfig
paths, and Nitro — do not add those plugins again manually (see the
comment at the top of the file).

`src/server.ts` / `src/start.ts` wrap SSR errors so that h3-swallowed
500s (which bypass a plain try/catch) still render a proper error page
via `src/lib/error-capture.ts` + `src/lib/error-page.ts`; don't remove
this wrapping when touching the server entry.

Path alias: `@/*` → `./src/*` (see `tsconfig.json`).
