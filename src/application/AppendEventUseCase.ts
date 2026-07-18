import type { LifeJourney } from "@/domain/entities/LifeJourney";
import type { JourneyEvent } from "@/domain/entities/JourneyEvent";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";

/**
 * Adiciona um evento à jornada e persiste. Retorna a jornada atualizada.
 */
export class AppendEventUseCase {
  constructor(private readonly repo: JourneyRepository) {}

  async execute(journey: LifeJourney, event: JourneyEvent): Promise<LifeJourney> {
    const updated: LifeJourney = {
      ...journey,
      events: [...journey.events, event],
    };
    await this.repo.save(updated);
    return updated;
  }
}
