// lib/anthropic.ts
import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log("OPENAI_API_KEY present:", !!apiKey, "length:", apiKey?.length ?? 0);
  if (!_openai) _openai = new OpenAI({ apiKey });
  return _openai;
}

export async function callClaude(
  prompt: string,
  options?: { model?: string; maxTokens?: number }
): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: options?.model ?? "gpt-4o-mini",
    max_tokens: options?.maxTokens ?? 600,
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0]?.message?.content ?? "";
}
