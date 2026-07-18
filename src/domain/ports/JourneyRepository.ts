import type { LifeJourney } from "../entities/LifeJourney";

/**
 * JourneyRepository — porta de persistência da jornada.
 *
 * O MVP usa localStorage (ver ADR-004). Um repositório remoto futuro
 * implementa a mesma interface.
 */
export interface JourneyRepository {
  load(): Promise<LifeJourney | null>;
  save(journey: LifeJourney): Promise<void>;
  clear(): Promise<void>;
}
