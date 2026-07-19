import type { ChatMessage } from "@/domain/entities/ChatMessage";
import type { CompanionContext } from "@/domain/ports/AIService";

/**
 * ResponseStrategy — unidade mínima de comportamento do protótipo.
 *
 * Cada estratégia decide se se aplica ao contexto atual (`matches`) e,
 * em caso positivo, produz a resposta do Companion (`respond`).
 *
 * Essa estrutura existe para que a lógica baseada em regras possa ser
 * removida sem afetar o restante da aplicação: quando o AIService for
 * trocado por uma LLM real, a nova implementação simplesmente ignora
 * as estratégias — o contrato `AIService` continua o mesmo.
 */
export interface ResponseStrategy {
  readonly name: string;
  matches(context: CompanionContext): boolean;
  respond(context: CompanionContext): ChatMessage;
}

export function lastUserMessage(context: CompanionContext): string {
  const last = [...context.history].reverse().find((m) => m.role === "user");
  return last?.content ?? "";
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function containsAny(text: string, keywords: readonly string[]): boolean {
  const n = normalize(text);
  return keywords.some((k) => n.includes(normalize(k)));
}
