"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CompanyLogo from "@/app/components/company-logo";
import { BookOpen, Zap, User } from "lucide-react";

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

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 7 ? "text-emerald-600" :
    score >= 5 ? "text-amber-600" :
    "text-red-500";
  return (
    <span className={cn("text-xs font-bold tabular-nums", color)}>
      {score}/10
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  if (plan === "admin") return <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">Admin</span>;
  if (plan === "pack") return <span className="text-xs font-medium bg-zinc-900 text-white px-2 py-0.5 rounded-full">Pack</span>;
  return <span className="text-xs font-medium bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">Free</span>;
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

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        {loading ? (
          <div className="h-8 w-48 bg-zinc-100 rounded-lg animate-pulse mb-2" />
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-2">
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName}</h1>
              <Link
                href="/start"
                className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity flex-shrink-0"
              >
                New interview →
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <PlanBadge plan={data?.plan ?? "free"} />
              {data?.plan === "free" && (
                <Link href="/pricing" className="text-xs text-zinc-500 hover:text-foreground underline underline-offset-2 transition-colors">
                  Upgrade for full feedback →
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-100 animate-pulse" />
          ))
        ) : (
          <>
            {[
              { label: "Total sessions", value: data?.stats.totalSessions ?? 0 },
              { label: "Avg score", value: data?.stats.avgScore != null ? `${data.stats.avgScore}/10` : "—" },
              { label: "Best score", value: data?.stats.bestScore != null ? `${data.stats.bestScore}/10` : "—" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-zinc-100 bg-zinc-50 px-5 py-4">
                <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Recent sessions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">Recent sessions</h2>
          <Link href="/history" className="text-xs text-zinc-500 hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>

        {loading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && data?.recentSessions.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground mb-1">No sessions yet</p>
            <p className="text-xs text-zinc-500 mb-4">Complete your first interview to see it here.</p>
            <Link
              href="/start"
              className="inline-flex items-center h-9 px-4 rounded-full border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Start your first interview →
            </Link>
          </div>
        )}

        {!loading && data && data.recentSessions.length > 0 && (
          <div className="space-y-2">
            {data.recentSessions.map((s) => {
              const name = companyName(s);
              const score = avgScore(s.feedback);
              const href = s.status === "completed" ? `/review/${s.id}` : `/session/${s.id}`;
              return (
                <Link
                  key={s.id}
                  href={href}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm hover:shadow-zinc-100 transition-all"
                >
                  <CompanyLogo name={name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{name}</p>
                    <p className="text-xs text-zinc-500 truncate">{s.role}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {score !== null ? <ScorePill score={score} /> : <span className="text-xs text-zinc-400">No score</span>}
                    <span className="text-zinc-400 text-sm">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-sm mb-4">Quick actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/start", Icon: Zap, label: "Start Interview", color: "bg-zinc-100 text-zinc-600" },
            { href: "/kit", Icon: BookOpen, label: "Countdown Kit", color: "bg-zinc-100 text-zinc-600" },
            { href: "/profile", Icon: User, label: "Profile", color: "bg-zinc-100 text-zinc-600" },
          ].map(({ href, Icon, label, color }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2.5 rounded-xl border border-zinc-100 bg-white px-4 py-5 hover:border-zinc-200 hover:shadow-sm hover:shadow-zinc-100 transition-all text-center"
            >
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", color)}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
