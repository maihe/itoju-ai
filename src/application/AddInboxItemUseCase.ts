import type { InboxItem } from "@/domain/entities/InboxItem";
import type { InboxRepository } from "@/domain/ports/InboxRepository";

/**
 * Adiciona um novo pensamento à inbox com status `open`. Retorna a
 * lista completa atualizada.
 */
export class AddInboxItemUseCase {
  constructor(private readonly repository: InboxRepository) {}

  async execute(content: string): Promise<InboxItem[]> {
    const item: InboxItem = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date().toISOString(),
      status: "open",
    };

    const existing = await this.repository.loadAll();
    const updated = [...existing, item];
    await this.repository.saveAll(updated);
    return updated;
  }
}
