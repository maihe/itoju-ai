import type { InboxItem } from "../entities/InboxItem";

/**
 * InboxRepository — porta de persistência da inbox de pensamentos.
 *
 * Mesmo padrão do `MemoryRepository` (ver ADR-004). O MVP usa
 * localStorage; um repositório remoto futuro implementa a mesma
 * interface sem afetar o domínio/aplicação.
 */
export interface InboxRepository {
  loadAll(): Promise<InboxItem[]>;
  saveAll(items: InboxItem[]): Promise<void>;
  clear(): Promise<void>;
}
