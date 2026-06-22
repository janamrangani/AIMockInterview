"use client";
// app/history/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CompanyLogo from "@/app/components/company-logo";

type SessionRow = {
  id: string;
  role: string;
  status: string;
  started_at: string;
  custom_company_name: string | null;
  companies: { name: string } | Array<{ name: string }>;
  feedback: Array<{ score: number | null }>;
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

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
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ScoreBadge({ score }: { score: number }) {
  const [bg, text] =
    score >= 7
      ? ["bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200", ""]
      : score >= 5
      ? ["bg-amber-100 text-amber-700 ring-1 ring-amber-200", ""]
      : ["bg-red-100 text-red-700 ring-1 ring-red-200", ""];

  return (
    <div className={cn("flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums", bg, text)}>
      {score}/10
    </div>
  );
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      supabase
        .from("sessions")
        .select("id, role, status, started_at, custom_company_name, companies(name), feedback(score)")
        .order("started_at", { ascending: false })
        .then(({ data }) => {
          setSessions((data as SessionRow[]) ?? []);
          setLoading(false);
        });
    });
  }, [router]);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Session history</h1>
          {!loading && (
            <p className="text-muted-foreground text-sm">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link href="/start" className={buttonVariants()}>
          New interview →
        </Link>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[72px] rounded-xl border border-border bg-muted/30 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No sessions yet</p>
          <p className="text-sm mb-6">Complete your first interview to see it here.</p>
          <Link href="/start" className={buttonVariants({ variant: "outline" })}>
            Start your first interview →
          </Link>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="space-y-2.5">
          {sessions.map((s) => {
            const score = avgScore(s.feedback);
            const name = companyName(s);
            const questionCount = s.feedback.length;

            return (
              <Link key={s.id} href={s.status === "completed" ? `/review/${s.id}` : `/session/${s.id}`} className="block group">
                <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border bg-white hover:border-indigo-200 hover:shadow-sm hover:shadow-indigo-50 transition-all duration-150">

                  {/* Company logo */}
                  <CompanyLogo name={name} size="md" />

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-semibold text-sm">{name}</span>
                      <span className="text-muted-foreground text-sm truncate">· {s.role}</span>
                      {s.status === "in_progress" && (
                        <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs py-0 px-1.5">
                          In progress
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.started_at)}
                      {questionCount > 0 && ` · ${questionCount} question${questionCount !== 1 ? "s" : ""}`}
                    </p>
                  </div>

                  {/* Score + arrow */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {score !== null ? (
                      <ScoreBadge score={score} />
                    ) : (
                      <span className="text-xs text-muted-foreground">No score</span>
                    )}
                    <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all text-sm">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
