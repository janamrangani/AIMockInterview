"use client";
// app/review/[id]/page.tsx — Read-only session review
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Check, TrendingUp, MessageSquare, Code2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CompanyLogo from "@/app/components/company-logo";

// ── Types ─────────────────────────────────────────────────────────────────────

type SessionData = {
  id: string;
  role: string;
  status: string;
  started_at: string;
  custom_company_name: string | null;
  companies: { name: string } | Array<{ name: string }>;
};

type Question = {
  id: string;
  type: "behavioral" | "technical";
  prompt_text: string;
  order_index: number;
};

type Answer = {
  id: string;
  question_id: string;
  user_answer_text: string;
  is_followup: boolean;
  created_at: string;
};

type Feedback = {
  question_id: string;
  score: number | null;
  strengths_text: string | null;
  gaps_text: string | null;
};

type QuestionWithData = Question & {
  answers: Answer[];
  feedback: Feedback | null;
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function companyName(s: SessionData): string {
  if (s.custom_company_name) return s.custom_company_name;
  const co = s.companies;
  return (Array.isArray(co) ? co[0]?.name : co?.name) ?? "—";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

// ── Score badge ───────────────────────────────────────────────────────────────

function ScorePill({ score }: { score: number }) {
  const cls =
    score >= 7 ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
    : score >= 5 ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
    : "bg-red-100 text-red-700 ring-1 ring-red-200";
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tabular-nums", cls)}>
      {score}/10
    </span>
  );
}

// ── Single question card ──────────────────────────────────────────────────────

function QuestionCard({ q, index }: { q: QuestionWithData; index: number }) {
  const mainAnswers = q.answers.filter((a) => !a.is_followup);
  const followUps = q.answers.filter((a) => a.is_followup);

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      {/* Question header */}
      <div className={cn(
        "px-6 py-5 border-b border-border",
        q.type === "behavioral" ? "bg-indigo-50/60" : "bg-violet-50/60"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
            q.type === "behavioral"
              ? "bg-indigo-100 text-indigo-600"
              : "bg-violet-100 text-violet-600"
          )}>
            {q.type === "behavioral"
              ? <MessageSquare className="w-4 h-4" />
              : <Code2 className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full",
                q.type === "behavioral"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-violet-100 text-violet-700"
              )}>
                Q{index + 1} · {q.type}
              </span>
              {q.feedback?.score != null && <ScorePill score={q.feedback.score} />}
            </div>
            <p className="text-base font-semibold leading-relaxed">{q.prompt_text}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Main answer */}
        {mainAnswers.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Your answer</p>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap bg-muted/30 rounded-xl p-4 border border-border">
              {mainAnswers[0].user_answer_text}
            </p>
          </div>
        )}

        {/* Follow-up exchanges */}
        {followUps.map((fu, i) => (
          <div key={fu.id}>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">Follow-up answer {i + 1}</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap bg-amber-50 rounded-xl p-4 border border-amber-100">
              {fu.user_answer_text}
            </p>
          </div>
        ))}

        {/* Feedback */}
        {q.feedback && (
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {q.feedback.strengths_text && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Strengths</p>
                </div>
                <p className="text-sm text-emerald-900 leading-relaxed">{q.feedback.strengths_text}</p>
              </div>
            )}
            {q.feedback.gaps_text && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-700">To improve</p>
                </div>
                <p className="text-sm text-orange-900 leading-relaxed">{q.feedback.gaps_text}</p>
              </div>
            )}
          </div>
        )}

        {q.answers.length === 0 && !q.feedback && (
          <p className="text-sm text-muted-foreground italic">No answer recorded for this question.</p>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ReviewPage({ params }: { params: { id: string } }) {
  const sessionId = params.id;
  const [session, setSession] = useState<SessionData | null>(null);
  const [questions, setQuestions] = useState<QuestionWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(async ({ data: { session: authSession } }) => {
      if (!authSession) { router.replace("/login"); return; }

      // Fetch session
      const { data: sessionData, error: sessionErr } = await supabase
        .from("sessions")
        .select("id, role, status, started_at, custom_company_name, companies(name)")
        .eq("id", sessionId)
        .single();

      if (sessionErr || !sessionData) {
        setError("Session not found.");
        setLoading(false);
        return;
      }

      // Fetch questions, answers, feedback in parallel
      const [{ data: qs }, { data: ans }, { data: fb }] = await Promise.all([
        supabase.from("questions").select("id, type, prompt_text, order_index").eq("session_id", sessionId).order("order_index"),
        supabase.from("answers").select("id, question_id, user_answer_text, is_followup, created_at").in("question_id",
          // will be requeried after we have question ids — placeholder
          ["00000000-0000-0000-0000-000000000000"]
        ),
        supabase.from("feedback").select("question_id, score, strengths_text, gaps_text").eq("session_id", sessionId),
      ]);

      const questionList = (qs ?? []) as Question[];

      // Fetch answers properly now that we have question IDs
      let answerList: Answer[] = [];
      if (questionList.length > 0) {
        const { data: answers } = await supabase
          .from("answers")
          .select("id, question_id, user_answer_text, is_followup, created_at")
          .in("question_id", questionList.map((q) => q.id))
          .order("created_at");
        answerList = (answers ?? []) as Answer[];
      }

      const feedbackList = (fb ?? []) as Feedback[];

      // Combine
      const combined: QuestionWithData[] = questionList.map((q) => ({
        ...q,
        answers: answerList.filter((a) => a.question_id === q.id),
        feedback: feedbackList.find((f) => f.question_id === q.id) ?? null,
      }));

      setSession(sessionData as SessionData);
      setQuestions(combined);
      setLoading(false);
    });
  }, [sessionId, router]);

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl border border-border bg-muted/30 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-destructive mb-4">{error ?? "Session not found."}</p>
        <Link href="/history" className={buttonVariants({ variant: "outline" })}>← Back to history</Link>
      </main>
    );
  }

  const name = companyName(session);
  const scores = questions.map((q) => q.feedback?.score).filter((s): s is number => s != null);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <CompanyLogo name={name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
            {avgScore != null && (
              <span className={cn(
                "text-sm font-bold px-3 py-1 rounded-full tabular-nums",
                avgScore >= 7 ? "bg-emerald-100 text-emerald-700"
                : avgScore >= 5 ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
              )}>
                Avg {avgScore}/10
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{session.role} · {formatDate(session.started_at)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
            {scores.length > 0 && ` · ${scores.length} scored`}
          </p>
        </div>
      </div>

      {/* No questions */}
      {questions.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-base font-medium mb-1">No questions recorded</p>
          <p className="text-sm">This session ended before any questions were answered.</p>
        </div>
      )}

      {/* Question cards */}
      <div className="space-y-5">
        {questions.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} />
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-3 mt-10 pt-6 border-t border-border">
        <Link href="/history" className={buttonVariants({ variant: "outline" })}>
          ← Back to history
        </Link>
        <Link href="/start" className={buttonVariants()}>
          New interview →
        </Link>
      </div>
    </main>
  );
}
