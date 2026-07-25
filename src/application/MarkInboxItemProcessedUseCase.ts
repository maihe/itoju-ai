import type { InboxItem } from "@/domain/entities/InboxItem";
import type { InboxRepository } from "@/domain/ports/InboxRepository";

/**
 * Marca um item da inbox como processado. Não decide o que ele
 * significa nem o transforma em outra coisa — apenas altera o status.
 * Classificação (tarefa, projeto, objetivo, memória) é uma decisão
 * futura, fora do escopo desta etapa.
 */
export class MarkInboxItemProcessedUseCase {
  constructor(private readonly repository: InboxRepository) {}

  async execute(id: string): Promise<InboxItem[]> {
    const existing = await this.repository.loadAll();
    const updated = existing.map((item) =>
      item.id === id ? { ...item, status: "processed" as const } : item,
    );
    await this.repository.saveAll(updated);
    return updated;
  }
}
