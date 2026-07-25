import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CompanionNav } from "@/presentation/components/CompanionNav";
import { InboxCapture } from "@/presentation/components/InboxCapture";
import { InboxItemRow } from "@/presentation/components/InboxItemRow";
import { useInbox } from "@/presentation/hooks/useInbox";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — Itoju Companion" },
      {
        name: "description",
        content:
          "Um lugar seguro para capturar rapidamente ideias, decisões, pendências e preocupações antes de saber o que elas são.",
      },
      { property: "og:title", content: "Inbox — Itoju Companion" },
      {
        property: "og:description",
        content:
          "Um lugar seguro para capturar rapidamente ideias, decisões, pendências e preocupações antes de saber o que elas são.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Inbox — Itoju Companion" },
      {
        name: "twitter:description",
        content:
          "Um lugar seguro para capturar rapidamente ideias, decisões, pendências e preocupações antes de saber o que elas são.",
      },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  const { items, addItem, markProcessed, discardItem } = useInbox();
  const [showResolved, setShowResolved] = useState(false);

  const visibleItems = (items ?? [])
    .filter((item) => showResolved || item.status === "open")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto flex h-screen w-full max-w-2xl flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h1 className="text-base font-semibold text-foreground">Inbox</h1>
          <p className="text-xs text-muted-foreground">
            Capture o que estiver passando pela cabeça — decidir o que
            significa vem depois
          </p>
        </div>
        <CompanionNav />
      </header>

      <InboxCapture onAdd={addItem} />

      <div className="flex items-center justify-end px-4 pt-3">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
          />
          Mostrar processados e descartados
        </label>
      </div>

      {items === null ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando inbox…</p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <p className="max-w-sm text-sm text-muted-foreground">
            {showResolved
              ? "Nada por aqui ainda."
              : "Sua inbox está vazia. Escreva o que estiver passando pela sua cabeça — sem se preocupar em classificar."}
          </p>
        </div>
      ) : (
        <ul className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
          {visibleItems.map((item) => (
            <InboxItemRow
              key={item.id}
              item={item}
              onProcess={markProcessed}
              onDiscard={discardItem}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
