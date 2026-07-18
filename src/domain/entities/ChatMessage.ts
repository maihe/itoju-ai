/**
 * ChatMessage — payload do primeiro tipo de evento da jornada.
 *
 * Representa uma fala trocada entre a pessoa e o Companion. É apenas
 * o payload; o envelope de evento vive em `JourneyEvent`.
 */
export type ChatRole = "user" | "companion";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}
