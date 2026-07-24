import type { ChatMessage } from "@/domain/entities/ChatMessage";
import type { JourneyEvent } from "@/domain/entities/JourneyEvent";
import type { LifeJourney } from "@/domain/entities/LifeJourney";
import type { CompanionContext } from "@/domain/ports/AIService";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";
import type { MemoryRepository } from "@/domain/ports/MemoryRepository";
import type { UserProfileRepository } from "@/domain/ports/UserProfileRepository";

/**
 * ContextEngine — serviço de aplicação que consolida todo o contexto
 * relevante da pessoa em um único `CompanionContext`.
 *
 * Regras:
 * - Não toma decisões, apenas reúne.
 * - É o ÚNICO ponto que conversa com repositórios para montar contexto.
 * - Qualquer implementação de `AIService` recebe o contexto pronto e
 *   permanece pura, testável e independente da infraestrutura.
 *
 * Hoje utiliza JourneyRepository, MemoryRepository e
 * UserProfileRepository. No futuro poderá compor objetivos, projetos,
 * energia, revisões, hábitos, calendário, etc. sem mudar a assinatura
 * pública — apenas adicionando campos opcionais ao `CompanionContext`.
 */
export class ContextEngine {
  constructor(
    private readonly journeyRepository: JourneyRepository,
    private readonly memoryRepository: MemoryRepository,
    private readonly profileRepository: UserProfileRepository,
  ) {}

  /**
   * Monta o contexto completo. Aceita uma `journey` já carregada em
   * memória (evita reler o storage no meio do fluxo de envio de
   * mensagem); se ausente, carrega do repositório.
   */
  async build(journey?: LifeJourney): Promise<CompanionContext> {
    const [resolvedJourney, memories, profile] = await Promise.all([
      journey ? Promise.resolve(journey) : this.journeyRepository.load(),
      this.memoryRepository.loadAll(),
      this.profileRepository.load(),
    ]);

    const history = resolvedJourney
      ? extractChatHistory(resolvedJourney.events)
      : [];

    return {
      history,
      memories,
      profile: profile ?? undefined,
    };
  }
}

function extractChatHistory(events: JourneyEvent[]): ChatMessage[] {
  return events
    .filter(
      (e): e is Extract<JourneyEvent, { type: "chat_message" }> =>
        e.type === "chat_message",
    )
    .map((e) => e.payload);
}
