"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CompanyLogo from "@/app/components/company-logo";
import { ArrowRight, Zap, BookOpen, User, ChevronRight } from "lucide-react";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type SessionRow = {
  id: string;
  role: string;
  status: string;
  started_at: string;
  custom_company_name: string | null;
  companies: { name: string } | Array<{ name: string }>;
  feedback: Array<{ score: number | null }>;
};

type DashboardData = {
  email: string;
  plan: string;
  pack_expires_at: string | null;
  stats: { totalSessions: number; avgScore: number | null; bestScore: number | null };
  recentSessions: SessionRow[];
};

function companyName(s: SessionRow): string {
  if (s.custom_company_name) return s.custom_company_name;
  const co = s.companies;
  return (Array.isArray(co) ? co[0]?.name : co?.name) ?? "—";
}

function avgScore(feedback: SessionRow["feedback"]): number | null {
  const scores = feedback.map((f) => f.score).filter((s): s is number => s !== null);
  if (!scores.length) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function scoreColor(score: number) {
  if (score >= 7) return "text-emerald-600";
  if (score >= 5) return "text-amber-500";
  return "text-red-500";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const res = await fetch(`/api/dashboard?accessToken=${session.access_token}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    });
  }, [router]);

  const firstName = data?.email?.split("@")[0] ?? "";
  const planLabel = data?.plan === "admin" ? "Admin" : data?.plan === "pack" ? "Pack" : "Free plan";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Greeting ─────────────────────────────────────────────── */}
        <div className="mb-12">
          {loading ? (
            <div className="h-10 w-64 bg-zinc-100 rounded-lg animate-pulse" />
          ) : (
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-2">{planLabel}</p>
                <h1 className="text-4xl font-bold tracking-tight">
                  Welcome back, {firstName}.
                </h1>
              </div>
              <Link
                href="/start"
                className="flex-shrink-0 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
              >
                New interview <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 divide-x divide-zinc-100 border border-zinc-100 rounded-2xl mb-12 overflow-hidden">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="px-8 py-7">
                <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse mb-3" />
                <div className="h-9 w-16 bg-zinc-100 rounded animate-pulse" />
              </div>
            ))
          ) : (
            <>
              {[
                { label: "Total sessions", value: String(data?.stats.totalSessions ?? 0) },
                { label: "Average score", value: data?.stats.avgScore != null ? `${data.stats.avgScore}/10` : "—" },
                { label: "Best score",    value: data?.stats.bestScore != null ? `${data.stats.bestScore}/10` : "—" },
              ].map((s) => (
                <div key={s.label} className="px-8 py-7 bg-white">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-2">{s.label}</p>
                  <p className="text-3xl font-bold tabular-nums tracking-tight">{s.value}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Two-column body ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Recent sessions (left, 2/3) ──────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-base">Recent sessions</h2>
              <Link href="/history" className="text-xs text-zinc-400 hover:text-foreground transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {loading && (
              <div className="space-y-px rounded-2xl border border-zinc-100 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-zinc-50 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && data?.recentSessions.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-200 px-8 py-16 text-center">
                <p className="font-medium text-foreground mb-1">No sessions yet</p>
                <p className="text-sm text-zinc-500 mb-6">Complete your first interview to see it here.</p>
                <Link
                  href="/start"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline underline-offset-4"
                >
                  Start your first interview <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {!loading && data && data.recentSessions.length > 0 && (
              <div className="rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-100">
                {data.recentSessions.map((s) => {
                  const name = companyName(s);
                  const score = avgScore(s.feedback);
                  const href = s.status === "completed" ? `/review/${s.id}` : `/session/${s.id}`;
                  return (
                    <Link
                      key={s.id}
                      href={href}
                      className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-zinc-50 transition-colors group"
                    >
                      <CompanyLogo name={name} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{name}</p>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">{s.role}</p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <p className="text-xs text-zinc-400">{formatDate(s.started_at)}</p>
                        {score !== null ? (
                          <span className={cn("text-sm font-bold tabular-nums", scoreColor(score))}>
                            {score}/10
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-300">—</span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right sidebar (1/3) ──────────────────────────────────── */}
          <div className="space-y-6">

            {/* Quick actions */}
            <div>
              <h2 className="font-semibold text-base mb-4">Quick actions</h2>
              <div className="rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-100">
                {[
                  { href: "/start",   Icon: Zap,      label: "Start interview",  desc: "New mock session" },
                  { href: "/kit",     Icon: BookOpen,  label: "Countdown Kit",    desc: "7 prep documents" },
                  { href: "/profile", Icon: User,      label: "Profile",          desc: "Resume & settings" },
                ].map(({ href, Icon, label, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-zinc-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Plan card */}
            {!loading && data?.plan === "free" && (
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">Free plan</p>
                <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                  Unlock full feedback, adaptive follow-ups, and 7 Countdown Kit documents.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center w-full h-9 rounded-full bg-foreground text-background text-xs font-medium hover:opacity-80 transition-opacity gap-1.5"
                >
                  Get Interview Pack — $17 <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {!loading && data?.plan === "pack" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">Interview Pack</p>
                  <span className="text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">Active</span>
                </div>
                {data?.pack_expires_at && (
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Valid until{" "}
                    <span className="font-medium text-foreground">
                      {new Date(data.pack_expires_at).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    </span>
                  </p>
                )}
              </div>
            )}

            {!loading && data?.plan === "admin" && (
              <div className="rounded-2xl border border-zinc-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">Plan</p>
                  <span className="text-xs font-medium bg-zinc-900 text-white px-2.5 py-0.5 rounded-full">Admin</span>
                </div>
                <div className="space-y-2">
                  {["All companies", "Unlimited sessions", "Full feedback", "Countdown Kit"].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-zinc-300 flex-shrink-0" />
                      <p className="text-xs text-zinc-500">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
