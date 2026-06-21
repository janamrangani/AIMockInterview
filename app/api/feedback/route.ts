// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { buildFeedbackPrompt } from "@/lib/prompts";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, questionId, companyId, type, question, answerExchange } =
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

    const prompt = buildFeedbackPrompt(company, type, question, answerExchange);
    const raw = await callClaude(prompt, { maxTokens: 400 });

    let parsed;
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      // Model occasionally wraps JSON in text despite instructions — extract it
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { score: null, strengths: "", gaps: raw };
    }

    const { data: feedback, error: insertError } = await supabase
      .from("feedback")
      .insert({
        session_id: sessionId,
        question_id: questionId,
        score: parsed.score,
        strengths_text: parsed.strengths,
        gaps_text: parsed.gaps,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ feedback });
  } catch (err) {
    console.error("feedback error:", err);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
