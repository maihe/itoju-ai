import { createEmptyJourney, type LifeJourney } from "@/domain/entities/LifeJourney";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";

/**
 * Encerra a jornada atual e começa uma nova, vazia.
 */
export class ClearJourneyUseCase {
  constructor(private readonly repo: JourneyRepository) {}

  async execute(): Promise<LifeJourney> {
    await this.repo.clear();
    const fresh = createEmptyJourney(crypto.randomUUID());
    await this.repo.save(fresh);
    return fresh;
  }
}
