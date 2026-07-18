import { useEffect, useRef } from "react";
import type { JourneyEvent } from "@/domain/entities/JourneyEvent";
import type { LifeJourney } from "@/domain/entities/LifeJourney";
import { ChatMessageBubble } from "./ChatMessageBubble";

interface Props {
  journey: LifeJourney;
  isSending: boolean;
}

/**
 * JourneyView — renderer de eventos da jornada.
 *
 * Hoje só há renderer para `chat_message`. Ao adicionar novos tipos
 * (weekly_review, achievement, ...), basta estender o switch abaixo.
 */
export function JourneyView({ journey, isSending }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [journey.events.length, isSending]);

  if (journey.events.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Este é o começo da sua jornada. Escreva o que estiver na sua cabeça —
          o Companion vai te acompanhar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-6">
      {journey.events.map((event) => (
        <EventRenderer key={event.id} event={event} />
      ))}
      {isSending && (
        <div className="text-xs text-muted-foreground italic px-1">
          Companion está pensando…
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

function EventRenderer({ event }: { event: JourneyEvent }) {
  switch (event.type) {
    case "chat_message":
      return <ChatMessageBubble message={event.payload} />;
    // Fases futuras adicionam renderers aqui:
    // case "weekly_review": return <WeeklyReviewCard ... />;
    // case "achievement":   return <AchievementCard ... />;
    default:
      return null;
  }
}
