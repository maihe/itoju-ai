import type { ChatMessage } from "@/domain/entities/ChatMessage";
import type { AIService, CompanionContext } from "@/domain/ports/AIService";

/**
 * EchoAIService — stub de LLM para a Fase 1 (ver ADR-005).
 *
 * Devolve uma resposta previsível baseada na última mensagem do usuário,
 * apenas para exercitar o fluxo ponta a ponta. Substituir por uma
 * implementação real (Lovable AI, OpenAI, Gemini, ...) é criar uma nova
 * classe que implementa `AIService` e registrá-la em `composition/container.ts`.
 */
export class EchoAIService implements AIService {
  async generateResponse(context: CompanionContext): Promise<ChatMessage> {
    const last = [...context.history].reverse().find((m) => m.role === "user");
    const content = last
      ? `Ouvi você dizer: "${last.content}". Quando a IA real estiver conectada, aqui virá uma resposta pensada para o seu momento.`
      : "Olá. Este é o Companion. Quando você quiser começar, é só escrever.";

    // Pequeno atraso simulado para tornar a UI mais natural.
    await new Promise((resolve) => setTimeout(resolve, 250));

    return { role: "companion", content };
  }
}
