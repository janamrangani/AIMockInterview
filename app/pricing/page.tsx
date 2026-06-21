"use client";
// app/pricing/page.tsx
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Checkout button for Interview Pack ─────────────────────────────────────
function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: session.access_token }),
    });

    const json = await res.json();
    if (!res.ok || !json.url) {
      setError(json.error ?? "Couldn't start checkout. Try again.");
      setLoading(false);
      return;
    }

    window.location.href = json.url;
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={cn(
          buttonVariants({ size: "default" }),
          "w-full justify-center",
          loading && "opacity-70 cursor-not-allowed"
        )}
      >
        {loading ? "Redirecting…" : "Get the Pack →"}
      </button>
      {error && <p className="text-xs text-destructive mt-2 text-center">{error}</p>}
    </div>
  );
}

// ── Notify Me form for Unlimited waitlist ──────────────────────────────────
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
      <p className="text-sm text-center text-emerald-700 font-medium py-2.5">
        ✓ You're on the list — we'll email you when it launches.
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
        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className={cn(
          buttonVariants({ variant: "outline", size: "default" }),
          "w-full justify-center"
        )}
      >
        {state === "loading" ? "Saving…" : "Notify Me"}
      </button>
      {state === "error" && (
        <p className="text-xs text-destructive text-center">Something went wrong. Try again.</p>
      )}
    </form>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
const packFeatures = [
  "5 mock interview sessions (valid 30 days)",
  "All 4 companies — Amazon, Google, Meta, Microsoft",
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
  {
    q: "When does my Interview Pack expire?",
    a: "30 days from the date of purchase. Within that window you get 5 mock interview sessions and unlimited access to all Countdown Kit documents.",
  },
  {
    q: "What's the Countdown Kit?",
    a: "Seven AI-generated job-search documents personalised to your target company and role: a LinkedIn headline/About rewrite, a 'Tell me about yourself' script, custom questions to ask the interviewer, 3 STAR stories, a thank-you email, salary negotiation talking points, and a day-of logistics checklist.",
  },
  {
    q: "Is the $17 a subscription?",
    a: "No — it's a single one-time payment. No auto-renewal, no hidden charges.",
  },
  {
    q: "What's the Free plan?",
    a: "Two full mock interview sessions per calendar month, across all four companies, with scored feedback. No credit card required.",
  },
  {
    q: "Which companies are supported?",
    a: "Amazon, Google, Meta, and Microsoft. Questions and feedback are calibrated to each company's actual interview style.",
  },
  {
    q: "When is the Unlimited plan launching?",
    a: "We're working on it. Join the waitlist and we'll email you the moment it goes live.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white flex flex-col flex-1">
      {/* Header */}
      <section className="pt-20 pb-16 px-6 text-center bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 tracking-widest uppercase">
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4 max-w-xl mx-auto">
          Everything you need to{" "}
          <span className="text-indigo-600">walk in ready</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
          Start free. Or grab the Interview Pack and go all-in for your next interview.
        </p>
      </section>

      {/* Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 items-start">

          {/* Free */}
          <div className="rounded-2xl border border-border bg-white p-7 flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Free
              </p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-sm text-muted-foreground">forever</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Two sessions a month to try it out. No card needed.
              </p>
            </div>

            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
            >
              Start Free
            </Link>

            <ul className="space-y-2.5">
              {[
                "2 mock interview sessions per month",
                "Behavioral & technical questions",
                "All 4 companies",
                "Basic scored feedback",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
              {[
                "Full strengths + gaps feedback",
                "Adaptive follow-ups",
                "Interview Countdown Kit",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm opacity-35">
                  <span className="mt-0.5 flex-shrink-0">✗</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interview Pack — highlighted */}
          <div className="relative rounded-2xl border-2 border-indigo-500 bg-white p-7 flex flex-col gap-6 shadow-xl shadow-indigo-100">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
              Most Popular
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Interview Pack
              </p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-4xl font-bold">$17</span>
                <span className="text-sm text-muted-foreground">one-time</span>
              </div>
              <p className="text-xs text-indigo-600 font-medium mb-3">
                Got an interview coming up? Everything you need to walk in ready.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                5 sessions + the full Countdown Kit, valid for 30 days.
              </p>
            </div>

            <CheckoutButton />

            <ul className="space-y-2.5">
              {packFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Unlimited — coming soon */}
          <div className="rounded-2xl border border-border bg-white p-7 flex flex-col gap-6 opacity-70">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Unlimited
                </p>
                <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-sm text-muted-foreground">per month</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlimited sessions and everything in the Pack, month after month.
              </p>
            </div>

            <NotifyMeForm />

            <ul className="space-y-2.5">
              {[
                "Unlimited sessions",
                "Everything in Interview Pack",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="text-muted-foreground mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          No subscriptions. No auto-renewal. Pay once, use it when you need it.
        </p>
      </section>

      {/* What's in the Countdown Kit */}
      <section className="border-t border-border py-20 px-6 bg-muted/20">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center mb-3">
            Interview Countdown Kit
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-4">
            Seven documents. One interview.
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Each one is generated by AI and tailored to your target company and role.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "💼", title: "LinkedIn rewrite", desc: "Headline + About section optimised for your target role." },
              { icon: "🗣️", title: '"Tell me about yourself"', desc: "A polished, company-calibrated opening pitch." },
              { icon: "❓", title: "Questions to ask", desc: "Smart, role-specific questions that signal preparation." },
              { icon: "⭐", title: "3 STAR stories", desc: "Structured behavioral answers with real impact framing." },
              { icon: "📧", title: "Thank-you email", desc: "Send within 24h. Keeps you top of mind." },
              { icon: "💰", title: "Salary negotiation", desc: "Specific talking points and counter-offer language." },
              { icon: "📋", title: "Day-of checklist", desc: "Everything from tech setup to mindset — nothing forgotten." },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl bg-white border border-border p-5"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center mb-10">
            Questions
          </p>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-border pb-6 last:border-0">
                <p className="font-semibold mb-2">{faq.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center border-t border-border bg-gradient-to-b from-white to-indigo-50">
        <h2 className="text-3xl font-bold tracking-tight mb-3">
          Interview coming up?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The Interview Pack is $17 once. No subscription. Walk in prepared.
        </p>
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <CheckoutButton />
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Try free first
          </Link>
        </div>
      </section>
    </div>
  );
}
