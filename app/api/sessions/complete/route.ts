// app/api/sessions/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, accessToken } = await req.json();
    if (!sessionId || !accessToken) {
      return NextResponse.json({ error: "Missing params." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const completedAt = new Date().toISOString();

    // Count questions answered in this session
    const { count: qCount } = await supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId);

    // Fetch started_at to compute duration
    const { data: sessionRow } = await supabase
      .from("sessions")
      .select("started_at")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    const durationSeconds = sessionRow?.started_at
      ? Math.round((Date.now() - new Date(sessionRow.started_at).getTime()) / 1000)
      : null;

    await supabase
      .from("sessions")
      .update({
        status: "completed",
        completed_at: completedAt,
        question_count: qCount ?? 0,
        duration_seconds: durationSeconds,
      })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("sessions/complete error:", err);
    return NextResponse.json({ error: "Failed to complete session." }, { status: 500 });
  }
}
