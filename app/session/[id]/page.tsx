"use client";
// app/session/[id]/page.tsx
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
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
      .select("company_id, role, companies(name)")
      .eq("id", sessionId)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) { setError("Session not found."); setPhase("error"); return; }
        const co = data.companies as { name: string } | Array<{ name: string }>;
        const companyName = Array.isArray(co) ? co[0]?.name : co?.name;
        setSessionInfo({
          companyId: data.company_id as string,
          companyName: companyName ?? "",
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
        body: JSON.stringify({ sessionId, companyId: sessionInfo.companyId, role: sessionInfo.role, type, previousQuestions }),
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
        body: JSON.stringify({ questionId: question.id, originalQuestion: question.prompt_text, userAnswer: answer, companyId: sessionInfo.companyId, followUpCount: 0 }),
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
        body: JSON.stringify({ questionId: question.id, originalQuestion: question.prompt_text, userAnswer: followUpAnswer, companyId: sessionInfo.companyId, followUpCount }),
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
        body: JSON.stringify({ sessionId, questionId: question.id, companyId: sessionInfo.companyId, type: question.type, question: question.prompt_text, answerExchange: exchangeText }),
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
        <p className="text-muted-foreground text-sm">Loading…</p>
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
    <main className="max-w-2xl mx-auto px-6 py-10">
      {/* Session header */}
      <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
        <span>{sessionInfo?.companyName}</span>
        <span>·</span>
        <span>{sessionInfo?.role}</span>
        {questionCount > 0 && (
          <>
            <span>·</span>
            <span>Question {questionCount}</span>
          </>
        )}
      </div>

      {/* ── Pick type ── */}
      {phase === "select-type" && (
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {questionCount === 0 ? "Ready to start?" : "Next question"}
          </h1>
          <p className="text-muted-foreground mb-8">Choose a question type.</p>
          <div className="grid grid-cols-2 gap-4">
            {(["behavioral", "technical"] as const).map((t) => (
              <button
                key={t}
                onClick={() => generateQuestion(t)}
                className="group p-6 rounded-xl border border-border bg-card text-left hover:border-foreground/30 hover:shadow-sm transition-all duration-150"
              >
                <p className="font-semibold mb-1">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t === "behavioral" ? "Tell me about a time…" : "Coding / problem-solving"}
                </p>
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-destructive mt-4">{error}</p>}
        </div>
      )}

      {/* ── Generating ── */}
      {phase === "generating" && (
        <div className="py-8">
          <p className="text-muted-foreground text-sm">Generating your question…</p>
        </div>
      )}

      {/* ── Answering ── */}
      {phase === "answering" && question && (
        <div className="space-y-6">
          <Badge variant="outline" className={cn(
            "text-xs font-semibold",
            question.type === "behavioral"
              ? "text-blue-600 border-blue-200 bg-blue-50"
              : "text-violet-600 border-violet-200 bg-violet-50"
          )}>
            {question.type}
          </Badge>

          <h2 className="text-xl font-semibold leading-relaxed">{question.prompt_text}</h2>

          <Separator />

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Your answer</label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here…"
              rows={7}
              className="resize-none text-base leading-relaxed"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={submitMainAnswer}
            disabled={!answer.trim() || isBusy}
            size="lg"
          >
            {isBusy ? "Analyzing…" : "Submit answer →"}
          </Button>
        </div>
      )}

      {/* ── Follow-up ── */}
      {phase === "follow-up" && question && followUpQuestion && (
        <div className="space-y-6">
          {/* Context */}
          <div className="space-y-1 opacity-40">
            <p className="text-sm font-medium">{question.prompt_text}</p>
            <p className="text-sm italic text-muted-foreground line-clamp-2">
              You: {answer}
            </p>
          </div>

          <Separator />

          <h2 className="text-xl font-semibold leading-relaxed">{followUpQuestion}</h2>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Your answer</label>
            <Textarea
              value={followUpAnswer}
              onChange={(e) => setFollowUpAnswer(e.target.value)}
              placeholder="Type your answer…"
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
        <div className="py-8">
          <p className="text-muted-foreground text-sm">Analyzing your answer…</p>
        </div>
      )}

      {/* ── Feedback ── */}
      {phase === "feedback" && (
        <div className="space-y-6">
          {error && !feedback && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          {feedback && (
            <>
              {/* Score + question */}
              <div className="flex items-start gap-4">
                <ScoreRing score={feedback.score} />
                <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                  {question?.prompt_text}
                </p>
              </div>

              <Separator />

              {/* Strengths */}
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
                    Strengths
                  </p>
                  <p className="text-sm leading-relaxed">{feedback.strengths_text}</p>
                </CardContent>
              </Card>

              {/* Gaps */}
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-red-700 mb-2">
                    To improve
                  </p>
                  <p className="text-sm leading-relaxed">{feedback.gaps_text}</p>
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex items-center gap-4 pt-2">
            <Button onClick={startNextQuestion} size="lg">
              Next question →
            </Button>
            <Link href="/start" className={buttonVariants({ variant: "ghost" })}>
              Finish session
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 7
      ? "bg-emerald-500"
      : score >= 5
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div
      className={cn(
        "w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0",
        color
      )}
    >
      {score}/10
    </div>
  );
}
