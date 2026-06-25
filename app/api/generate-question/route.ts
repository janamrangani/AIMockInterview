// app/api/generate-question/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { buildQuestionGenPrompt } from "@/lib/prompts";
import { getSupabaseServerClient } from "@/lib/supabase";

const GENERIC_STYLE_NOTES =
  "General professional interview. Behavioral questions follow the STAR format focusing on impact, ownership, collaboration, and problem-solving. Technical questions cover core CS fundamentals, algorithms, data structures, and system design appropriate to the role level.";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, companyId, role, type, previousQuestions, customCompanyName } =
      await req.json();

    const supabase = getSupabaseServerClient();

    let company: { name: string; interview_style_notes: string } | null = null;

    if (customCompanyName) {
      company = { name: customCompanyName, interview_style_notes: GENERIC_STYLE_NOTES };
    } else {
      const { data, error } = await supabase
        .from("companies")
        .select("name, interview_style_notes")
        .eq("id", companyId)
        .single();
      if (error || !data) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
      }
      company = data;
    }

    // Fetch the user's active resume (most recent upload) for behavioral question personalisation
    let resumeText: string | null = null;
    if (type === "behavioral" && sessionId) {
      const { data: sessionRow } = await supabase
        .from("sessions")
        .select("user_id")
        .eq("id", sessionId)
        .single();
      if (sessionRow) {
        const { data: resumeRow } = await supabase
          .from("user_resumes")
          .select("resume_text")
          .eq("user_id", sessionRow.user_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        resumeText = resumeRow?.resume_text ?? null;
      }
    }

    const prompt = buildQuestionGenPrompt(
      company,
      role,
      type,
      previousQuestions ?? [],
      resumeText
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
