// app/api/profile/resume/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const accessToken = formData.get("accessToken") as string | null;

    if (!file || !accessToken) {
      return NextResponse.json({ error: "Missing file or token." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText = "";
    if (file.type === "application/pdf") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const parsed = await pdfParse(buffer);
      resumeText = parsed.text.trim();
    } else {
      // Plain text or docx fallback — read as text
      resumeText = buffer.toString("utf-8").trim();
    }

    if (!resumeText) {
      return NextResponse.json({ error: "Could not extract text from resume." }, { status: 400 });
    }

    // Truncate to 4000 chars to keep prompt size manageable
    resumeText = resumeText.slice(0, 4000);

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ resume_text: resumeText, resume_filename: file.name })
      .eq("id", user.id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ ok: true, filename: file.name });
  } catch (err) {
    console.error("resume upload error:", err);
    return NextResponse.json({ error: "Failed to process resume." }, { status: 500 });
  }
}
