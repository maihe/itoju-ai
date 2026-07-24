/**
 * Memory — segunda entidade central do domínio (ver MEMORY_MODEL.md).
 *
 * Nesta fase, memórias são criadas manualmente (dados de exemplo em
 * desenvolvimento). Futuramente uma LLM poderá sugerir novas memórias
 * sem alterar o domínio: bastará criar `Memory` com status `suggested`
 * e deixar o usuário confirmar/rejeitar.
 */
export type MemoryType =
  | "fact"
  | "goal"
  | "project"
  | "preference"
  | "achievement"
  | "decision"
  | "insight";

export type MemoryStatus =
  | "suggested"
  | "confirmed"
  | "rejected"
  | "archived";

export interface Memory {
  id: string;
  type: MemoryType;
  content: string;
  status: MemoryStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
