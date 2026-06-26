// app/api/review/route.ts
// Fetches full session review data server-side (service role bypasses RLS on questions).
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    const accessToken = req.nextUrl.searchParams.get("accessToken");

    if (!sessionId || !accessToken) {
      return NextResponse.json({ error: "Missing params." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // Verify the user
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    // Fetch session (must belong to this user)
    const { data: session, error: sessionErr } = await supabase
      .from("sessions")
      .select("id, role, status, started_at, custom_company_name, question_count, duration_seconds, companies(name)")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionErr || !session) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    // Fetch questions, answers, feedback in parallel
    const [{ data: questions }, { data: feedback }] = await Promise.all([
      supabase
        .from("questions")
        .select("id, type, prompt_text, order_index")
        .eq("session_id", sessionId)
        .order("order_index"),
      supabase
        .from("feedback")
        .select("question_id, score, strengths_text, gaps_text")
        .eq("session_id", sessionId),
    ]);

    const questionList = questions ?? [];

    let answers: any[] = [];
    if (questionList.length > 0) {
      const { data } = await supabase
        .from("answers")
        .select("id, question_id, user_answer_text, follow_up_index, created_at")
        .in("question_id", questionList.map((q) => q.id))
        .order("created_at");
      answers = data ?? [];
    }

    return NextResponse.json({ session, questions: questionList, answers, feedback: feedback ?? [] });
  } catch (err) {
    console.error("review GET error:", err);
    return NextResponse.json({ error: "Failed to load review." }, { status: 500 });
  }
}
