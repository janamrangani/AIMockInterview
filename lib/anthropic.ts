// lib/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Single helper for all Claude calls in the app. Keeping this in one place
 * makes it trivial to swap models later (e.g. route simple calls to Haiku
 * to cut costs once you have real usage data).
 */
export async function callClaude(
  prompt: string,
  options?: { model?: string; maxTokens?: number }
): Promise<string> {
  const response = await anthropic.messages.create({
    model: options?.model ?? "claude-haiku-4-5-20251001",
    max_tokens: options?.maxTokens ?? 600,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && "text" in textBlock ? textBlock.text : "";
}
