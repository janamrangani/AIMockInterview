# AI Mock Interview — Scaffold

This is the starting skeleton for the AI mock interview product. It matches the architecture in `ai-mock-interview-product-spec.md`.

## What's here

- **`/app/api/generate-question`** — generates one behavioral or technical question, calibrated to the target company's style
- **`/app/api/follow-up`** — generates an adaptive follow-up based on the candidate's actual answer (max 2 rounds)
- **`/app/api/feedback`** — scores a full Q&A exchange against a rubric, returns strengths/gaps
- **`/app/api/generate-document`** — powers the "Interview Countdown Kit" (LinkedIn rewrite, STAR stories, thank-you emails, etc.) — one flexible route for all seven document types
- **`/lib/prompts.ts`** — **the actual product.** All prompt engineering lives here. Spend disproportionate time here.
- **`/lib/anthropic.ts`** — single wrapper for all Claude API calls
- **`/lib/supabase.ts`** — server-side Supabase client
- **`/supabase/schema.sql`** — full database schema + Row Level Security policies + 4 seed companies (Amazon, Google, Meta, Microsoft)

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create a Supabase project** at supabase.com, then run `supabase/schema.sql` in the SQL editor (Supabase dashboard > SQL Editor > paste and run).

3. **Get an Anthropic API key** at console.anthropic.com.

4. **Copy environment variables**
   ```
   cp .env.example .env.local
   ```
   Fill in the values from Supabase (Project Settings > API) and Anthropic.

5. **Run locally**
   ```
   npm run dev
   ```
   Visit http://localhost:3000

## What's NOT built yet (intentionally — build order from the spec)

- Auth (Clerk or Supabase Auth — not wired up yet)
- The actual session UI (company picker → question → answer → follow-up → feedback flow)
- Stripe checkout for the Interview Pack
- Session history page
- The Countdown Kit UI (the API route exists, the frontend doesn't yet)

## Before building the UI: test the prompts first

Before wiring anything into the frontend, test `/api/generate-question`, `/api/follow-up`, and `/api/feedback` directly (Postman, curl, or a simple test script) using your own real interview answers. This is the highest-leverage thing you can do before writing any more code — if the questions and feedback aren't good, no amount of UI polish fixes that.

Example test call once the server is running:
```bash
curl -X POST http://localhost:3000/api/generate-question \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","companyId":"<amazon-company-id-from-supabase>","role":"SWE Intern","type":"behavioral","previousQuestions":[]}'
```

## Next steps (in order)

1. Wire up Supabase Auth
2. Build the company/role selector page
3. Build the session flow UI (question → answer → follow-up loop → feedback display)
4. Add Stripe Checkout + webhook for the Interview Pack
5. Build session history page
6. Build the Countdown Kit UI
