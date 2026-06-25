// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { buildFeedbackPrompt } from "@/lib/prompts";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, questionId, companyId, type, question, answerExchange, customCompanyName } =
      await req.json();

    const supabase = getSupabaseServerClient();

    // Check plan — free users get score only, no strengths/gaps
    const { data: sessionData } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("id", sessionId)
      .single();

    let isPaid = false;
    if (sessionData) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan, pack_expires_at")
        .eq("id", sessionData.user_id)
        .single();
      const plan = profile?.plan ?? "free";
      const expires = profile?.pack_expires_at ? new Date(profile.pack_expires_at) : null;
      isPaid = plan === "admin" || (plan === "pack" && !!expires && expires > new Date());
    }

    let company: { name: string; interview_style_notes: string } | null = null;
    if (customCompanyName) {
      company = { name: customCompanyName, interview_style_notes: "" };
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

    const prompt = buildFeedbackPrompt(company, type, question, answerExchange);
    const raw = await callClaude(prompt, { maxTokens: 400 });

    let parsed;
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { score: null, strengths: "", gaps: raw };
    }

    // Always persist the full feedback. Free users see only the score in the response.
    const { data: feedback, error: insertError } = await supabase
      .from("feedback")
      .insert({
        session_id: sessionId,
        question_id: questionId,
        score: parsed.score,
        strengths_text: parsed.strengths ?? null,
        gaps_text: parsed.gaps ?? null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      feedback: {
        ...feedback,
        strengths_text: isPaid ? feedback?.strengths_text : null,
        gaps_text: isPaid ? feedback?.gaps_text : null,
      },
    });
  } catch (err) {
    console.error("feedback error:", err);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
