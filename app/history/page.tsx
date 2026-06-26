"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Trash2, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CompanyLogo from "@/app/components/company-logo";

type SessionRow = {
  id: string;
  role: string;
  status: string;
  started_at: string;
  custom_company_name: string | null;
  question_count: number;
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
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function scoreColor(score: number) {
  if (score >= 7) return "text-emerald-600";
  if (score >= 5) return "text-amber-500";
  return "text-red-500";
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      supabase
        .from("sessions")
        .select("id, role, status, started_at, custom_company_name, question_count, companies(name), feedback(score)")
        .order("started_at", { ascending: false })
        .then(({ data }) => {
          setSessions((data as SessionRow[]) ?? []);
          setLoading(false);
        });
    });
  }, [router]);

  async function handleDelete(sessionId: string) {
    setDeleting(sessionId);
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch("/api/sessions/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, accessToken: session.access_token }),
    });
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setConfirmDelete(null);
    setDeleting(null);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-2">Your sessions</p>
            <h1 className="text-4xl font-bold tracking-tight">Session history.</h1>
          </div>
          {!loading && sessions.length > 0 && (
            <Link
              href="/start"
              className="flex-shrink-0 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
            >
              New interview <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-zinc-100 rounded animate-pulse" />
                  <div className="h-2.5 w-48 bg-zinc-100 rounded animate-pulse" />
                </div>
                <div className="h-3 w-12 bg-zinc-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && sessions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-200 px-8 py-20 text-center">
            <p className="font-medium text-foreground mb-1">No sessions yet</p>
            <p className="text-sm text-zinc-500 mb-6">Complete your first mock interview to see it here.</p>
            <Link
              href="/start"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline underline-offset-4"
            >
              Start your first interview <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Session list */}
        {!loading && sessions.length > 0 && (
          <>
            <p className="text-xs text-zinc-400 mb-3">{sessions.length} session{sessions.length !== 1 ? "s" : ""}</p>
            <div className="rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-100">
              {sessions.map((s) => {
                const score = avgScore(s.feedback);
                const name = companyName(s);
                const href = s.status === "completed" ? `/review/${s.id}` : `/session/${s.id}`;
                const isConfirming = confirmDelete === s.id;
                const isDeleting = deleting === s.id;

                return (
                  <div key={s.id} className="relative group">

                    {/* Delete confirm overlay */}
                    {isConfirming && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 bg-white border-b border-zinc-100 px-5">
                        <p className="text-sm font-medium text-foreground flex-1">Delete this session?</p>
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={isDeleting}
                          className="px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-medium hover:bg-red-600 disabled:opacity-60 transition-colors"
                        >
                          {isDeleting ? "Deleting…" : "Delete"}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-4 py-1.5 rounded-full border border-zinc-200 text-xs font-medium hover:bg-zinc-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-zinc-50 transition-colors">
                      <Link href={href} className="flex items-center gap-4 flex-1 min-w-0">
                        <CompanyLogo name={name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm text-foreground truncate">{name}</span>
                            {s.status === "in_progress" && (
                              <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full flex-shrink-0">
                                In progress
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400">
                            {s.role}
                            {s.question_count > 0 && ` · ${s.question_count} question${s.question_count !== 1 ? "s" : ""}`}
                          </p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <p className="text-xs text-zinc-400 hidden sm:block">{formatDate(s.started_at)}</p>

                        {score !== null ? (
                          <span className={cn("text-sm font-bold tabular-nums", scoreColor(score))}>
                            {score}/10
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-300">—</span>
                        )}

                        <button
                          onClick={() => setConfirmDelete(s.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-zinc-300 hover:text-red-400 transition-all"
                          title="Delete session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <Link href={href}>
                          <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
