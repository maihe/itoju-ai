import type { ChatMessage } from "@/domain/entities/ChatMessage";
import type { CompanionContext } from "@/domain/ports/AIService";
import {
  containsAny,
  lastUserMessage,
  type ResponseStrategy,
} from "../ResponseStrategy";

const OVERWHELM_KEYWORDS = [
  "sobrecarga",
  "sobrecarregad",
  "muita coisa",
  "muitas coisas",
  "nao dou conta",
  "não dou conta",
  "exaust",
  "cansad",
  "estressad",
  "ansios",
  "ansiedade",
  "burnout",
  "perdid",
  "travad",
  "paralisad",
  "esgotad",
];

/**
 * Reconhece sobrecarga, valida o estado emocional e propõe reduzir o
 * problema ao próximo passo pequeno — sem prescrever a solução.
 * Segue CONSTITUTION: nunca gerar culpa, buscar clareza antes de agir,
 * preservar autonomia.
 */
export const OverwhelmStrategy: ResponseStrategy = {
  name: "overwhelm",
  matches(context) {
    return containsAny(lastUserMessage(context), OVERWHELM_KEYWORDS);
  },
  respond(): ChatMessage {
    return {
      role: "companion",
      content:
        "Faz sentido se sentir assim quando há muita coisa acontecendo ao mesmo tempo — não é sinal de fraqueza, é sinal de que a lista está grande demais para caber de uma vez.\n\nAntes de qualquer plano, uma pergunta: **qual é a coisa que está ocupando mais espaço mental agora?** Não precisa ser a mais urgente, só a que mais pesa.\n\nQuando a gente identificar isso, podemos olhar juntos qual seria o menor próximo passo possível — algo que caiba nos próximos 15 minutos, não na próxima semana.",
    };
  },
};
