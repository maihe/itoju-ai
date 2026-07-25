/**
 * InboxItem — pensamento capturado rapidamente, antes de ser
 * classificado como tarefa, projeto, objetivo ou memória.
 *
 * A Inbox não é uma lista de tarefas: é o lugar onde uma ideia,
 * decisão, pendência ou preocupação pousa antes de sabermos o que ela
 * é. Por isso não há campo de categoria aqui — classificar é uma
 * decisão futura, deliberadamente fora do escopo desta entidade.
 */
export type InboxItemStatus = "open" | "processed" | "discarded";

export interface InboxItem {
  id: string;
  content: string;
  createdAt: string; // ISO 8601
  status: InboxItemStatus;
}
