import { createServerFn } from "@tanstack/react-start";
import { loadModelConfiguration } from "./ModelConfiguration";

interface OpenRouterMessage {
  role: "user" | "assistant";
  content: string;
}

interface CallOpenRouterInput {
  system: string;
  messages: OpenRouterMessage[];
}

/**
 * Fala com o OpenRouter (API compatível com OpenAI) por trás de uma
 * server function do TanStack Start — a chave de API e a configuração
 * do modelo nunca chegam ao cliente (ver ADR-006).
 */
export const callOpenRouter = createServerFn({ method: "POST" })
  .validator((data: CallOpenRouterInput) => data)
  .handler(async ({ data }): Promise<string> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY não está configurada no servidor.");
    }

    const config = loadModelConfiguration();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          messages: [{ role: "system", content: data.system }, ...data.messages],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`OpenRouter respondeu ${response.status}: ${await response.text()}`);
      }

      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = payload.choices?.[0]?.message?.content;
      if (typeof content !== "string" || content.trim().length === 0) {
        throw new Error("OpenRouter retornou uma resposta vazia.");
      }

      return content;
    } finally {
      clearTimeout(timeout);
    }
  });
