import type { ChatMessage } from "../entities/ChatMessage";
import type { Memory } from "../entities/Memory";
import type { UserProfile } from "../entities/UserProfile";

/**
 * CompanionContext — tudo que uma implementação de AIService pode
 * receber para gerar uma resposta.
 *
 * O contexto é montado pelo `ContextEngine` (camada de aplicação) a
 * partir dos repositórios. O AIService NUNCA deve conversar
 * diretamente com repositórios: recebe este objeto pronto.
 *
 * Campos obrigatórios hoje: `history` e `memories` (mesmo que vazio).
 * Os demais são reservados para fases futuras (ADR-003) e permanecem
 * opcionais — adicionar um novo campo não quebra implementações
 * existentes.
 */
export interface CompanionContext {
  history: ChatMessage[];
  memories: Memory[];
  profile?: UserProfile;

  // Reservado para fases futuras — permanecem opcionais:
  activeGoals?: unknown[];
  activeProjects?: unknown[];
  weeklyReview?: unknown;
  // energy?: unknown;
  // habits?: unknown[];
  // calendar?: unknown;
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
