import type { ChatMessage } from "@/domain/entities/ChatMessage";
import { lastUserMessage, type ResponseStrategy } from "../ResponseStrategy";

/**
 * Fallback: sem sinal claro no conteúdo, o Companion busca clareza
 * antes de sugerir qualquer coisa. Uma pergunta só, aberta e curta.
 */
export const DefaultStrategy: ResponseStrategy = {
  name: "default",
  matches() {
    return true;
  },
  respond(context): ChatMessage {
    const user = lastUserMessage(context).trim();
    const opening =
      context.history.length <= 1
        ? "Que bom te ver por aqui. Este é um espaço seu — sem cobrança, sem julgamento."
        : "Estou aqui, te acompanhando.";

    const reflection = user
      ? `Do que você me contou, o que mais chama atenção é: *"${truncate(user)}"*.`
      : "";

    return {
      role: "companion",
      content: [
        opening,
        reflection,
        "Para eu te acompanhar melhor: **o que você gostaria que acontecesse ao final desta conversa?** Pode ser clareza sobre algo, desabafar, ou só pensar em voz alta — qualquer resposta é válida.",
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  },
};

function truncate(text: string, max = 140): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}
