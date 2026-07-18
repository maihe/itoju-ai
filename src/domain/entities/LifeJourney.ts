import type { JourneyEvent } from "./JourneyEvent";

/**
 * LifeJourney — agregado central do domínio.
 *
 * Representa a jornada de desenvolvimento pessoal de uma pessoa ao
 * longo do tempo. Contém uma lista ordenada de eventos.
 */
export interface LifeJourney {
  id: string;
  startedAt: string; // ISO 8601
  events: JourneyEvent[];
}

export function createEmptyJourney(id: string, now: Date = new Date()): LifeJourney {
  return {
    id,
    startedAt: now.toISOString(),
    events: [],
  };
}
