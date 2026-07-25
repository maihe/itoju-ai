import type { InboxItem } from "@/domain/entities/InboxItem";

interface Props {
  item: InboxItem;
  onProcess: (id: string) => void;
  onDiscard: (id: string) => void;
}

const STATUS_LABEL: Record<InboxItem["status"], string> = {
  open: "",
  processed: "Processado",
  discarded: "Descartado",
};

export function InboxItemRow({ item, onProcess, onDiscard }: Props) {
  const date = new Date(item.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
      <div className="min-w-0">
        <p className="whitespace-pre-wrap text-sm text-card-foreground">{item.content}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {date}
          {item.status !== "open" && ` · ${STATUS_LABEL[item.status]}`}
        </p>
      </div>

      {item.status === "open" && (
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onProcess(item.id)}
            className="rounded-md border border-input px-2 py-1 text-xs text-foreground transition-colors hover:bg-accent"
          >
            Processar
          </button>
          <button
            type="button"
            onClick={() => onDiscard(item.id)}
            className="rounded-md border border-input px-2 py-1 text-xs text-foreground transition-colors hover:bg-accent"
          >
            Descartar
          </button>
        </div>
      )}
    </li>
  );
}
