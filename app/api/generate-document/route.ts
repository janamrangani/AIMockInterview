// app/api/generate-document/route.ts
// Powers the whole "Interview Countdown Kit" — one route, one table, seven document types.
import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { buildCountdownKitPrompt } from "@/lib/prompts";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { type, companyId, role, userInput, accessToken, customCompanyName } = await req.json();

    const supabase = getSupabaseServerClient();

    // Verify user from access token
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    // Check plan — kit is pack/admin only
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, pack_expires_at")
      .eq("id", user.id)
      .single();

    const plan = profile?.plan ?? "free";
    const packExpires = profile?.pack_expires_at ? new Date(profile.pack_expires_at) : null;
    const hasAccess =
      plan === "admin" ||
      (plan === "pack" && packExpires && packExpires > new Date());

    if (!hasAccess) {
      return NextResponse.json({ error: "Interview Pack required." }, { status: 403 });
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

    const prompt = buildCountdownKitPrompt(type, company, role, userInput);
    const outputText = await callClaude(prompt, { maxTokens: 800 });

    const { data: doc, error: insertError } = await supabase
      .from("generated_documents")
      .insert({
        user_id: user.id,
        type,
        input_text: userInput,
        output_text: outputText.trim(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ document: doc });
  } catch (err) {
    console.error("generate-document error:", err);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}
