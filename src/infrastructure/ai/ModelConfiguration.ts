/**
 * Configuração do modelo de IA usada pelo Companion — lida inteiramente
 * de variáveis de ambiente do servidor. Trocar de modelo (inclusive de
 * fornecedor, via OpenRouter) é mudança de configuração, nunca de
 * código (ver ADR-006).
 *
 * `loadModelConfiguration` só deve ser chamada dentro do handler de uma
 * server function — nunca em escopo de módulo. Em runtimes de edge
 * (Cloudflare Workers), variáveis de ambiente só existem por request;
 * lê-las no topo do arquivo resultaria em `undefined` mesmo no servidor.
 */
export interface ModelConfiguration {
  provider: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
}

export function loadModelConfiguration(): ModelConfiguration {
  return {
    provider: process.env.AI_PROVIDER ?? "openrouter",
    model: process.env.AI_MODEL ?? "anthropic/claude-sonnet-5",
    temperature: Number(process.env.AI_TEMPERATURE ?? 0.7),
    // Claude Sonnet 5 roda com raciocínio adaptativo ligado por padrão, e
    // max_tokens é o teto combinado de raciocínio + resposta visível, não
    // só da resposta. Um teto baixo demais (ex.: 400) faz o modelo gastar
    // tudo "pensando" em mensagens longas/complexas e devolver texto vazio
    // — não é um jeito válido de forçar economia de palavras (isso é
    // trabalho do system prompt, ver CONSTITUTION.md #7).
    maxTokens: Number(process.env.AI_MAX_TOKENS ?? 2000),
    timeoutMs: Number(process.env.AI_TIMEOUT_MS ?? 20000),
  };
}
