import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────

const stats = [
  { value: "4", label: "Top companies supported" },
  { value: "2 min", label: "To get real feedback" },
  { value: "$17", label: "One-time, no subscription" },
  { value: "1–10", label: "Scored every answer" },
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
    icon: "📂",
    label: "Interview Countdown Kit",
    desc: "LinkedIn rewrite, STAR stories, salary negotiation script, thank-you email — seven documents tailored to your role.",
  },
];

const companies = ["Amazon", "Google", "Meta", "Microsoft"];

const steps = [
  { step: "01", title: "Pick your company and role", desc: "Choose Amazon, Google, Meta, or Microsoft. Tell us the role you're targeting." },
  { step: "02", title: "Answer a real question", desc: "Behavioral or technical — calibrated to how that company actually interviews." },
  { step: "03", title: "Get follow-ups", desc: "AI probes deeper when your answer needs more — up to 2 rounds, like a real interviewer." },
  { step: "04", title: "See your score and gaps", desc: "Instant 1–10 score with strengths and exactly what to say next time." },
];

// ── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="flex flex-col flex-1">

      {/* ── Hero (dark) ─────────────────────────────────────────────── */}
      <section className="relative bg-zinc-950 text-white overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute top-20 right-[-100px] w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Interview Pack — $17 one-time · No subscription
          </div>

          {/* Headline */}
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

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap justify-center mb-14">
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ size: "lg" }),
                "shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
              )}
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
            <span className="text-xs text-zinc-600 mr-2">Prep for</span>
            {companies.map((c) => (
              <span
                key={c}
                className="text-xs font-semibold text-zinc-400 border border-white/10 bg-white/5 px-3 py-1 rounded-full"
              >
                {c}
              </span>
            ))}
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

          {/* Browser chrome card */}
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
              {/* Question */}
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.07] p-5">
                <p className="text-sm font-semibold leading-relaxed text-white">
                  Tell me about a time you had to deliver a project under a tight deadline.
                  How did you prioritize what mattered most?
                </p>
              </div>

              {/* Answer */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500 mb-2">Your answer</p>
                <p className="text-sm text-zinc-300 italic leading-relaxed">
                  "In my last internship, I had three days to ship a feature before the release.
                  I drew up a quick MoSCoW list, cut two edge cases, and shipped the core on time…"
                </p>
              </div>

              {/* Follow-up */}
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold bg-amber-400/15 text-amber-300 px-2 py-0.5 rounded-full">
                    Follow-up
                  </span>
                </div>
                <p className="text-sm font-medium text-white leading-relaxed">
                  What was the measurable outcome of shipping on time — and what would have happened if you'd missed it?
                </p>
              </div>

              {/* Score */}
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
              <div
                key={s.step}
                className="rounded-2xl border border-border bg-white p-6 flex gap-5"
              >
                <span className="text-3xl font-bold text-indigo-100 leading-none flex-shrink-0 select-none">
                  {s.step}
                </span>
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
            Built different from every prep app you've tried
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 hover:bg-white/[0.05] transition-colors"
              >
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

      {/* ── Pricing teaser ──────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
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
            <div className="rounded-2xl border border-border p-6 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Free</p>
              <p className="text-3xl font-bold mb-1">$0</p>
              <p className="text-sm text-muted-foreground mb-6">2 sessions/month · No card needed</p>
              <ul className="space-y-2 text-sm text-muted-foreground flex-1 mb-6">
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> 2 mock sessions/month</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> All 4 companies</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Scored feedback</li>
              </ul>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}>
                Start Free
              </Link>
            </div>

            {/* Interview Pack */}
            <div className="rounded-2xl border-2 border-indigo-500 p-6 flex flex-col relative shadow-xl shadow-indigo-100">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3.5 py-1 rounded-full whitespace-nowrap">
                Most Popular
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Interview Pack</p>
              <p className="text-3xl font-bold mb-1">$17</p>
              <p className="text-xs text-indigo-600 font-semibold mb-1">One-time payment</p>
              <p className="text-sm text-muted-foreground mb-6">5 sessions · 30 days · Countdown Kit included</p>
              <ul className="space-y-2 text-sm flex-1 mb-6">
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> 5 mock sessions (30 days)</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Full feedback + follow-ups</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> LinkedIn rewrite</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> STAR stories + negotiation script</li>
                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> All 7 Countdown Kit docs</li>
              </ul>
              <Link href="/pricing" className={cn(buttonVariants(), "w-full justify-center shadow-md shadow-indigo-200")}>
                Get the Pack →
              </Link>
            </div>

            {/* Unlimited */}
            <div className="rounded-2xl border border-border p-6 flex flex-col opacity-60">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Unlimited</p>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">Coming soon</span>
              </div>
              <p className="text-3xl font-bold mb-1">$19</p>
              <p className="text-sm text-muted-foreground mb-6">Per month · Everything, forever</p>
              <ul className="space-y-2 text-sm text-muted-foreground flex-1 mb-6">
                <li className="flex gap-2"><span className="font-bold">✓</span> Unlimited sessions</li>
                <li className="flex gap-2"><span className="font-bold">✓</span> Everything in Pack</li>
                <li className="flex gap-2"><span className="font-bold">✓</span> Priority support</li>
              </ul>
              <Link href="/pricing" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}>
                Join waitlist →
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Confused?{" "}
            <Link href="/pricing" className="underline underline-offset-2 font-medium text-foreground hover:text-indigo-600 transition-colors">
              See the full pricing page →
            </Link>
          </p>
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
              className={cn(
                buttonVariants({ size: "lg" }),
                "shadow-lg shadow-indigo-500/30"
              )}
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
