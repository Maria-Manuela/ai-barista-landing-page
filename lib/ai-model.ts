import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

/** Default for new API keys (2.0/2.5 shut down or restricted for new users). */
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

export const GEMINI_FALLBACK_MODELS = [
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview",
] as const;

/**
 * Picks the AI model. Priority:
 * 1. Gemini (free tier) — GOOGLE_GENERATIVE_AI_API_KEY
 * 2. OpenAI direct — OPENAI_API_KEY
 * 3. Vercel AI Gateway — AI_GATEWAY_API_KEY
 */
export function getCupModel(): LanguageModel | string {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const model = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
    return google(model);
  }
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-4o-mini");
  }
  return "openai/gpt-4o-mini";
}

/** Models to try when using Gemini (user override first, then fallbacks). */
export function getGeminiModelsToTry(): string[] {
  const preferred = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
  return [...new Set([preferred, ...GEMINI_FALLBACK_MODELS])];
}

export function isQuotaError(message: string): boolean {
  return /quota|RESOURCE_EXHAUSTED|rate.?limit|429|insufficient/i.test(message);
}

/** Model missing, deprecated, or rate-limited — try the next fallback. */
export function isRetryableModelError(message: string): boolean {
  return (
    isQuotaError(message) ||
    /no longer available|not found|not supported for generateContent/i.test(message)
  );
}

export function hasAiKey(): boolean {
  return !!(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.AI_GATEWAY_API_KEY
  );
}

export function getAiConfigHint(): string {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "Using Gemini (GOOGLE_GENERATIVE_AI_API_KEY)";
  if (process.env.OPENAI_API_KEY) return "Using OpenAI (OPENAI_API_KEY)";
  if (process.env.AI_GATEWAY_API_KEY) return "Using AI Gateway (AI_GATEWAY_API_KEY)";
  return "No AI key — add GOOGLE_GENERATIVE_AI_API_KEY to .env.local (free at aistudio.google.com/apikey)";
}
