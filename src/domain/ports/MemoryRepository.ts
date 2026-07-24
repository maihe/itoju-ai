import type { Memory } from "../entities/Memory";

/**
 * MemoryRepository — porta de persistência das memórias do Companion.
 *
 * Mesmo padrão do `JourneyRepository` (ver ADR-004). O MVP usa
 * localStorage; um repositório remoto futuro implementa a mesma
 * interface sem afetar o domínio/aplicação.
 */
export interface MemoryRepository {
  loadAll(): Promise<Memory[]>;
  saveAll(memories: Memory[]): Promise<void>;
  clear(): Promise<void>;
}
