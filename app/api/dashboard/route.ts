// app/api/dashboard/route.ts
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.nextUrl.searchParams.get("accessToken");
    if (!accessToken) return NextResponse.json({ error: "Missing token." }, { status: 400 });

    const supabase = getSupabaseServerClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });

    const [{ data: profile }, { data: sessions }] = await Promise.all([
      supabase.from("profiles").select("plan, pack_expires_at").eq("id", user.id).single(),
      supabase
        .from("sessions")
        .select("id, role, status, started_at, custom_company_name, companies(name), feedback(score)")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(3),
    ]);

    // Fetch all scores for stats
    const { data: allFeedback } = await supabase
      .from("feedback")
      .select("score, session_id, sessions!inner(user_id)")
      .eq("sessions.user_id", user.id);

    const scores = (allFeedback ?? [])
      .map((f: any) => f.score)
      .filter((s: any): s is number => s !== null);

    const avgScore = scores.length
      ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : null;
    const bestScore = scores.length ? Math.max(...scores) : null;

    // Total sessions count
    const { count: totalSessions } = await supabase
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      email: user.email,
      plan: profile?.plan ?? "free",
      pack_expires_at: profile?.pack_expires_at ?? null,
      stats: {
        totalSessions: totalSessions ?? 0,
        avgScore,
        bestScore,
      },
      recentSessions: sessions ?? [],
    });
  } catch (err) {
    console.error("dashboard error:", err);
    return NextResponse.json({ error: "Failed to load dashboard." }, { status: 500 });
  }
}
