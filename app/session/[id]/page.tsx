"use client";
// app/session/[id]/page.tsx
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

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

  // Question
  const [question, setQuestion] = useState<Question | null>(null);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(0);

  // Answers
  const [answer, setAnswer] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [exchange, setExchange] = useState(""); // running transcript for /api/feedback

  // Feedback
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Load session info
  useEffect(() => {
    const supabase = getSupabase();
    supabase
      .from("sessions")
      .select("company_id, role, companies(name)")
      .eq("id", sessionId)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError("Session not found.");
          setPhase("error");
          return;
        }
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

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function generateQuestion(type: "behavioral" | "technical") {
    if (!sessionInfo) return;
    setPhase("generating");
    setError(null);

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          companyId: sessionInfo.companyId,
          role: sessionInfo.role,
          type,
          previousQuestions,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to generate question.");

      setQuestion(json.question);
      setPreviousQuestions((prev) => [...prev, json.question.prompt_text]);
      setQuestionCount((c) => c + 1);
      setAnswer("");
      setFollowUpCount(0);
      setFollowUpQuestion(null);
      setFollowUpAnswer("");
      setExchange("");
      setPhase("answering");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("select-type");
    }
  }

  async function submitMainAnswer() {
    if (!question || !sessionInfo || !answer.trim()) return;
    setIsBusy(true);
    setError(null);

    const currentExchange = `Interviewer: ${question.prompt_text}\nCandidate: ${answer}`;

    try {
      const res = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          originalQuestion: question.prompt_text,
          userAnswer: answer,
          companyId: sessionInfo.companyId,
          followUpCount: 0,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to process answer.");

      if (json.followUp) {
        setExchange(currentExchange);
        setFollowUpQuestion(json.followUp);
        setFollowUpCount(1);
        setFollowUpAnswer("");
        setPhase("follow-up");
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
    setIsBusy(true);
    setError(null);

    const fullExchange = `${exchange}\nInterviewer: ${followUpQuestion}\nCandidate: ${followUpAnswer}`;

    try {
      const res = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          originalQuestion: question.prompt_text,
          userAnswer: followUpAnswer,
          companyId: sessionInfo.companyId,
          followUpCount: followUpCount,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to process answer.");

      if (json.followUp) {
        setExchange(fullExchange);
        setFollowUpQuestion(json.followUp);
        setFollowUpCount((c) => c + 1);
        setFollowUpAnswer("");
        // stay in follow-up phase, new question renders automatically
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
        body: JSON.stringify({
          sessionId,
          questionId: question.id,
          companyId: sessionInfo.companyId,
          type: question.type,
          question: question.prompt_text,
          answerExchange: exchangeText,
        }),
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
    setQuestion(null);
    setFeedback(null);
    setAnswer("");
    setFollowUpAnswer("");
    setFollowUpQuestion(null);
    setExchange("");
    setError(null);
    setPhase("select-type");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === "loading") {
    return <main style={S.main}><p style={{ color: "#888" }}>Loading…</p></main>;
  }

  if (phase === "error") {
    return (
      <main style={S.main}>
        <p style={{ color: "#dc2626" }}>{error}</p>
        <Link href="/start" style={{ color: "#111", fontSize: 14 }}>← Back to start</Link>
      </main>
    );
  }

  return (
    <main style={S.main}>
      {/* Session header */}
      <p style={S.header}>
        {sessionInfo?.companyName} · {sessionInfo?.role}
        {questionCount > 0 && ` · Q${questionCount}`}
      </p>

      {/* ── Pick question type ── */}
      {phase === "select-type" && (
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>
            {questionCount === 0 ? "Ready to start?" : "Next question"}
          </h1>
          <p style={{ color: "#888", margin: "0 0 28px", fontSize: 15 }}>
            Pick a question type.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {(["behavioral", "technical"] as const).map((t) => (
              <button key={t} onClick={() => generateQuestion(t)} style={S.typeButton}>
                <span style={{ display: "block", fontWeight: 600, fontSize: 15 }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
                <span style={{ display: "block", fontSize: 12, color: "#999", marginTop: 4 }}>
                  {t === "behavioral" ? "Tell me about a time…" : "Coding / problem-solving"}
                </span>
              </button>
            ))}
          </div>
          {error && <p style={S.errorText}>{error}</p>}
        </div>
      )}

      {/* ── Generating spinner ── */}
      {phase === "generating" && (
        <p style={{ color: "#888" }}>Generating your question…</p>
      )}

      {/* ── Main answer ── */}
      {phase === "answering" && question && (
        <div>
          <TypeBadge type={question.type} />
          <p style={S.questionText}>{question.prompt_text}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            rows={6}
            style={S.textarea}
          />
          {error && <p style={S.errorText}>{error}</p>}
          <PrimaryButton
            onClick={submitMainAnswer}
            disabled={!answer.trim() || isBusy}
            loading={isBusy}
            label="Submit answer →"
          />
        </div>
      )}

      {/* ── Follow-up ── */}
      {phase === "follow-up" && question && followUpQuestion && (
        <div>
          {/* Greyed-out context */}
          <p style={{ fontSize: 14, color: "#ccc", margin: "0 0 2px", lineHeight: 1.4 }}>
            {question.prompt_text}
          </p>
          <p style={{ fontSize: 13, color: "#ddd", fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.4 }}>
            You: {answer.length > 120 ? answer.slice(0, 120) + "…" : answer}
          </p>

          <p style={S.questionText}>{followUpQuestion}</p>
          <textarea
            value={followUpAnswer}
            onChange={(e) => setFollowUpAnswer(e.target.value)}
            placeholder="Type your answer…"
            rows={5}
            style={S.textarea}
          />
          {error && <p style={S.errorText}>{error}</p>}
          <PrimaryButton
            onClick={submitFollowUpAnswer}
            disabled={!followUpAnswer.trim() || isBusy}
            loading={isBusy}
            label="Submit answer →"
          />
        </div>
      )}

      {/* ── Feedback spinner ── */}
      {phase === "getting-feedback" && (
        <p style={{ color: "#888" }}>Analyzing your answer…</p>
      )}

      {/* ── Feedback display ── */}
      {phase === "feedback" && (
        <div>
          {error && !feedback && (
            <p style={S.errorText}>{error}</p>
          )}

          {feedback && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <ScoreBadge score={feedback.score} />
                <p style={{ fontSize: 15, color: "#555", margin: 0, lineHeight: 1.5 }}>
                  {question?.prompt_text}
                </p>
              </div>

              <div style={feedbackCard("#f0fdf4", "#bbf7d0")}>
                <p style={feedbackLabel("#16a34a")}>Strengths</p>
                <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{feedback.strengths_text}</p>
              </div>

              <div style={{ ...feedbackCard("#fff5f5", "#fca5a5"), marginTop: 12 }}>
                <p style={feedbackLabel("#dc2626")}>To improve</p>
                <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{feedback.gaps_text}</p>
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 28 }}>
            <PrimaryButton
              onClick={startNextQuestion}
              disabled={false}
              loading={false}
              label="Next question →"
            />
            <Link href="/start" style={{ fontSize: 14, color: "#888", textDecoration: "none" }}>
              Finish session
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

// ── Shared styles ────────────────────────────────────────────────────────────

const S = {
  main: {
    maxWidth: 640,
    margin: "60px auto",
    padding: "0 24px",
    fontFamily: "system-ui",
  } as React.CSSProperties,
  header: {
    fontSize: 13,
    color: "#aaa",
    margin: "0 0 32px",
  } as React.CSSProperties,
  questionText: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 1.5,
    margin: "12px 0 20px",
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 15,
    lineHeight: 1.6,
    fontFamily: "system-ui",
    resize: "vertical",
    boxSizing: "border-box",
    display: "block",
    marginBottom: 12,
  } as React.CSSProperties,
  typeButton: {
    flex: 1,
    padding: "16px 20px",
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "system-ui",
  } as React.CSSProperties,
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    margin: "0 0 12px",
  } as React.CSSProperties,
};

// ── Sub-components ────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: type === "behavioral" ? "#eff6ff" : "#f5f3ff",
        color: type === "behavioral" ? "#1d4ed8" : "#6d28d9",
      }}
    >
      {type}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 7 ? "#16a34a" : score >= 5 ? "#d97706" : "#dc2626";
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 16,
        flexShrink: 0,
      }}
    >
      {score}/10
    </div>
  );
}

function PrimaryButton({
  onClick,
  disabled,
  loading,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "11px 20px",
        background: "#111",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        fontFamily: "system-ui",
      }}
    >
      {loading ? "Analyzing…" : label}
    </button>
  );
}

function feedbackCard(bg: string, border: string): React.CSSProperties {
  return { padding: "16px", borderRadius: 8, border: `1px solid ${border}`, background: bg };
}

function feedbackLabel(color: string): React.CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 700,
    color,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 8px",
  };
}
