import { createFileRoute } from "@tanstack/react-router";
import { Composer } from "@/presentation/components/Composer";
import { CompanionNav } from "@/presentation/components/CompanionNav";
import { JourneyView } from "@/presentation/components/JourneyView";
import { useJourney } from "@/presentation/hooks/useJourney";

export const Route = createFileRoute("/")({
  component: CompanionPage,
});

function CompanionPage() {
  const { journey, isSending, sendMessage, clearJourney } = useJourney();

  return (
    <div className="mx-auto flex h-screen w-full max-w-2xl flex-col bg-background">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-foreground">Companion</h1>
          <p className="truncate text-xs text-muted-foreground">
            Seu parceiro de desenvolvimento pessoal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CompanionNav />
          <button
            type="button"
            onClick={() => void clearJourney()}
            className="rounded-lg border border-input px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
          >
            Nova jornada
          </button>
        </div>
      </header>

      {journey ? (
        <JourneyView journey={journey} isSending={isSending} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando sua jornada…</p>
        </div>
      )}

      <Composer
        onSend={sendMessage}
        disabled={!journey || isSending}
        focusToken={journey?.id}
      />
    </div>
  );
}
