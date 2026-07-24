import type { Memory } from "@/domain/entities/Memory";
import type { MemoryRepository } from "@/domain/ports/MemoryRepository";

/**
 * Carrega todas as memórias. Se ainda não existir nenhuma, semeia
 * exemplos para validar a interface (apenas na primeira execução).
 *
 * A semeadura vive na camada de aplicação — não no domínio nem na
 * infraestrutura — porque é uma política de bootstrap, não uma regra
 * de persistência.
 */
export class LoadMemoriesUseCase {
  constructor(private readonly repository: MemoryRepository) {}

  async execute(): Promise<Memory[]> {
    const existing = await this.repository.loadAll();
    if (existing.length > 0) return existing;

    const seeded = buildSeedMemories();
    await this.repository.saveAll(seeded);
    return seeded;
  }
}

function buildSeedMemories(): Memory[] {
  const now = new Date().toISOString();
  const base = (
    id: string,
    type: Memory["type"],
    content: string,
  ): Memory => ({
    id,
    type,
    content,
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  });

  return [
    base("seed-goal-1", "goal", "Construir uma rotina sustentável."),
    base("seed-project-1", "project", "Companion"),
    base(
      "seed-preference-1",
      "preference",
      "Prefere dividir problemas grandes em pequenos passos.",
    ),
    base(
      "seed-achievement-1",
      "achievement",
      "Primeira versão do Companion publicada.",
    ),
  ];
}
