import type { ChatMessage } from "./ChatMessage";

/**
 * JourneyEvent — união discriminada de tudo que pode acontecer em
 * uma LifeJourney.
 *
 * Hoje apenas `chat_message` está implementado. Os demais tipos
 * estão declarados como marcadores para orientar a evolução (ver
 * ADR-002 e ROADMAP.md). Quando cada um for implementado, seu
 * payload é definido em `domain/entities/` e o `unknown` abaixo é
 * substituído pelo tipo real.
 */

export type JourneyEventType =
  | "chat_message"
  | "weekly_review"
  | "achievement"
  | "decision"
  | "insight"
  | "memory_created"
  | "goal_completed";

interface JourneyEventBase<T extends JourneyEventType, P> {
  id: string;
  type: T;
  createdAt: string; // ISO 8601
  payload: P;
}

export type ChatMessageEvent = JourneyEventBase<"chat_message", ChatMessage>;

// Placeholders — implementação virá em fases posteriores.
export type WeeklyReviewEvent = JourneyEventBase<"weekly_review", unknown>;
export type AchievementEvent = JourneyEventBase<"achievement", unknown>;
export type DecisionEvent = JourneyEventBase<"decision", unknown>;
export type InsightEvent = JourneyEventBase<"insight", unknown>;
export type MemoryCreatedEvent = JourneyEventBase<"memory_created", unknown>;
export type GoalCompletedEvent = JourneyEventBase<"goal_completed", unknown>;

export type JourneyEvent =
  | ChatMessageEvent
  | WeeklyReviewEvent
  | AchievementEvent
  | DecisionEvent
  | InsightEvent
  | MemoryCreatedEvent
  | GoalCompletedEvent;
