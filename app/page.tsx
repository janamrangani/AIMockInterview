import Link from "next/link";
import {
  Target, Repeat2, BarChart3, Globe,
  Briefcase, Mic, HelpCircle, BookMarked, Mail, Banknote, ClipboardList,
  Check, X, CheckCircle2, XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────

const companies = [
  "Amazon", "Google", "Meta", "Microsoft", "Apple", "Netflix", "Uber", "Airbnb",
  "Stripe", "Salesforce", "Adobe", "Goldman Sachs", "JPMorgan", "McKinsey",
  "Deloitte", "IBM", "Oracle", "Spotify", "Twitter", "LinkedIn",
];

const steps = [
  { n: "01", title: "Pick your company and role",  desc: "Choose from 20 top companies. Tell us the role you're targeting." },
  { n: "02", title: "Answer a real question",       desc: "Behavioral or technical — calibrated to how that company actually interviews." },
  { n: "03", title: "Get follow-ups",               desc: "AI probes deeper when your answer needs more — up to 2 rounds, like a real interviewer." },
  { n: "04", title: "See your score and gaps",      desc: "Instant 1–10 score with strengths and exactly what to say next time." },
];

const features: { Icon: LucideIcon; label: string; desc: string }[] = [
  {
    Icon: Target,
    label: "Company-calibrated questions",
    desc: "Not generic LeetCode. Questions tuned to each company's real style — Leadership Principles for Amazon, Googleyness for Google.",
  },
  {
    Icon: Repeat2,
    label: "Adaptive follow-ups",
    desc: "When your answer is vague or missing specifics, the AI probes deeper — just like a real interviewer would.",
  },
  {
    Icon: BarChart3,
    label: "Scored, honest feedback",
    desc: "Every answer gets a 1–10 score with specific strengths and concrete gaps. No fluff. No generic praise.",
  },
  {
    Icon: Globe,
    label: "No download required",
    desc: "Runs in any browser. Open a tab, start your session, close it when you're done. Nothing to install.",
  },
];

const countdownKit: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Briefcase,     title: "LinkedIn rewrite",            desc: "Headline + About section optimised for your target role and company." },
  { Icon: Mic,           title: '"Tell me about yourself"',    desc: "A polished, company-calibrated opening pitch you can deliver cold." },
  { Icon: HelpCircle,    title: "Questions to ask",            desc: "Smart, role-specific questions that make you sound prepared." },
  { Icon: BookMarked,    title: "3 STAR stories",              desc: "Structured behavioral answers built from your own experience, impact-first." },
  { Icon: Mail,          title: "Thank-you email",             desc: "Send within 24h. Keeps you top of mind without sounding desperate." },
  { Icon: Banknote,      title: "Salary negotiation",          desc: "Specific talking points and counter-offer language for your level and company." },
  { Icon: ClipboardList, title: "Day-of checklist",            desc: "Everything from tech setup to mindset. Nothing forgotten on the day." },
];

const testimonials = [
  {
    quote: "I'd been grinding LeetCode for weeks. This was the first time I actually practised answering Amazon's questions the way they ask them. Got the offer.",
    name: "Priya S.",
    role: "SWE Intern — Amazon",
  },
  {
    quote: "The follow-up questions were brutal in the best way. My real interviewer asked almost the exact same one. I knew exactly what to say.",
    name: "Marcus T.",
    role: "APM candidate — Google",
  },
  {
    quote: "The Countdown Kit alone was worth it. My LinkedIn rewrite got three recruiter messages within a week. That's never happened before.",
    name: "Jamie L.",
    role: "New Grad SWE — Meta",
  },
];

const faqs = [
  {
    q: "Is the $17 a subscription?",
    a: "No. It's a single one-time payment. You get 5 sessions and all 7 Countdown Kit documents, valid for 30 days. No auto-renewal, no hidden charges.",
  },
  {
    q: "What's the difference between Free and the Interview Pack?",
    a: "Free gives you 2 mock interview sessions per calendar month with basic scored feedback. The Interview Pack ($17 one-time) gives you 5 sessions in 30 days, full strengths + gaps feedback, adaptive follow-ups, session history, and all 7 Countdown Kit documents.",
  },
  {
    q: "What exactly is in the Countdown Kit?",
    a: "Seven AI-generated documents: a LinkedIn headline/About rewrite, a 'Tell me about yourself' script, custom questions to ask the interviewer, 3 STAR stories, a thank-you email template, salary negotiation talking points, and a day-of logistics checklist.",
  },
  {
    q: "How are the questions calibrated to each company?",
    a: "Each company has a detailed interview style profile — Amazon's Leadership Principles, Google's Googleyness criteria, Meta's execution values, and more. The AI uses this to generate questions and evaluate your answers against the bar that company actually applies.",
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

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 pt-12 sm:pt-20 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-500 text-xs font-medium px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Interview Pack — $17 one-time · No subscription
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 text-foreground max-w-3xl">
            The unfair interview advantage.
          </h1>

          <p className="text-zinc-500 text-lg sm:text-xl max-w-xl leading-relaxed mb-10">
            Real questions calibrated to your target company, AI that follows up like a real interviewer, and honest feedback — so you walk in knowing exactly what to say.
          </p>

          <div className="flex items-center gap-3 flex-wrap mb-10 sm:mb-16">
            <Link
              href="/pricing"
              className="inline-flex items-center h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Get the Interview Pack — $17 →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center h-11 px-6 rounded-full border border-zinc-200 text-foreground text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Try free first
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: "20+",   label: "Companies supported" },
              { value: "< 30s", label: "To get a real question" },
              { value: "$17",   label: "One-time, no subscription" },
              { value: "7",     label: "Countdown Kit documents" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-zinc-500 mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────── */}
      <div className="border-y border-zinc-100 py-3.5 overflow-hidden bg-white">
        <div className="flex items-center gap-3 w-max animate-marquee">
          {[...companies, ...companies].map((c, i) => (
            <span key={i} className="text-xs text-zinc-400 font-medium whitespace-nowrap px-1">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="bg-zinc-50 px-6 py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 text-center mb-12">
            What candidates say
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white border border-zinc-100 p-6 flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-zinc-700 flex-1">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3 text-center">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">
            Four steps. Real prep.
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-10">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-5">
                <span className="text-4xl font-bold text-zinc-100 leading-none flex-shrink-0 select-none tabular-nums">{s.n}</span>
                <div className="pt-1">
                  <p className="font-semibold text-foreground mb-1.5">{s.title}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product preview ──────────────────────────────────────────── */}
      <section className="bg-zinc-50 px-6 py-20 border-b border-zinc-100">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3 text-center">
            See it in action
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-10">
            A full interview loop in your browser.
          </h2>

          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
            <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-zinc-200 text-zinc-500 text-xs font-medium px-2.5 py-0.5">
                  behavioral
                </span>
                <span className="text-xs text-zinc-400">Amazon · SWE Intern</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-5">
                <p className="text-sm font-semibold leading-relaxed text-foreground">
                  Tell me about a time you had to deliver a project under a tight deadline. How did you prioritize what mattered most?
                </p>
              </div>
              <div className="rounded-xl border border-zinc-100 p-4">
                <p className="text-xs text-zinc-400 mb-2">Your answer</p>
                <p className="text-sm text-zinc-600 italic leading-relaxed">
                  "In my last internship, I had three days to ship a feature before the release. I drew up a quick MoSCoW list, cut two edge cases, and shipped the core on time…"
                </p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <span className="text-xs font-medium text-amber-600 mb-2 inline-block">
                  Follow-up
                </span>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  What was the measurable outcome of shipping on time — and what would have happened if you'd missed it?
                </p>
              </div>
              <div className="flex items-start gap-4 pt-1">
                <div className="w-11 h-11 rounded-full bg-foreground ring-4 ring-zinc-100 flex items-center justify-center text-background font-bold text-xs flex-shrink-0">
                  8/10
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">Strengths</p>
                    <p className="text-sm text-zinc-500">Clear ownership, structured prioritization, shipped on time.</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-0.5">To improve</p>
                    <p className="text-sm text-zinc-500">Quantify the impact — what was the business outcome?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why not just use ─────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 text-center mb-3">
            Why not just use…
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-14 tracking-tight">
            Everything else leaves you guessing.
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
              <div className="flex items-center gap-3 mb-5">
                <XCircle className="w-4 h-4 text-zinc-400" />
                <p className="font-semibold text-sm text-foreground">Generic prep sites</p>
              </div>
              <ul className="space-y-3">
                {[
                  "Same questions for every company",
                  "No follow-ups, no dynamic pressure",
                  "No feedback on your actual answers",
                  "You don't know what a 7/10 looks like",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-500">
                    <X className="w-3.5 h-3.5 text-zinc-300 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
              <div className="flex items-center gap-3 mb-5">
                <XCircle className="w-4 h-4 text-zinc-400" />
                <p className="font-semibold text-sm text-foreground">Human mock interviews</p>
              </div>
              <ul className="space-y-3">
                {[
                  "$100–$200 per session",
                  "Hard to schedule, requires coordination",
                  "Feedback quality varies wildly",
                  "Not available at 11pm the night before",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-500">
                    <X className="w-3.5 h-3.5 text-zinc-300 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-foreground/20 bg-foreground p-6">
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <p className="font-semibold text-sm text-white">InterviewAI</p>
              </div>
              <ul className="space-y-3">
                {[
                  "Questions calibrated per company + role",
                  "Adaptive follow-ups that probe your gaps",
                  "Scored feedback with specific improvement points",
                  "Available now, in your browser, for $17",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/75">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="bg-zinc-50 px-6 py-20 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3 text-center">
            What you get
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12 tracking-tight">
            Built different from every prep tool you've tried.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map(({ Icon, label, desc }) => (
              <div key={label} className="rounded-2xl border border-zinc-100 bg-white p-6 hover:border-zinc-200 transition-colors">
                <Icon className="w-5 h-5 text-zinc-400 mb-4" />
                <p className="font-semibold text-foreground mb-2">{label}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Countdown Kit ────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3 text-center">
            Included in the Interview Pack
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-3">
            The Interview Countdown Kit
          </h2>
          <p className="text-zinc-500 text-center max-w-md mx-auto mb-12">
            Seven AI-generated documents tailored to your company and role. Each one written before you walk in, not after.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {countdownKit.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className={cn(
                  "rounded-2xl border border-zinc-100 bg-zinc-50 p-5 flex items-start gap-4",
                  i === 6 && "sm:col-span-2 lg:col-span-1"
                )}
              >
                <Icon className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">{title}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Get all 7 documents — $17 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section className="bg-zinc-50 px-6 py-20 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3 text-center">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-3">
            Start free. Go all-in for $17.
          </h2>
          <p className="text-zinc-500 text-center mb-12 max-w-md mx-auto">
            No subscription. No auto-renewal. One payment, 30 days, everything you need.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 flex flex-col">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-4">Free</p>
              <p className="text-3xl font-bold mb-1">$0</p>
              <p className="text-sm text-zinc-500 mb-6">2 sessions/month · No card needed</p>
              <ul className="space-y-2.5 text-sm text-zinc-500 flex-1 mb-6">
                {["2 mock sessions/month", "All 20 companies", "Scored feedback"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors">
                Start Free
              </Link>
            </div>

            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-medium px-3.5 py-1 rounded-full whitespace-nowrap border border-zinc-700">
                Most Popular
              </div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-4">Interview Pack</p>
              <p className="text-3xl font-bold text-white mb-1">$17</p>
              <p className="text-xs text-zinc-500 font-medium mb-1">One-time payment</p>
              <p className="text-sm text-zinc-500 mb-6">5 sessions · 30 days · all 7 Kit docs</p>
              <ul className="space-y-2.5 text-sm flex-1 mb-6">
                {["5 mock sessions (30 days)", "Full feedback + follow-ups", "All 7 Countdown Kit docs"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors">
                Get the Pack →
              </Link>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-white p-6 flex flex-col opacity-60">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">Unlimited</p>
                <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-medium">Soon</span>
              </div>
              <p className="text-3xl font-bold mb-1">$19</p>
              <p className="text-sm text-zinc-500 mb-6">Per month · Everything, forever</p>
              <ul className="space-y-2.5 text-sm text-zinc-500 flex-1 mb-6">
                {["Unlimited sessions", "Everything in Pack"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-zinc-200 text-sm font-medium">
                Join waitlist →
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500">
            <Link href="/pricing" className="underline underline-offset-2 font-medium text-foreground hover:text-zinc-600 transition-colors">
              See the full pricing breakdown →
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 border-b border-zinc-100">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3 text-center">
            Questions
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">
            Everything you need to know.
          </h2>
          <div className="space-y-0">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-zinc-100 last:border-0">
                <summary className="flex items-center justify-between py-5 cursor-pointer list-none gap-4">
                  <span className="font-medium text-sm sm:text-base">{faq.q}</span>
                  <span className="text-zinc-400 flex-shrink-0 text-xl leading-none transition-transform group-open:rotate-45 select-none">+</span>
                </summary>
                <div className="pb-5 -mt-1">
                  <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="bg-zinc-950 text-white px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-[1.05]">
            The offer is yours to take.
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Pick your company, answer a question, get real feedback. You'll know where you stand in under 2 minutes.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center h-11 px-6 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Get the Interview Pack — $17 →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center h-11 px-6 rounded-full border border-white/15 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Try free first
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
