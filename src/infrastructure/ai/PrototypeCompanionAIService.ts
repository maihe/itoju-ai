import type { ChatMessage } from "@/domain/entities/ChatMessage";
import type { AIService, CompanionContext } from "@/domain/ports/AIService";
import type { ResponseStrategy } from "./prototype/ResponseStrategy";
import { AchievementStrategy } from "./prototype/strategies/AchievementStrategy";
import { DefaultStrategy } from "./prototype/strategies/DefaultStrategy";
import { OverwhelmStrategy } from "./prototype/strategies/OverwhelmStrategy";
import { PlanningStrategy } from "./prototype/strategies/PlanningStrategy";

/**
 * PrototypeCompanionAIService — simulação baseada em regras da experiência
 * do Companion antes da integração com uma LLM real (ver ADR-005).
 *
 * O objetivo NÃO é ser uma IA: é permitir testar o *tom* e o *ritmo* da
 * conversa segundo os princípios do CONSTITUTION.md — sem culpa, com
 * reconhecimento do estado emocional, com poucas perguntas e sempre
 * preservando a autonomia da pessoa.
 *
 * Substituição futura por LLM: basta criar uma nova classe que implemente
 * `AIService` e registrá-la em `composition/container.ts`. Nada mais na
 * aplicação precisa mudar — as estratégias abaixo são detalhe interno
 * desta implementação.
 */
export class PrototypeCompanionAIService implements AIService {
  private readonly strategies: readonly ResponseStrategy[];

  constructor(strategies?: readonly ResponseStrategy[]) {
    // Ordem importa: casos mais específicos primeiro, fallback por último.
    this.strategies = strategies ?? [
      OverwhelmStrategy,
      AchievementStrategy,
      PlanningStrategy,
      DefaultStrategy,
    ];
  }

  async generateResponse(context: CompanionContext): Promise<ChatMessage> {
    const strategy =
      this.strategies.find((s) => s.matches(context)) ?? DefaultStrategy;

    // Pequeno atraso simulado para tornar o ritmo da UI mais natural.
    await new Promise((resolve) => setTimeout(resolve, 350));

    return strategy.respond(context);
  }
}
