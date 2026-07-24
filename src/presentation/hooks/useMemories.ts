import { useEffect, useState } from "react";
import { getContainer } from "@/composition/container";
import type { Memory } from "@/domain/entities/Memory";

interface UseMemoriesResult {
  memories: Memory[] | null;
}

/**
 * Hook de presentation: carrega as memórias via caso de uso.
 * Nesta fase é apenas leitura — não há edição pela UI.
 */
export function useMemories(): UseMemoriesResult {
  const [memories, setMemories] = useState<Memory[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const { useCases } = getContainer();
    useCases.loadMemories.execute().then((m) => {
      if (!cancelled) setMemories(m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { memories };
}
