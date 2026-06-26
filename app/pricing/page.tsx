"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  Briefcase, Mic, HelpCircle, BookMarked, Mail, Banknote, ClipboardList,
  Check, X, type LucideIcon,
} from "lucide-react";

const kitDocs: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Briefcase,     title: "LinkedIn rewrite",            desc: "Headline + About section optimised for your target role." },
  { Icon: Mic,           title: '"Tell me about yourself"',    desc: "A polished, company-calibrated opening pitch." },
  { Icon: HelpCircle,    title: "Questions to ask",            desc: "Smart, role-specific questions that signal preparation." },
  { Icon: BookMarked,    title: "3 STAR stories",              desc: "Structured behavioral answers with real impact framing." },
  { Icon: Mail,          title: "Thank-you email",             desc: "Send within 24h. Keeps you top of mind." },
  { Icon: Banknote,      title: "Salary negotiation",          desc: "Specific talking points and counter-offer language." },
  { Icon: ClipboardList, title: "Day-of checklist",            desc: "Everything from tech setup to mindset — nothing forgotten." },
];

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = "/login"; return; }
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: session.access_token }),
    });
    const json = await res.json();
    if (!res.ok || !json.url) { setError(json.error ?? "Couldn't start checkout. Try again."); setLoading(false); return; }
    window.location.href = json.url;
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full h-10 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 disabled:opacity-60 transition-colors"
      >
        {loading ? "Redirecting…" : "Get the Pack →"}
      </button>
      {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
    </div>
  );
}

function NotifyMeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <p className="text-sm text-center text-emerald-600 font-medium py-2.5 flex items-center justify-center gap-1.5">
        <Check className="w-4 h-4" /> You're on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full h-10 rounded-lg border border-zinc-200 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60 transition-colors"
      >
        {state === "loading" ? "Saving…" : "Notify Me"}
      </button>
      {state === "error" && <p className="text-xs text-red-500 text-center">Something went wrong.</p>}
    </form>
  );
}

const packFeatures = [
  "5 mock interview sessions (valid 30 days)",
  "All 20 companies",
  "Behavioral & technical questions",
  "Full strengths + gaps feedback",
  "Adaptive follow-ups (up to 2 rounds)",
  "Session history",
  "LinkedIn headline & About rewrite",
  '"Tell me about yourself" script',
  "Custom questions to ask the interviewer",
  "3 tailored STAR stories",
  "Thank-you email template",
  "Salary negotiation talking points",
  "Day-of logistics checklist",
];

const faqs = [
  { q: "When does my Interview Pack expire?", a: "30 days from the date of purchase. Within that window you get 5 mock interview sessions and unlimited access to all Countdown Kit documents." },
  { q: "What's the Countdown Kit?", a: "Seven AI-generated job-search documents personalised to your target company and role: a LinkedIn headline/About rewrite, a 'Tell me about yourself' script, custom questions to ask the interviewer, 3 STAR stories, a thank-you email, salary negotiation talking points, and a day-of logistics checklist." },
  { q: "Is the $17 a subscription?", a: "No — it's a single one-time payment. No auto-renewal, no hidden charges." },
  { q: "What's the Free plan?", a: "Two full mock interview sessions per calendar month, across all companies, with scored feedback. No credit card required." },
  { q: "Which companies are supported?", a: "20 companies including Amazon, Google, Meta, Microsoft, Apple, Netflix, Stripe, OpenAI, and more. Questions and feedback are calibrated to each company's actual interview style." },
  { q: "When is the Unlimited plan launching?", a: "We're working on it. Join the waitlist and we'll email you the moment it goes live." },
];

export default function PricingPage() {
  return (
    <div className="bg-white flex flex-col flex-1">

      {/* Header */}
      <section className="pt-20 pb-16 px-6 text-center border-b border-zinc-100">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-6">
          Simple, transparent pricing
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4 max-w-xl mx-auto">
          Everything you need to walk in ready.
        </h1>
        <p className="text-zinc-500 text-lg max-w-md mx-auto leading-relaxed">
          Start free. Or grab the Interview Pack and go all-in for your next interview.
        </p>
      </section>

      {/* Cards */}
      <section className="px-6 py-20 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-5 items-start">

          {/* Free */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-7 flex flex-col gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">Free</p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-sm text-zinc-500">forever</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">Two sessions a month to try it out. No card needed.</p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-zinc-200 bg-white text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Start Free
            </Link>

            <ul className="space-y-2.5">
              {["2 mock interview sessions per month", "Behavioral & technical questions", "All 20 companies", "Basic scored feedback"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
              {["Full strengths + gaps feedback", "Adaptive follow-ups", "Interview Countdown Kit"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm opacity-40">
                  <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interview Pack */}
          <div className="relative rounded-2xl border border-zinc-900 bg-zinc-950 p-7 flex flex-col gap-6">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-medium px-4 py-1 rounded-full whitespace-nowrap border border-zinc-700">
              Most Popular
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">Interview Pack</p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-4xl font-bold text-white">$17</span>
                <span className="text-sm text-zinc-500">one-time</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium mb-3">Got an interview coming up? Everything you need.</p>
              <p className="text-sm text-zinc-500 leading-relaxed">5 sessions + the full Countdown Kit, valid for 30 days.</p>
            </div>

            <CheckoutButton />

            <ul className="space-y-2.5">
              {packFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Unlimited */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-7 flex flex-col gap-6 opacity-60">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">Unlimited</p>
                <span className="text-xs font-medium bg-zinc-200 text-zinc-500 px-2 py-0.5 rounded-full">Coming soon</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-sm text-zinc-500">per month</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">Unlimited sessions and everything in the Pack, month after month.</p>
            </div>

            <NotifyMeForm />

            <ul className="space-y-2.5">
              {["Unlimited sessions", "Everything in Interview Pack", "Priority support"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-500">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          No subscriptions. No auto-renewal. Pay once, use it when you need it.
        </p>
      </section>

      {/* What's in the Kit */}
      <section className="border-b border-zinc-100 py-20 px-6 bg-zinc-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 text-center mb-3">
            Interview Countdown Kit
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-center mb-3">
            Seven documents. One interview.
          </h2>
          <p className="text-zinc-500 text-center mb-10">
            Each one is generated by AI and tailored to your target company and role.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {kitDocs.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 rounded-xl bg-white border border-zinc-100 p-5">
                <Icon className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">{title}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white border-b border-zinc-100">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 text-center mb-10">
            Questions
          </p>
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

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-zinc-950">
        <h2 className="text-3xl font-bold tracking-tight mb-3 text-white">
          Interview coming up?
        </h2>
        <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
          The Interview Pack is $17 once. No subscription. Walk in prepared.
        </p>
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <CheckoutButton />
          <Link
            href="/login"
            className="inline-flex items-center h-10 px-6 rounded-full border border-white/15 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Try free first
          </Link>
        </div>
      </section>
    </div>
  );
}
