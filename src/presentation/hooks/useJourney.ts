import { useCallback, useEffect, useState } from "react";
import { getContainer } from "@/composition/container";
import type { LifeJourney } from "@/domain/entities/LifeJourney";

interface UseJourneyResult {
  journey: LifeJourney | null;
  isSending: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearJourney: () => Promise<void>;
}

/**
 * Hook de presentation: conecta a UI aos casos de uso.
 * Nenhum componente deve tocar diretamente em infraestrutura.
 */
export function useJourney(): UseJourneyResult {
  const [journey, setJourney] = useState<LifeJourney | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const { useCases } = getContainer();
    useCases.loadJourney.execute().then((j) => {
      if (!cancelled) setJourney(j);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !journey || isSending) return;
      setIsSending(true);
      try {
        const { useCases } = getContainer();
        const updated = await useCases.sendChatMessage.execute(journey, trimmed);
        setJourney(updated);
      } finally {
        setIsSending(false);
      }
    },
    [journey, isSending],
  );

  const clearJourney = useCallback(async () => {
    const { useCases } = getContainer();
    const fresh = await useCases.clearJourney.execute();
    setJourney(fresh);
  }, []);

  return { journey, isSending, sendMessage, clearJourney };
}
