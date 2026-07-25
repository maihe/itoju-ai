import type { InboxItem } from "@/domain/entities/InboxItem";
import type { InboxRepository } from "@/domain/ports/InboxRepository";

const STORAGE_KEY = "companion:inbox:v1";

/**
 * Persistência da inbox em localStorage (ver ADR-004).
 * Guarda de SSR: no servidor, todas as operações viram no-op.
 */
export class LocalStorageInboxRepository implements InboxRepository {
  async loadAll(): Promise<InboxItem[]> {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as InboxItem[]) : [];
    } catch {
      return [];
    }
  }

  async saveAll(items: InboxItem[]): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
