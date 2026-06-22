"use client";
// app/session/[id]/page.tsx
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { MessageSquare, Code2, Check, TrendingUp } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Phase =
  | "loading"
  | "select-type"
  | "generating"
  | "answering"
  | "follow-up"
  | "getting-feedback"
  | "feedback"
  | "error";

type Question = {
  id: string;
  prompt_text: string;
  type: "behavioral" | "technical";
};

type FeedbackData = {
  score: number;
  strengths_text: string;
  gaps_text: string;
};

type SessionInfo = {
  companyId: string;
  companyName: string;
  customCompanyName: string | null;
  role: string;
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function SessionPage({ params }: { params: { id: string } }) {
  const sessionId = params.id;

  const [phase, setPhase] = useState<Phase>("loading");
  const [isBusy, setIsBusy] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  const [question, setQuestion] = useState<Question | null>(null);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(0);

  const [answer, setAnswer] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [exchange, setExchange] = useState("");

  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    supabase
      .from("sessions")
      .select("company_id, role, custom_company_name, companies(name)")
      .eq("id", sessionId)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) { setError("Session not found."); setPhase("error"); return; }
        const co = data.companies as { name: string } | Array<{ name: string }>;
        const companyName = Array.isArray(co) ? co[0]?.name : co?.name;
        setSessionInfo({
          companyId: data.company_id as string,
          companyName: companyName ?? "",
          customCompanyName: (data.custom_company_name as string | null) ?? null,
          role: data.role as string,
        });
        setPhase("select-type");
      });
  }, [sessionId]);

  async function generateQuestion(type: "behavioral" | "technical") {
    if (!sessionInfo) return;
    setPhase("generating");
    setError(null);
    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, companyId: sessionInfo.companyId, role: sessionInfo.role, type, previousQuestions, customCompanyName: sessionInfo.customCompanyName }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to generate question.");
      setQuestion(json.question);
      setPreviousQuestions((prev) => [...prev, json.question.prompt_text]);
      setQuestionCount((c) => c + 1);
      setAnswer(""); setFollowUpCount(0); setFollowUpQuestion(null); setFollowUpAnswer(""); setExchange("");
      setPhase("answering");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("select-type");
    }
  }

  async function submitMainAnswer() {
    if (!question || !sessionInfo || !answer.trim()) return;
    setIsBusy(true); setError(null);
    const currentExchange = `Interviewer: ${question.prompt_text}\nCandidate: ${answer}`;
    try {
      const res = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, originalQuestion: question.prompt_text, userAnswer: answer, companyId: sessionInfo.companyId, followUpCount: 0, customCompanyName: sessionInfo.customCompanyName }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to process answer.");
      if (json.followUp) {
        setExchange(currentExchange); setFollowUpQuestion(json.followUp); setFollowUpCount(1); setFollowUpAnswer(""); setPhase("follow-up");
      } else {
        await getFeedback(currentExchange);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsBusy(false);
    }
  }

  async function submitFollowUpAnswer() {
    if (!question || !sessionInfo || !followUpQuestion || !followUpAnswer.trim()) return;
    setIsBusy(true); setError(null);
    const fullExchange = `${exchange}\nInterviewer: ${followUpQuestion}\nCandidate: ${followUpAnswer}`;
    try {
      const res = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, originalQuestion: question.prompt_text, userAnswer: followUpAnswer, companyId: sessionInfo.companyId, followUpCount, customCompanyName: sessionInfo.customCompanyName }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to process answer.");
      if (json.followUp) {
        setExchange(fullExchange); setFollowUpQuestion(json.followUp); setFollowUpCount((c) => c + 1); setFollowUpAnswer("");
      } else {
        await getFeedback(fullExchange);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsBusy(false);
    }
  }

  async function getFeedback(exchangeText: string) {
    if (!question || !sessionInfo) return;
    setPhase("getting-feedback");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, questionId: question.id, companyId: sessionInfo.companyId, type: question.type, question: question.prompt_text, answerExchange: exchangeText, customCompanyName: sessionInfo.customCompanyName }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to get feedback.");
      setFeedback(json.feedback);
      setPhase("feedback");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to get feedback.");
      setPhase("feedback");
    }
  }

  function startNextQuestion() {
    setQuestion(null); setFeedback(null); setAnswer(""); setFollowUpAnswer("");
    setFollowUpQuestion(null); setExchange(""); setError(null); setPhase("select-type");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-muted-foreground text-sm animate-pulse">Loading session…</p>
      </main>
    );
  }

  if (phase === "error") {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-destructive mb-4">{error}</p>
        <Link href="/start" className={buttonVariants({ variant: "outline" })}>
          ← Back to start
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      {/* Session breadcrumb */}
      <div className="flex items-center gap-2 mb-10 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{sessionInfo?.customCompanyName ?? sessionInfo?.companyName}</span>
        <span>·</span>
        <span>{sessionInfo?.role}</span>
        {questionCount > 0 && (
          <>
            <span>·</span>
            <span className="text-indigo-600 font-medium">Q{questionCount}</span>
          </>
        )}
      </div>

      {/* ── Pick type ── */}
      {phase === "select-type" && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {questionCount === 0 ? "Ready to start?" : "Next question"}
          </h1>
          <p className="text-muted-foreground mb-10">
            {questionCount === 0
              ? "Choose a question type to get your first question."
              : "Keep going or switch it up."}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => generateQuestion("behavioral")}
              className="group p-6 rounded-2xl border-2 border-border bg-white text-left hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="font-semibold text-base mb-1">Behavioral</p>
              <p className="text-sm text-muted-foreground">Tell me about a time…</p>
            </button>
            <button
              onClick={() => generateQuestion("technical")}
              className="group p-6 rounded-2xl border-2 border-border bg-white text-left hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <p className="font-semibold text-base mb-1">Technical</p>
              <p className="text-sm text-muted-foreground">Coding / problem-solving</p>
            </button>
          </div>
          {error && <p className="text-sm text-destructive mt-4">{error}</p>}
        </div>
      )}

      {/* ── Generating ── */}
      {phase === "generating" && (
        <div className="py-12 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Generating your question…</p>
        </div>
      )}

      {/* ── Answering ── */}
      {phase === "answering" && question && (
        <div className="space-y-6">
          {/* Question card */}
          <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={cn(
                "inline-flex items-center rounded-full text-xs font-semibold px-2.5 py-1",
                question.type === "behavioral"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-violet-100 text-violet-700"
              )}>
                {question.type}
              </span>
            </div>
            <p className="text-lg font-semibold leading-relaxed text-foreground">
              {question.prompt_text}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Your answer</label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here. Be specific — use real examples, metrics, and outcomes."
              rows={8}
              className="resize-none text-base leading-relaxed"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={submitMainAnswer} disabled={!answer.trim() || isBusy} size="lg">
            {isBusy ? "Analyzing…" : "Submit answer →"}
          </Button>
        </div>
      )}

      {/* ── Follow-up ── */}
      {phase === "follow-up" && question && followUpQuestion && (
        <div className="space-y-6">
          {/* Greyed original context */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1 opacity-60">
            <p className="text-xs font-medium text-muted-foreground line-clamp-2">
              {question.prompt_text}
            </p>
            <p className="text-xs text-muted-foreground italic line-clamp-2">
              You: {answer}
            </p>
          </div>

          {/* Follow-up question */}
          <div className="rounded-2xl border-2 border-amber-100 bg-amber-50/50 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                Follow-up
              </span>
            </div>
            <p className="text-lg font-semibold leading-relaxed">{followUpQuestion}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Your answer</label>
            <Textarea
              value={followUpAnswer}
              onChange={(e) => setFollowUpAnswer(e.target.value)}
              placeholder="Go deeper — add the specific detail or outcome they're probing for."
              rows={6}
              className="resize-none text-base leading-relaxed"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={submitFollowUpAnswer}
            disabled={!followUpAnswer.trim() || isBusy}
            size="lg"
          >
            {isBusy ? "Analyzing…" : "Submit answer →"}
          </Button>
        </div>
      )}

      {/* ── Getting feedback ── */}
      {phase === "getting-feedback" && (
        <div className="py-12 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Analyzing your answer…</p>
        </div>
      )}

      {/* ── Feedback ── */}
      {phase === "feedback" && (
        <div className="space-y-5">
          {error && !feedback && <p className="text-destructive text-sm">{error}</p>}

          {feedback && (
            <>
              {/* Score hero */}
              <div className="rounded-2xl border border-border bg-white p-6 flex items-center gap-5">
                <ScoreRing score={feedback.score} />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Overall score</p>
                  <p className="text-2xl font-bold">{feedback.score}<span className="text-muted-foreground font-normal text-base">/10</span></p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{question?.prompt_text}</p>
                </div>
              </div>

              {/* Strengths */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                    Strengths
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-emerald-900">{feedback.strengths_text}</p>
              </div>

              {/* Gaps */}
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-700">
                    To improve
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-orange-900">{feedback.gaps_text}</p>
              </div>
            </>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={startNextQuestion} size="lg">
              Next question →
            </Button>
            <Link href="/history" className={buttonVariants({ variant: "outline" })}>
              View history
            </Link>
            <Link href="/start" className={buttonVariants({ variant: "ghost" })}>
              Finish
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

function ScoreRing({ score }: { score: number }) {
  const [bg, ring] =
    score >= 7
      ? ["bg-emerald-500", "ring-4 ring-emerald-100"]
      : score >= 5
      ? ["bg-amber-500", "ring-4 ring-amber-100"]
      : ["bg-red-500", "ring-4 ring-red-100"];

  return (
    <div
      className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0",
        bg, ring
      )}
    >
      {score}
    </div>
  );
}
