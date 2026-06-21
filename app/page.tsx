import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────

const stats = [
  { value: "4", label: "Top companies supported" },
  { value: "< 30s", label: "To get a real question" },
  { value: "$17", label: "One-time, no subscription" },
  { value: "7", label: "Countdown Kit documents" },
];

const companies = ["Amazon", "Google", "Meta", "Microsoft"];

const steps = [
  { step: "01", title: "Pick your company and role", desc: "Choose Amazon, Google, Meta, or Microsoft. Tell us the role you're targeting." },
  { step: "02", title: "Answer a real question", desc: "Behavioral or technical — calibrated to how that company actually interviews." },
  { step: "03", title: "Get follow-ups", desc: "AI probes deeper when your answer needs more — up to 2 rounds, like a real interviewer." },
  { step: "04", title: "See your score and gaps", desc: "Instant 1–10 score with strengths and exactly what to say next time." },
];

const features = [
  {
    icon: "🎯",
    label: "Company-calibrated questions",
    desc: "Not generic LeetCode. Questions tuned to each company's real style — Leadership Principles for Amazon, Googleyness for Google.",
  },
  {
    icon: "🔁",
    label: "Adaptive follow-ups",
    desc: "When your answer is vague or missing specifics, the AI probes deeper — just like a real interviewer would.",
  },
  {
    icon: "📊",
    label: "Scored, honest feedback",
    desc: "Every answer gets a 1–10 score with specific strengths and concrete gaps. No fluff. No generic praise.",
  },
  {
    icon: "🌐",
    label: "No download required",
    desc: "Runs in any browser. Open a tab, start your session, close it when you're done. Nothing to install.",
  },
];

const countdownKit = [
  { icon: "💼", title: "LinkedIn rewrite", desc: "Headline + About section optimised for your target role and company." },
  { icon: "🗣️", title: '"Tell me about yourself"', desc: "A polished, company-calibrated opening pitch you can deliver cold." },
  { icon: "❓", title: "Questions to ask", desc: "Smart, role-specific questions that make you sound prepared — because you are." },
  { icon: "⭐", title: "3 STAR stories", desc: "Structured behavioral answers built from your own experience, impact-first." },
  { icon: "📧", title: "Thank-you email", desc: "Send within 24h. Keeps you top of mind without sounding desperate." },
  { icon: "💰", title: "Salary negotiation", desc: "Specific talking points and counter-offer language for your level and company." },
  { icon: "📋", title: "Day-of checklist", desc: "Everything from tech setup to mindset. Nothing forgotten on the day." },
];

const testimonials = [
  {
    quote: "I'd been grinding LeetCode for weeks. This was the first time I actually practised answering Amazon's questions the way they ask them. Got the offer.",
    name: "Priya S.",
    role: "SWE Intern offer — Amazon",
  },
  {
    quote: "The follow-up questions were brutal in the best way. My real interviewer asked almost the exact same one. I knew exactly what to say because I'd already done it.",
    name: "Marcus T.",
    role: "APM candidate — Google",
  },
  {
    quote: "The Countdown Kit alone was worth it. My LinkedIn rewrite got three recruiter messages within a week. That's never happened before.",
    name: "Jamie L.",
    role: "New Grad SWE candidate — Meta",
  },
];

const faqs = [
  {
    q: "Is the $17 a subscription?",
    a: "No. It's a single one-time payment. You get 5 sessions and all 7 Countdown Kit documents, valid for 30 days. No auto-renewal, no hidden charges.",
  },
  {
    q: "What's the difference between Free and the Interview Pack?",
    a: "Free gives you 2 mock interview sessions per calendar month with basic scored feedback — enough to try it out. The Interview Pack ($17 one-time) gives you 5 sessions in 30 days, full strengths + gaps feedback, adaptive follow-ups, session history, and all 7 Countdown Kit documents.",
  },
  {
    q: "What exactly is in the Countdown Kit?",
    a: "Seven AI-generated documents tailored to your target company and role: a LinkedIn headline/About rewrite, a 'Tell me about yourself' script, custom questions to ask the interviewer, 3 STAR stories, a thank-you email template, salary negotiation talking points, and a day-of logistics checklist.",
  },
  {
    q: "How are the questions calibrated to each company?",
    a: "Each company has a detailed interview style profile — Amazon's Leadership Principles, Google's Googleyness criteria, Meta's execution values, Microsoft's growth mindset culture. The AI uses this context to generate questions and evaluate your answers against the bar that company actually applies.",
  },
  {
    q: "What if I don't have an interview scheduled yet?",
    a: "The free plan is perfect for that. Use 2 sessions a month to stay sharp, and grab the Interview Pack when you have something lined up.",
  },
  {
    q: "Do I need to download anything?",
    a: "No. InterviewAI runs entirely in your browser. Open a tab, start your session, done.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="flex flex-col flex-1">

      {/* ── Hero (dark) ─────────────────────────────────────────────── */}
      <section className="relative bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute top-20 right-[-100px] w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Interview Pack — $17 one-time · No subscription
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] max-w-3xl mb-6">
            The unfair{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
              interview advantage
            </span>
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl max-w-xl leading-relaxed mb-10">
            Real questions calibrated to your target company, AI that follows up
            like a real interviewer, and honest feedback — so you walk in knowing
            exactly what to say.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center mb-14">
            <Link
              href="/pricing"
              className={cn(buttonVariants({ size: "lg" }), "shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow")}
            >
              Get the Interview Pack — $17 →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center h-11 px-6 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
            >
              Try free first
            </Link>
          </div>

          {/* Stats strip */}
          <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
            {stats.map((s) => (
              <div key={s.label} className="bg-zinc-950 px-5 py-5 text-center">
                <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-xs text-zinc-500 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company strip */}
        <div className="relative border-t border-white/[0.06] px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-600 mr-2">Calibrated for</span>
            {companies.map((c) => (
              <span key={c} className="text-xs font-semibold text-zinc-400 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ─────────────────────────────────────────────── */}
      <section className="bg-white border-b border-border px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center mb-12">
            What candidates say
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-white p-6 flex flex-col gap-5">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground flex-1">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Competitive positioning ──────────────────────────────────── */}
      <section className="bg-zinc-950 text-white px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 text-center mb-3">
            Why not just use…
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-14 tracking-tight">
            Everything else leaves you guessing
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* LeetCode / generic */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-base">❌</span>
                <p className="font-semibold text-white text-sm">Generic prep sites</p>
              </div>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  Same questions for every company
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  No follow-ups, no dynamic pressure
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  No feedback on your actual answers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  You don't know what a 7/10 answer looks like
                </li>
              </ul>
            </div>

            {/* Human mock interviews */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-base">❌</span>
                <p className="font-semibold text-white text-sm">Human mock interviews</p>
              </div>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  $100–$200 per session
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  Hard to schedule, requires coordination
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  Feedback quality varies wildly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  Not available at 11pm the night before
                </li>
              </ul>
            </div>

            {/* InterviewAI */}
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.05] p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-base">✅</span>
                <p className="font-semibold text-white text-sm">InterviewAI</p>
              </div>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  Questions calibrated per company + role
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  Adaptive follow-ups that probe your gaps
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  Scored feedback with specific improvement points
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  Available now, in your browser, for $17
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product preview ─────────────────────────────────────────── */}
      <section className="bg-zinc-900 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 text-center">
            See it in action
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10 tracking-tight">
            A full interview loop in your browser
          </h2>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl shadow-black/40">
            <div className="border-b border-white/[0.07] bg-white/[0.03] px-5 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5">
                  behavioral
                </span>
                <span className="text-xs text-zinc-500">Amazon · SWE Intern</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.07] p-5">
                <p className="text-sm font-semibold leading-relaxed text-white">
                  Tell me about a time you had to deliver a project under a tight deadline. How did you prioritize what mattered most?
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500 mb-2">Your answer</p>
                <p className="text-sm text-zinc-300 italic leading-relaxed">
                  "In my last internship, I had three days to ship a feature before the release. I drew up a quick MoSCoW list, cut two edge cases, and shipped the core on time…"
                </p>
              </div>
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold bg-amber-400/15 text-amber-300 px-2 py-0.5 rounded-full">Follow-up</span>
                </div>
                <p className="text-sm font-medium text-white leading-relaxed">
                  What was the measurable outcome of shipping on time — and what would have happened if you'd missed it?
                </p>
              </div>
              <div className="flex items-start gap-4 pt-1">
                <div className="w-12 h-12 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  8/10
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-0.5">Strengths</p>
                    <p className="text-sm text-zinc-400">Clear ownership, structured prioritization, shipped on time.</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-0.5">To improve</p>
                    <p className="text-sm text-zinc-400">Quantify the impact — what was the business outcome?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 text-center">
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-14">
            Four steps. Real prep.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="rounded-2xl border border-border bg-white p-6 flex gap-5">
                <span className="text-3xl font-bold text-indigo-100 leading-none flex-shrink-0 select-none">{s.step}</span>
                <div>
                  <p className="font-semibold mb-1.5">{s.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="bg-zinc-950 text-white px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 text-center">
            What you get
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12 tracking-tight">
            Built different from every prep tool you've tried
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 hover:bg-white/[0.05] transition-colors">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl mb-4">
                  {f.icon}
                </div>
                <p className="font-semibold mb-2 text-white">{f.label}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Countdown Kit showcase ───────────────────────────────────── */}
      <section className="bg-white px-6 py-20 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 text-center">
            Included in the Interview Pack
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-3">
            The Interview Countdown Kit
          </h2>
          <p className="text-muted-foreground text-center max-w-md mx-auto mb-12">
            Seven AI-generated documents tailored to your company and role.
            Each one written before you walk in, not after.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {countdownKit.map((doc, i) => (
              <div
                key={doc.title}
                className={cn(
                  "rounded-2xl border border-border bg-white p-5 flex items-start gap-4",
                  // 7th card — span full on mobile, centered on lg
                  i === 6 && "sm:col-span-2 lg:col-span-1"
                )}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{doc.icon}</span>
                <div>
                  <p className="font-semibold text-sm mb-1">{doc.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/pricing"
              className={cn(buttonVariants({ size: "lg" }), "shadow-md shadow-indigo-100")}
            >
              Get all 7 documents — $17 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ──────────────────────────────────────────── */}
      <section className="bg-muted/30 px-6 py-20 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 text-center">
            Pricing
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-4">
            Start free. Go all-in for $17.
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto">
            No subscription. No auto-renewal. One payment, 30 days, everything you need.
          </p>

          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {/* Free */}
            <div className="rounded-2xl border border-border bg-white p-6 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Free</p>
              <p className="text-3xl font-bold mb-1">$0</p>
              <p className="text-sm text-muted-foreground mb-6">2 sessions/month · No card needed</p>
              <ul className="space-y-2 text-sm text-muted-foreground flex-1 mb-6">
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span>2 mock sessions/month</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span>All 4 companies</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span>Scored feedback</li>
              </ul>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}>
                Start Free
              </Link>
            </div>

            {/* Interview Pack */}
            <div className="rounded-2xl border-2 border-indigo-500 bg-white p-6 flex flex-col relative shadow-xl shadow-indigo-100">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3.5 py-1 rounded-full whitespace-nowrap">
                Most Popular
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Interview Pack</p>
              <p className="text-3xl font-bold mb-1">$17</p>
              <p className="text-xs text-indigo-600 font-semibold mb-1">One-time payment</p>
              <p className="text-sm text-muted-foreground mb-6">5 sessions · 30 days · all 7 Kit docs</p>
              <ul className="space-y-2 text-sm flex-1 mb-6">
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span>5 mock sessions (30 days)</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span>Full feedback + follow-ups</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span>All 7 Countdown Kit docs</li>
              </ul>
              <Link href="/pricing" className={cn(buttonVariants(), "w-full justify-center shadow-md shadow-indigo-200")}>
                Get the Pack →
              </Link>
            </div>

            {/* Unlimited */}
            <div className="rounded-2xl border border-border bg-white p-6 flex flex-col opacity-60">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Unlimited</p>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">Soon</span>
              </div>
              <p className="text-3xl font-bold mb-1">$19</p>
              <p className="text-sm text-muted-foreground mb-6">Per month · Everything, forever</p>
              <ul className="space-y-2 text-sm text-muted-foreground flex-1 mb-6">
                <li className="flex gap-2"><span className="font-bold">✓</span>Unlimited sessions</li>
                <li className="flex gap-2"><span className="font-bold">✓</span>Everything in Pack</li>
              </ul>
              <Link href="/pricing" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}>
                Join waitlist →
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/pricing" className="underline underline-offset-2 font-medium text-foreground hover:text-indigo-600 transition-colors">
              See the full pricing breakdown →
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 text-center">
            Questions
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-12">
            Everything you need to know
          </h2>
          <div className="space-y-1">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group border-b border-border last:border-0"
              >
                <summary className="flex items-center justify-between py-5 cursor-pointer list-none gap-4">
                  <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
                  <span className="text-muted-foreground flex-shrink-0 text-lg leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-5 -mt-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA (dark) ────────────────────────────────────────── */}
      <section className="relative bg-zinc-950 text-white px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-indigo-600/15 blur-[100px]" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            The offer is yours to take.
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
            Pick your company, answer a question, get real feedback. You'll know where you stand in under 2 minutes.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/pricing"
              className={cn(buttonVariants({ size: "lg" }), "shadow-lg shadow-indigo-500/30")}
            >
              Get the Interview Pack — $17 →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center h-11 px-6 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
            >
              Try free first
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
