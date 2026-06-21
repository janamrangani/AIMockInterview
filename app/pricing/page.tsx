// app/pricing/page.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get a feel for real interview questions with no commitment.",
    cta: "Start for free",
    ctaHref: "/login",
    variant: "outline" as const,
    highlight: false,
    features: [
      "5 questions per day",
      "Behavioral & technical questions",
      "Amazon & Google only",
      "Basic scored feedback",
      "1 follow-up per answer",
    ],
    missing: [
      "All 4 companies",
      "Detailed gap analysis",
      "Countdown Kit documents",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "Unlimited practice across all companies with full feedback.",
    cta: "Start Pro →",
    ctaHref: "/login",
    variant: "default" as const,
    highlight: true,
    badge: "Most popular",
    features: [
      "Unlimited questions",
      "All 4 companies (Amazon, Google, Meta, Microsoft)",
      "Behavioral & technical questions",
      "Full strengths + gaps feedback",
      "Adaptive follow-ups (up to 2 rounds)",
      "Session history",
    ],
    missing: ["Countdown Kit documents"],
  },
  {
    name: "Interview Pack",
    price: "$49",
    period: "one-time",
    description: "Everything in Pro plus the full Countdown Kit for your target role.",
    cta: "Get the Pack →",
    ctaHref: "/login",
    variant: "outline" as const,
    highlight: false,
    badge: "Best value",
    features: [
      "Everything in Pro",
      "LinkedIn headline & summary rewrite",
      "3 tailored STAR stories",
      "Company research brief",
      "Salary negotiation script",
      "Thank-you email template",
      "30-day access",
    ],
    missing: [],
  },
];

const faqs = [
  {
    q: "What counts as a question?",
    a: "Each generated question (behavioral or technical) counts as one question. Follow-up prompts within the same question don't count separately.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes — cancel anytime from your account settings. You keep access until the end of your billing period.",
  },
  {
    q: "What's included in the Countdown Kit?",
    a: "The Countdown Kit generates 7 job-search documents personalized to your target company and role: a LinkedIn rewrite, STAR stories, company research brief, technical prep guide, salary negotiation script, thank-you email, and a 30-day prep plan.",
  },
  {
    q: "Is the Interview Pack a subscription?",
    a: "No — it's a single one-time payment that gives you 30 days of Pro access plus all Countdown Kit documents.",
  },
  {
    q: "Which companies are supported?",
    a: "Amazon, Google, Meta, and Microsoft. Questions and feedback are calibrated to each company's actual interview style — Leadership Principles for Amazon, Googleyness for Google, and so on.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-6 text-center bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4 max-w-2xl mx-auto">
          Invest in the offer,{" "}
          <span className="text-indigo-600">not the prep tool</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
          Start free. Upgrade when you want unlimited practice and the full toolkit.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl border p-7 flex flex-col",
                  plan.highlight
                    ? "border-indigo-500 shadow-xl shadow-indigo-100 bg-white"
                    : "border-border bg-white"
                )}
              >
                {plan.badge && (
                  <div
                    className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap",
                      plan.highlight
                        ? "bg-indigo-600 text-white"
                        : "bg-foreground text-background"
                    )}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={cn(
                    buttonVariants({ variant: plan.variant, size: "default" }),
                    "w-full justify-center mb-7"
                  )}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm opacity-40">
                      <span className="font-bold mt-0.5 flex-shrink-0">✗</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include email support. No credit card required for Free.
          </p>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="border-t border-border py-20 px-6 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center mb-10">
            What you get
          </p>
          <div className="rounded-2xl border border-border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 font-semibold text-sm text-muted-foreground w-1/2">Feature</th>
                  <th className="px-4 py-4 font-semibold text-center text-sm">Free</th>
                  <th className="px-4 py-4 font-semibold text-center text-sm text-indigo-600">Pro</th>
                  <th className="px-4 py-4 font-semibold text-center text-sm">Pack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Questions per day", "5", "Unlimited", "Unlimited"],
                  ["Companies", "2", "4", "4"],
                  ["Scored feedback", "✓", "✓", "✓"],
                  ["Adaptive follow-ups", "1 round", "2 rounds", "2 rounds"],
                  ["Detailed gap analysis", "—", "✓", "✓"],
                  ["Session history", "—", "✓", "✓"],
                  ["Countdown Kit", "—", "—", "✓"],
                  ["LinkedIn rewrite", "—", "—", "✓"],
                  ["STAR stories", "—", "—", "✓"],
                  ["Salary negotiation script", "—", "—", "✓"],
                ].map(([feature, free, pro, pack]) => (
                  <tr key={feature} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3.5 text-muted-foreground">{feature}</td>
                    <td className="px-4 py-3.5 text-center text-muted-foreground">{free}</td>
                    <td className="px-4 py-3.5 text-center font-medium text-foreground">{pro}</td>
                    <td className="px-4 py-3.5 text-center text-muted-foreground">{pack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center mb-10">
            Frequently asked
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
          Ready to walk in confident?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Start free today — no credit card, no commitment. Upgrade when you're ready.
        </p>
        <div className="flex items-center gap-4 justify-center flex-wrap">
          <Link href="/login" className={buttonVariants({ size: "lg" })}>
            Start for free →
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            View Pro
          </Link>
        </div>
      </section>
    </div>
  );
}
