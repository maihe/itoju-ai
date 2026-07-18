import type { ChatMessage } from "../entities/ChatMessage";
import type { UserProfile } from "../entities/UserProfile";

/**
 * CompanionContext — tudo que uma implementação de AIService pode
 * receber para gerar uma resposta.
 *
 * Hoje apenas `history` é populado. Os demais campos estão previstos
 * (ADR-003) e serão preenchidos em fases futuras. A porta não muda
 * quando novos campos entram: eles são apenas opcionais.
 */
export interface CompanionContext {
  history: ChatMessage[];
  profile?: UserProfile;

  // Reservado para fases futuras:
  // relevantMemories?: unknown[];
  // activeGoals?: unknown[];
  // projects?: unknown[];
  // energy?: unknown;
  // weeklyReviews?: unknown[];
}

/**
 * AIService — porta única de conversa com qualquer LLM.
 *
 * Nenhum código de aplicação, domínio ou UI deve depender de uma
 * implementação específica. Sempre depender desta interface.
 */
export interface AIService {
  generateResponse(context: CompanionContext): Promise<ChatMessage>;
}
