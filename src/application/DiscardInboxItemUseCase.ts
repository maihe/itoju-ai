import type { InboxItem } from "@/domain/entities/InboxItem";
import type { InboxRepository } from "@/domain/ports/InboxRepository";

/**
 * Marca um item da inbox como descartado. O item não é apagado —
 * apenas deixa de aparecer na lista padrão (ver filtro na UI).
 */
export class DiscardInboxItemUseCase {
  constructor(private readonly repository: InboxRepository) {}

  async execute(id: string): Promise<InboxItem[]> {
    const existing = await this.repository.loadAll();
    const updated = existing.map((item) =>
      item.id === id ? { ...item, status: "discarded" as const } : item,
    );
    await this.repository.saveAll(updated);
    return updated;
  }
}
