import type { LifeJourney } from "@/domain/entities/LifeJourney";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";

const STORAGE_KEY = "companion:journey:v1";

/**
 * Persistência da jornada em localStorage (ver ADR-004).
 * Guarda de SSR: no servidor, todas as operações viram no-op.
 */
export class LocalStorageJourneyRepository implements JourneyRepository {
  async load(): Promise<LifeJourney | null> {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LifeJourney;
    } catch {
      return null;
    }
  }

  async save(journey: LifeJourney): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
