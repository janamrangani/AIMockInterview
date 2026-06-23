"use client";
// app/dashboard/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    score >= 7 ? "bg-emerald-100 text-emerald-700" :
    score >= 5 ? "bg-amber-100 text-amber-700" :
    "bg-red-100 text-red-700";
  return (
    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full tabular-nums", color)}>
      {score}/10
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  if (plan === "admin") return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Admin</Badge>;
  if (plan === "pack") return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Pack</Badge>;
  return <Badge variant="outline" className="text-muted-foreground text-xs">Free</Badge>;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-white px-5 py-4 flex-1">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
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
      <div className="flex items-center justify-between mb-8">
        <div>
          {loading ? (
            <div className="h-8 w-48 bg-muted/40 rounded-lg animate-pulse mb-2" />
          ) : (
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Welcome back, {firstName}
            </h1>
          )}
          {!loading && data && (
            <div className="flex items-center gap-2">
              <PlanBadge plan={data.plan} />
              {data.plan === "free" && (
                <Link href="/pricing" className="text-xs text-indigo-600 hover:underline">
                  Upgrade for follow-ups & full feedback →
                </Link>
              )}
            </div>
          )}
        </div>
        <Link href="/start" className={buttonVariants({ size: "sm" })}>
          New interview →
        </Link>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-8">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 h-20 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </>
        ) : (
          <>
            <StatCard label="Total sessions" value={data?.stats.totalSessions ?? 0} />
            <StatCard label="Avg score" value={data?.stats.avgScore != null ? `${data.stats.avgScore}/10` : "—"} />
            <StatCard label="Best score" value={data?.stats.bestScore != null ? `${data.stats.bestScore}/10` : "—"} />
          </>
        )}
      </div>

      {/* Recent sessions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Recent sessions</h2>
          <Link href="/history" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>

        {loading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && data?.recentSessions.length === 0 && (
          <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
            <p className="text-sm font-medium mb-1">No sessions yet</p>
            <p className="text-xs mb-4">Complete your first interview to see it here.</p>
            <Link href="/start" className={buttonVariants({ variant: "outline", size: "sm" })}>
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
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <CompanyLogo name={name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.role}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {score !== null ? <ScorePill score={score} /> : <span className="text-xs text-muted-foreground">No score</span>}
                    <span className="text-muted-foreground text-sm">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-sm mb-3">Quick actions</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/start"
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white px-4 py-5 hover:border-indigo-200 hover:shadow-sm transition-all text-center"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs font-medium">Start Interview</span>
          </Link>
          <Link
            href="/kit"
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white px-4 py-5 hover:border-indigo-200 hover:shadow-sm transition-all text-center"
          >
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs font-medium">Countdown Kit</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white px-4 py-5 hover:border-indigo-200 hover:shadow-sm transition-all text-center"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
