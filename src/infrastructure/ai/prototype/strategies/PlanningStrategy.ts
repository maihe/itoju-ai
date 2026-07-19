import type { ChatMessage } from "@/domain/entities/ChatMessage";
import {
  containsAny,
  lastUserMessage,
  type ResponseStrategy,
} from "../ResponseStrategy";

const PLANNING_KEYWORDS = [
  "planej",
  "organiz",
  "priorid",
  "por onde começ",
  "por onde comec",
  "o que faço",
  "o que faco",
  "próximo passo",
  "proximo passo",
  "metas",
  "meta",
  "objetivo",
  "roadmap",
  "cronograma",
];

/**
 * Ajuda a encontrar prioridade e reconecta a ação ao objetivo maior,
 * em vez de entregar um plano pronto. Faz no máximo duas perguntas.
 */
export const PlanningStrategy: ResponseStrategy = {
  name: "planning",
  matches(context) {
    return containsAny(lastUserMessage(context), PLANNING_KEYWORDS);
  },
  respond(): ChatMessage {
    return {
      role: "companion",
      content:
        "Antes de organizar a ordem das coisas, vale um passo atrás: **o que você quer que esteja diferente daqui a algumas semanas?** Isso ajuda a decidir o que entra e, principalmente, o que fica de fora.\n\nCom isso claro, dá pra olhar sua lista e perguntar: **se só uma coisa pudesse avançar esta semana, qual delas te aproxima mais desse resultado?** Essa costuma ser a prioridade real — o resto pode esperar sem culpa.",
    };
  },
};
