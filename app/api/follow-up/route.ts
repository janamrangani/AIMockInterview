// app/api/follow-up/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { buildFollowUpPrompt } from "@/lib/prompts";
import { getSupabaseServerClient } from "@/lib/supabase";

const MAX_FOLLOWUPS = 2;

async function getPlanForSession(supabase: ReturnType<typeof getSupabaseServerClient>, sessionId: string): Promise<string> {
  const { data } = await supabase
    .from("sessions")
    .select("user_id")
    .eq("id", sessionId)
    .single();
  if (!data) return "free";

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, pack_expires_at")
    .eq("id", data.user_id)
    .single();

  if (!profile) return "free";
  if (profile.plan === "admin") return "admin";
  if (profile.plan === "pack") {
    const expires = profile.pack_expires_at ? new Date(profile.pack_expires_at) : null;
    return expires && expires > new Date() ? "pack" : "free";
  }
  return "free";
}

export async function POST(req: NextRequest) {
  try {
    const { questionId, sessionId, originalQuestion, userAnswer, companyId, followUpCount, customCompanyName } =
      await req.json();

    if (followUpCount >= MAX_FOLLOWUPS) {
      return NextResponse.json({ followUp: null });
    }

    const supabase = getSupabaseServerClient();

    // Save the user's answer. follow_up_index: 0 = initial, 1 = first follow-up, 2 = second.
    await supabase.from("answers").insert({
      question_id: questionId,
      user_answer_text: userAnswer,
      follow_up_index: followUpCount,
    });

    // Free users don't get follow-ups
    if (sessionId) {
      const plan = await getPlanForSession(supabase, sessionId);
      if (plan === "free") {
        return NextResponse.json({ followUp: null });
      }
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

    const prompt = buildFollowUpPrompt(
      company,
      originalQuestion,
      userAnswer,
      followUpCount
    );
    const result = (await callClaude(prompt, { maxTokens: 150 })).trim();

    const followUp = result === "NO_FOLLOWUP_NEEDED" ? null : result;

    // Persist follow-up count on the question so the server tracks state
    if (followUp) {
      await supabase
        .from("questions")
        .update({ follow_up_count: followUpCount + 1 })
        .eq("id", questionId);
    }

    return NextResponse.json({ followUp });
  } catch (err) {
    console.error("follow-up error:", err);
    return NextResponse.json(
      { error: "Failed to generate follow-up" },
      { status: 500 }
    );
  }
}
