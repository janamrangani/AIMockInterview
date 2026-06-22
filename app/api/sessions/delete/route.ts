// app/api/sessions/delete/route.ts
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

    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("sessions/delete error:", err);
    return NextResponse.json({ error: "Failed to delete session." }, { status: 500 });
  }
}
