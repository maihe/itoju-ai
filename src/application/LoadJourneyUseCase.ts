import { createEmptyJourney, type LifeJourney } from "@/domain/entities/LifeJourney";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";

/**
 * Carrega a jornada do repositório; cria uma vazia se não existir.
 */
export class LoadJourneyUseCase {
  constructor(private readonly repo: JourneyRepository) {}

  async execute(): Promise<LifeJourney> {
    const existing = await this.repo.load();
    if (existing) return existing;
    const fresh = createEmptyJourney(crypto.randomUUID());
    await this.repo.save(fresh);
    return fresh;
  }
}
