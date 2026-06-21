// app/api/generate-document/route.ts
// Powers the whole "Interview Countdown Kit" — one route, one table, seven document types.
import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { buildCountdownKitPrompt } from "@/lib/prompts";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId, type, companyId, role, userInput } = await req.json();

    const supabase = getSupabaseServerClient();
    const { data: company, error } = await supabase
      .from("companies")
      .select("name, interview_style_notes")
      .eq("id", companyId)
      .single();

    if (error || !company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const prompt = buildCountdownKitPrompt(type, company, role, userInput);
    const outputText = await callClaude(prompt, { maxTokens: 500 });

    const { data: doc, error: insertError } = await supabase
      .from("generated_documents")
      .insert({
        user_id: userId,
        type,
        input_text: userInput,
        output_text: outputText.trim(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ document: doc });
  } catch (err) {
    console.error("generate-document error:", err);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}
