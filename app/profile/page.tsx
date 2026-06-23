"use client";
// app/profile/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type ProfileData = {
  email: string;
  plan: string;
  pack_expires_at: string | null;
  resume_filename: string | null;
  member_since: string;
  session_count: number;
};

function PlanBadge({ plan }: { plan: string }) {
  if (plan === "admin") return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Admin</Badge>;
  if (plan === "pack") return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Pack</Badge>;
  return <Badge variant="outline" className="text-muted-foreground">Free</Badge>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeText, setResumeText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const res = await fetch(`/api/profile?accessToken=${session.access_token}`);
      const data = await res.json();
      setProfile(data);
      if (data.resume_text) setResumeText(data.resume_text);
      setLoading(false);
    });
  }, [router]);

  async function saveResume() {
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/profile/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: session.access_token, resumeText }),
    });
    const json = await res.json();

    if (!res.ok) setSaveError(json.error ?? "Failed to save.");
    else setSaved(true);

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="max-w-lg mx-auto px-6 py-16">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (!profile) return null;

  const memberSince = new Date(profile.member_since).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="max-w-lg mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Profile</h1>

      {/* User details */}
      <div className="rounded-xl border border-border bg-white p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{profile.email}</p>
            <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Plan</span>
            <PlanBadge plan={profile.plan} />
          </div>
          <span className="text-muted-foreground">{profile.session_count} interview{profile.session_count !== 1 ? "s" : ""} completed</span>
        </div>
      </div>

      {/* Resume */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-semibold text-sm mb-1">Resume</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Paste your resume text and we'll tailor behavioral questions to your actual experience.
        </p>

        <textarea
          value={resumeText}
          onChange={(e) => { setResumeText(e.target.value); setSaved(false); }}
          placeholder="Paste your resume here — work experience, skills, projects..."
          className="w-full h-48 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-muted-foreground/60"
        />

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">{resumeText.length}/4000 characters</span>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            {saveError && <span className="text-xs text-red-600">{saveError}</span>}
            <button
              onClick={saveResume}
              disabled={saving || !resumeText.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save resume"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
