"use client";
// app/history/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SessionRow = {
  id: string;
  role: string;
  status: string;
  started_at: string;
  companies: { name: string } | Array<{ name: string }>;
  feedback: Array<{ score: number | null }>;
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function companyName(co: SessionRow["companies"]): string {
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

function ScoreRing({ score }: { score: number }) {
  const color = score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0", color)}>
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
        .select("id, role, status, started_at, companies(name), feedback(score)")
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

      {loading && <p className="text-muted-foreground text-sm">Loading…</p>}

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
        <div className="space-y-3">
          {sessions.map((s) => {
            const score = avgScore(s.feedback);
            const questionCount = s.feedback.length;
            return (
              <Link key={s.id} href={`/session/${s.id}`} className="block group">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-sm transition-all duration-150">
                  <div className="flex-shrink-0">
                    {score !== null ? (
                      <ScoreRing score={score} />
                    ) : (
                      <div className="w-11 h-11 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">—</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-sm">{companyName(s.companies)}</span>
                      <span className="text-muted-foreground text-sm">· {s.role}</span>
                      {s.status === "in_progress" && (
                        <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs py-0">
                          In progress
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.started_at)}
                      {questionCount > 0 && ` · ${questionCount} question${questionCount !== 1 ? "s" : ""}`}
                    </p>
                  </div>

                  <span className="text-muted-foreground group-hover:text-foreground transition-colors text-sm flex-shrink-0">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
