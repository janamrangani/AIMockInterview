// app/api/follow-up/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { buildFollowUpPrompt } from "@/lib/prompts";
import { getSupabaseServerClient } from "@/lib/supabase";

const MAX_FOLLOWUPS = 2;

export async function POST(req: NextRequest) {
  try {
    const { questionId, originalQuestion, userAnswer, companyId, followUpCount } =
      await req.json();

    if (followUpCount >= MAX_FOLLOWUPS) {
      return NextResponse.json({ followUp: null });
    }

    const supabase = getSupabaseServerClient();
    const { data: company, error } = await supabase
      .from("companies")
      .select("name, interview_style_notes")
      .eq("id", companyId)
      .single();

    if (error || !company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Save the user's answer first
    await supabase.from("answers").insert({
      question_id: questionId,
      user_answer_text: userAnswer,
      is_followup: followUpCount > 0,
    });

    const prompt = buildFollowUpPrompt(
      company,
      originalQuestion,
      userAnswer,
      followUpCount
    );
    const result = (await callClaude(prompt, { maxTokens: 150 })).trim();

    const followUp = result === "NO_FOLLOWUP_NEEDED" ? null : result;

    return NextResponse.json({ followUp });
  } catch (err) {
    console.error("follow-up error:", err);
    return NextResponse.json(
      { error: "Failed to generate follow-up" },
      { status: 500 }
    );
  }
}
