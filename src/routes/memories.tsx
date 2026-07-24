import { createFileRoute } from "@tanstack/react-router";
import type { Memory, MemoryType } from "@/domain/entities/Memory";
import { CompanionNav } from "@/presentation/components/CompanionNav";
import { useMemories } from "@/presentation/hooks/useMemories";

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [
      { title: "Memórias — Itoju Companion" },
      {
        name: "description",
        content:
          "Memórias que o Companion guarda sobre sua jornada: objetivos, projetos, preferências, conquistas e mais.",
      },
      { property: "og:title", content: "Memórias — Itoju Companion" },
      {
        property: "og:description",
        content:
          "Memórias que o Companion guarda sobre sua jornada: objetivos, projetos, preferências, conquistas e mais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Memórias — Itoju Companion" },
      {
        name: "twitter:description",
        content:
          "Memórias que o Companion guarda sobre sua jornada: objetivos, projetos, preferências, conquistas e mais.",
      },
    ],
  }),
  component: MemoriesPage,
});

const CATEGORY_ORDER: MemoryType[] = [
  "goal",
  "project",
  "preference",
  "achievement",
  "fact",
  "decision",
  "insight",
];

const CATEGORY_LABEL: Record<MemoryType, string> = {
  goal: "Objetivos",
  project: "Projetos",
  preference: "Preferências",
  achievement: "Conquistas",
  fact: "Fatos",
  decision: "Decisões",
  insight: "Insights",
};

function MemoriesPage() {
  const { memories } = useMemories();

  return (
    <div className="mx-auto flex h-screen w-full max-w-2xl flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h1 className="text-base font-semibold text-foreground">Memórias</h1>
          <p className="text-xs text-muted-foreground">
            O que o Companion sabe sobre sua jornada
          </p>
        </div>
        <CompanionNav />
      </header>

      {memories === null ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando memórias…</p>
        </div>
      ) : memories.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <p className="max-w-sm text-sm text-muted-foreground">
            Ainda não há memórias registradas.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-8 overflow-y-auto px-4 py-6">
          {CATEGORY_ORDER.map((type) => {
            const items = memories.filter((m) => m.type === type);
            if (items.length === 0) return null;
            return <CategorySection key={type} type={type} items={items} />;
          })}
        </div>
      )}
    </div>
  );
}

function CategorySection({ type, items }: { type: MemoryType; items: Memory[] }) {
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {CATEGORY_LABEL[type]}
        </h2>
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </div>
      <ul className="space-y-2">
        {items.map((memory) => (
          <li
            key={memory.id}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          >
            <p>{memory.content}</p>
            {memory.status !== "confirmed" && (
              <p className="mt-1 text-xs text-muted-foreground">
                Status: {memory.status}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
