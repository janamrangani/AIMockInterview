// lib/prompts.ts
// This file is the actual product. Spend more time here than anywhere else in the codebase.
// Test every prompt against real answers (e.g. your own Amazon interview prep) before shipping changes.

type Company = {
  name: string;
  interview_style_notes: string;
};

/**
 * Generates ONE interview question (behavioral or technical), calibrated to the
 * target company's actual interview style and the candidate's role level.
 */
export function buildQuestionGenPrompt(
  company: Company,
  role: string,
  type: "behavioral" | "technical",
  previousQuestions: string[],
  resumeText?: string | null
): string {
  const resumeSection =
    type === "behavioral" && resumeText
      ? `\nCandidate's resume (use this to ask about their specific experiences, projects, or roles — don't ask generic questions when you can ask about something real from their background):\n${resumeText}\n`
      : "";

  return `You are an experienced technical interviewer at ${company.name}, conducting a real ${role} interview.

Company interview style: ${company.interview_style_notes}
${resumeSection}
Generate ONE ${type} interview question that matches how ${company.name} actually interviews candidates for this role level.

${previousQuestions.length > 0 ? `Avoid repeating the substance of these previously-asked questions:\n${previousQuestions.map((q) => `- ${q}`).join("\n")}` : ""}

Rules:
- Output ONLY the question text, nothing else (no preamble, no "Here's a question:")
- Make it specific and realistic, not generic
- Calibrate difficulty to a ${role} level — don't ask staff-level system design questions of an intern
- For behavioral questions: tie it to a real value/competency this company actually evaluates
- For technical questions: keep it solvable in a single interview round (don't ask something requiring 45+ minutes of coding)`;
}

/**
 * Generates an adaptive follow-up question based on the candidate's actual answer,
 * the way a real interviewer would probe for specificity.
 */
export function buildFollowUpPrompt(
  company: Company,
  originalQuestion: string,
  userAnswer: string,
  followUpCount: number
): string {
  return `You are an experienced interviewer at ${company.name}. You asked this question:

"${originalQuestion}"

The candidate answered:
"${userAnswer}"

This is follow-up round ${followUpCount + 1} (max 2 follow-ups allowed).

Decide if a follow-up is warranted. A real interviewer probes when the answer is vague, lacks specifics (no metrics, unclear ownership, missing outcome), or skips a part of the question. If the answer is already strong and complete, respond with exactly: NO_FOLLOWUP_NEEDED

Otherwise, output ONLY a single, natural follow-up question — short, direct, the way a real interviewer would ask it in the moment (e.g. "What was the actual impact, in numbers?" or "What would you do differently?"). No preamble.`;
}

/**
 * Generates structured, rubric-based feedback on the candidate's full answer
 * (including any follow-up exchanges).
 */
export function buildFeedbackPrompt(
  company: Company,
  type: "behavioral" | "technical",
  question: string,
  answerExchange: string // full back-and-forth, formatted as a transcript
): string {
  const rubric =
    type === "behavioral"
      ? `- Situation/Context clarity: did they set up the scenario clearly?
- Ownership: is it clear what THEY specifically did, not their team?
- Result/Impact: did they quantify the outcome or impact?
- Relevance: does this answer actually address what was asked, and does it reflect a competency ${company.name} cares about?`
      : `- Problem understanding: did they clarify requirements / edge cases before diving in?
- Approach: was the approach sound and reasonably efficient?
- Communication: did they explain their thinking clearly?
- Correctness: does the solution actually work for the stated problem?`;

  return `You are an experienced interviewer at ${company.name} giving structured, honest post-interview feedback.

Question: "${question}"

Full exchange (including any follow-ups):
${answerExchange}

Score this response from 1-10 based on this rubric:
${rubric}

Respond ONLY in this exact JSON format, no markdown fences, no other text:
{
  "score": <integer 1-10>,
  "strengths": "<1-2 specific, concrete sentences on what was strong>",
  "gaps": "<1-2 specific, actionable sentences on what to improve — be direct, not generic praise. Reference exact details from their answer.>"
}`;
}

/**
 * Interview Countdown Kit prompts — all reuse the same call pattern,
 * just different inputs/outputs. Kept in one place for easy maintenance.
 */
export function buildCountdownKitPrompt(
  type:
    | "linkedin_headline"
    | "star_story"
    | "interviewer_questions"
    | "thank_you_email"
    | "negotiation_points"
    | "logistics_checklist"
    | "tell_me_about_yourself",
  company: Company,
  role: string,
  userInput: string
): string {
  const prompts: Record<string, string> = {
    linkedin_headline: `Rewrite this LinkedIn headline and About section to position the candidate strongly for a ${role} role at ${company.name}. Keep their real experience — don't invent anything. Current content:\n\n${userInput}\n\nOutput the rewritten headline and About section only.`,

    star_story: `Take this rough work story and structure it into a clean STAR format (Situation, Task, Action, Result) suitable for a behavioral interview at ${company.name} for a ${role} role. Keep it concise — each section 1-3 sentences. Story:\n\n${userInput}`,

    interviewer_questions: `Generate 5 thoughtful questions this candidate could ask their interviewer at the end of a ${role} interview at ${company.name}. Make them specific to the company/role, not generic ("what's the culture like"). Candidate context:\n\n${userInput}`,

    thank_you_email: `Write a concise, genuine post-interview thank-you email for a ${role} candidate at ${company.name}. Reference specific details from the interview below. Keep it under 150 words.\n\nInterview details:\n${userInput}`,

    negotiation_points: `Generate 4-5 talking points for negotiating a ${role} offer at ${company.name}, based on this context. Be realistic and tactical, not generic advice.\n\nContext:\n${userInput}`,

    logistics_checklist: `Generate a short day-of checklist for a ${role} interview at ${company.name} — what to expect, general dress norms, what to bring/prepare. Keep it practical and brief.`,

    tell_me_about_yourself: `Write a 60-90 second "tell me about yourself" script for a ${role} candidate interviewing at ${company.name}, based on this background. Keep it natural, not robotic — something they could actually say out loud.\n\nBackground:\n${userInput}`,
  };

  return prompts[type];
}
