import type { Memory } from "@/domain/entities/Memory";
import type { MemoryRepository } from "@/domain/ports/MemoryRepository";

const STORAGE_KEY = "companion:memories:v1";

/**
 * Persistência de memórias em localStorage (ver ADR-004).
 * Guarda de SSR: no servidor, todas as operações viram no-op.
 */
export class LocalStorageMemoryRepository implements MemoryRepository {
  async loadAll(): Promise<Memory[]> {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Memory[]) : [];
    } catch {
      return [];
    }
  }

  async saveAll(memories: Memory[]): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
