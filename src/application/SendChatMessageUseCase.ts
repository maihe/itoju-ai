import type { ChatMessage } from "@/domain/entities/ChatMessage";
import type {
  ChatMessageEvent,
  JourneyEvent,
} from "@/domain/entities/JourneyEvent";
import type { LifeJourney } from "@/domain/entities/LifeJourney";
import type { UserProfile } from "@/domain/entities/UserProfile";
import type { AIService } from "@/domain/ports/AIService";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";
import { AppendEventUseCase } from "./AppendEventUseCase";

/**
 * SendChatMessageUseCase — orquestra o fluxo completo de uma mensagem:
 *
 * 1. Cria o evento de mensagem do usuário e persiste na jornada.
 * 2. Monta o CompanionContext a partir do histórico de chat.
 * 3. Chama o AIService para gerar a resposta.
 * 4. Persiste o evento de resposta do companion.
 *
 * Nenhuma dependência concreta: recebe as portas via construtor.
 */
export class SendChatMessageUseCase {
  private readonly append: AppendEventUseCase;

  constructor(
    private readonly ai: AIService,
    repo: JourneyRepository,
  ) {
    this.append = new AppendEventUseCase(repo);
  }

  async execute(
    journey: LifeJourney,
    userContent: string,
    profile?: UserProfile,
  ): Promise<LifeJourney> {
    const userEvent = this.buildChatEvent({
      role: "user",
      content: userContent,
    });
    let updated = await this.append.execute(journey, userEvent);

    const history = extractChatHistory(updated.events);
    const reply = await this.ai.generateResponse({ history, profile });

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

function extractChatHistory(events: JourneyEvent[]): ChatMessage[] {
  return events
    .filter((e): e is Extract<JourneyEvent, { type: "chat_message" }> => e.type === "chat_message")
    .map((e) => e.payload);
}
