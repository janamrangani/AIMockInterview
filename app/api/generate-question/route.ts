// app/api/generate-question/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { buildQuestionGenPrompt } from "@/lib/prompts";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, companyId, role, type, previousQuestions } =
      await req.json();

    const supabase = getSupabaseServerClient();
    const { data: company, error } = await supabase
      .from("companies")
      .select("name, interview_style_notes")
      .eq("id", companyId)
      .single();

    if (error || !company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const prompt = buildQuestionGenPrompt(
      company,
      role,
      type,
      previousQuestions ?? []
    );
    const questionText = await callClaude(prompt, { maxTokens: 200 });

    // Persist the question
    const { data: question, error: insertError } = await supabase
      .from("questions")
      .insert({
        session_id: sessionId,
        type,
        prompt_text: questionText.trim(),
        order_index: (previousQuestions?.length ?? 0) + 1,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ question });
  } catch (err) {
    console.error("generate-question error:", err);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
