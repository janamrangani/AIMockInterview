// app/api/profile/resume/route.ts
// Receives pre-extracted resume text from the client (PDF parsed in browser via pdfjs-dist)
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, resumeText, filename } = await req.json();

    if (!accessToken || !resumeText) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const trimmed = resumeText.trim().slice(0, 4000);

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ resume_text: trimmed, resume_filename: filename ?? null })
      .eq("id", user.id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ ok: true, filename });
  } catch (err) {
    console.error("resume save error:", err);
    return NextResponse.json({ error: "Failed to save resume." }, { status: 500 });
  }
}
