import type { ChatMessage } from "@/domain/entities/ChatMessage";
import {
  containsAny,
  lastUserMessage,
  type ResponseStrategy,
} from "../ResponseStrategy";

const ACHIEVEMENT_KEYWORDS = [
  "consegui",
  "termin",
  "finaliz",
  "entreguei",
  "conclu",
  "deu certo",
  "funcionou",
  "avancei",
  "avancei",
  "avancei muito",
  "progresso",
  "melhorei",
  "venci",
  "superei",
];

/**
 * Reconhece a conquista de forma explícita e a registra como progresso
 * na jornada. Sem minimizar, sem emendar imediatamente na próxima
 * cobrança. (CONSTITUTION: celebrar conquistas.)
 */
export const AchievementStrategy: ResponseStrategy = {
  name: "achievement",
  matches(context) {
    return containsAny(lastUserMessage(context), ACHIEVEMENT_KEYWORDS);
  },
  respond(): ChatMessage {
    return {
      role: "companion",
      content:
        "Isso é uma conquista real — vale pausar um segundo antes de já pensar no que vem depois. **Quero registrar isso como progresso na sua jornada.**\n\nUma coisa que ajuda a levar esse aprendizado adiante: **o que tornou isso possível desta vez?** Pode ter sido energia, contexto, uma decisão pequena — o que você identificar aqui vai servir da próxima vez que algo parecido aparecer.",
    };
  },
};
