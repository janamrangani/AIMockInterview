// app/api/sessions/route.ts
// Creates a new session with plan enforcement:
//   free plan  → max 2 sessions per calendar month
//   pack plan  → max 5 sessions total (valid 30 days from purchase)
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { companyId, role, accessToken, customCompanyName } = await req.json();

    if (!companyId || !role?.trim() || !accessToken) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // Verify the user from their access token
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    // Fetch or bootstrap the user's profile
    let { data: profile } = await supabase
      .from("profiles")
      .select("plan, pack_started_at, pack_expires_at")
      .eq("id", user.id)
      .single();

    if (!profile) {
      // Profile may not exist yet (pre-trigger users) — create it now
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({ id: user.id })
        .select("plan, pack_started_at, pack_expires_at")
        .single();
      profile = newProfile;
    }

    const plan = profile?.plan ?? "free";

    // Admin plan — no caps, no expiry checks
    if (plan === "admin") {
      const { data: session, error: insertErr } = await supabase
        .from("sessions")
        .insert({ user_id: user.id, company_id: companyId, role: role.trim(), custom_company_name: customCompanyName ?? null })
        .select()
        .single();
      if (insertErr) throw insertErr;
      return NextResponse.json({ session });
    }

    const packExpires = profile?.pack_expires_at ? new Date(profile.pack_expires_at) : null;
    const packActive = plan === "pack" && packExpires && packExpires > new Date();

    if (plan === "free") {
      // Count sessions started this calendar month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("started_at", monthStart.toISOString());

      if ((count ?? 0) >= 2) {
        return NextResponse.json(
          {
            error: "free_cap_reached",
            message: "You've used your 2 free sessions this month. Upgrade to the Interview Pack to keep going.",
          },
          { status: 403 }
        );
      }
    } else if (plan === "pack" && !packActive) {
      return NextResponse.json(
        {
          error: "pack_expired",
          message: "Your Interview Pack has expired. Pick up a new one to continue.",
        },
        { status: 403 }
      );
    } else if (packActive) {
      // Pack active — enforce 5-session cap within the pack period.
      // Use pack_started_at if available, otherwise fall back to pack_expires_at - 30 days.
      const packStarted = profile?.pack_started_at
        ? new Date(profile.pack_started_at)
        : new Date(packExpires!.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { count } = await supabase
        .from("sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("started_at", packStarted.toISOString());

      if ((count ?? 0) >= 5) {
        return NextResponse.json(
          {
            error: "pack_cap_reached",
            message: "You've used all 5 sessions in your Interview Pack.",
          },
          { status: 403 }
        );
      }
    }

    // Insert the session
    const { data: session, error: insertErr } = await supabase
      .from("sessions")
      .insert({ user_id: user.id, company_id: companyId, role: role.trim(), custom_company_name: customCompanyName ?? null })
      .select()
      .single();

    if (insertErr) throw insertErr;

    return NextResponse.json({ session });
  } catch (err) {
    console.error("sessions POST error:", err);
    return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
  }
}
