import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

/**
 * Picks the AI model provider. Prefers a direct OpenAI key (simplest for local
 * dev); falls back to the Vercel AI Gateway string which uses AI_GATEWAY_API_KEY.
 */
export function getCupModel(): LanguageModel | string {
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-4o-mini");
  }
  return "openai/gpt-4o-mini";
}

export function getAiConfigHint(): string {
  if (process.env.OPENAI_API_KEY) return "Using OPENAI_API_KEY";
  if (process.env.AI_GATEWAY_API_KEY) return "Using AI_GATEWAY_API_KEY";
  return "No AI key configured — set OPENAI_API_KEY or AI_GATEWAY_API_KEY in .env.local";
}
