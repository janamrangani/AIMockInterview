// app/api/profile/route.ts — fetch profile data (plan, resume)
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.nextUrl.searchParams.get("accessToken");
    if (!accessToken) return NextResponse.json({ error: "Missing token." }, { status: 400 });

    const supabase = getSupabaseServerClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, pack_expires_at, resume_filename, created_at")
      .eq("id", user.id)
      .single();

    const { count } = await supabase
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      email: user.email,
      plan: profile?.plan ?? "free",
      pack_expires_at: profile?.pack_expires_at ?? null,
      resume_filename: profile?.resume_filename ?? null,
      member_since: user.created_at,
      session_count: count ?? 0,
    });
  } catch (err) {
    console.error("profile GET error:", err);
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 });
  }
}
