import { useCallback, useEffect, useState } from "react";
import { getContainer } from "@/composition/container";
import type { InboxItem } from "@/domain/entities/InboxItem";

interface UseInboxResult {
  items: InboxItem[] | null;
  addItem: (content: string) => Promise<void>;
  markProcessed: (id: string) => Promise<void>;
  discardItem: (id: string) => Promise<void>;
}

/**
 * Hook de presentation: conecta a UI da Inbox aos casos de uso.
 * Nenhum componente deve tocar diretamente em infraestrutura.
 */
export function useInbox(): UseInboxResult {
  const [items, setItems] = useState<InboxItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const { useCases } = getContainer();
    useCases.loadInbox.execute().then((loaded) => {
      if (!cancelled) setItems(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const { useCases } = getContainer();
    const updated = await useCases.addInboxItem.execute(trimmed);
    setItems(updated);
  }, []);

  const markProcessed = useCallback(async (id: string) => {
    const { useCases } = getContainer();
    const updated = await useCases.markInboxItemProcessed.execute(id);
    setItems(updated);
  }, []);

  const discardItem = useCallback(async (id: string) => {
    const { useCases } = getContainer();
    const updated = await useCases.discardInboxItem.execute(id);
    setItems(updated);
  }, []);

  return { items, addItem, markProcessed, discardItem };
}
