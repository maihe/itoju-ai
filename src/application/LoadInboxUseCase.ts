import type { InboxItem } from "@/domain/entities/InboxItem";
import type { InboxRepository } from "@/domain/ports/InboxRepository";

/**
 * Carrega todos os itens da inbox. Se ainda não existir nenhum, semeia
 * exemplos para validar a interface (apenas na primeira execução).
 *
 * A semeadura vive na camada de aplicação — não no domínio nem na
 * infraestrutura — porque é uma política de bootstrap, não uma regra
 * de persistência (mesmo padrão de `LoadMemoriesUseCase`).
 */
export class LoadInboxUseCase {
  constructor(private readonly repository: InboxRepository) {}

  async execute(): Promise<InboxItem[]> {
    const existing = await this.repository.loadAll();
    if (existing.length > 0) return existing;

    const seeded = buildSeedInboxItems();
    await this.repository.saveAll(seeded);
    return seeded;
  }
}

function buildSeedInboxItems(): InboxItem[] {
  const now = new Date().toISOString();
  const base = (id: string, content: string): InboxItem => ({
    id,
    content,
    createdAt: now,
    status: "open",
  });

  return [
    base("seed-inbox-1", "Marcar consulta com psiquiatra"),
    base("seed-inbox-2", "Ideia para o Companion"),
    base("seed-inbox-3", "Comprar filtro de água"),
    base("seed-inbox-4", "Planejar viagem"),
  ];
}
