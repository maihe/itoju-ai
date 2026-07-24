import type {
  ChatMessageEvent,
} from "@/domain/entities/JourneyEvent";
import type { ChatMessage } from "@/domain/entities/ChatMessage";
import type { LifeJourney } from "@/domain/entities/LifeJourney";
import type { AIService } from "@/domain/ports/AIService";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";
import { AppendEventUseCase } from "./AppendEventUseCase";
import type { ContextEngine } from "./ContextEngine";

/**
 * SendChatMessageUseCase — orquestra o fluxo completo de uma mensagem:
 *
 * 1. Cria o evento de mensagem do usuário e persiste na jornada.
 * 2. Delega ao `ContextEngine` a montagem do `CompanionContext` a
 *    partir dos repositórios (histórico, perfil, memórias, ...).
 * 3. Chama o `AIService` com o contexto consolidado.
 * 4. Persiste o evento de resposta do companion.
 *
 * O AIService nunca conversa com repositórios diretamente — recebe o
 * contexto pronto e permanece puro.
 */
export class SendChatMessageUseCase {
  private readonly append: AppendEventUseCase;

  constructor(
    private readonly ai: AIService,
    repo: JourneyRepository,
    private readonly contextEngine: ContextEngine,
  ) {
    this.append = new AppendEventUseCase(repo);
  }

  async execute(
    journey: LifeJourney,
    userContent: string,
  ): Promise<LifeJourney> {
    const userEvent = this.buildChatEvent({
      role: "user",
      content: userContent,
    });
    let updated = await this.append.execute(journey, userEvent);

    const context = await this.contextEngine.build(updated);
    const reply = await this.ai.generateResponse(context);

    const companionEvent = this.buildChatEvent(reply);
    updated = await this.append.execute(updated, companionEvent);

    return updated;
  }

  private buildChatEvent(message: ChatMessage): ChatMessageEvent {
    return {
      id: crypto.randomUUID(),
      type: "chat_message",
      createdAt: new Date().toISOString(),
      payload: message,
    };
  }
}
