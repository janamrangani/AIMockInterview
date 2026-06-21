import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const companies = [
  { name: "Amazon", logo: "A" },
  { name: "Google", logo: "G" },
  { name: "Meta", logo: "M" },
  { name: "Microsoft", logo: "Ms" },
];

const features = [
  {
    icon: "🎯",
    label: "Company-calibrated questions",
    desc: "Questions tuned to each company's real interview style — Leadership Principles for Amazon, Googleyness for Google.",
  },
  {
    icon: "🔁",
    label: "Adaptive follow-ups",
    desc: "When your answer is vague or missing specifics, the AI probes deeper — just like a real interviewer would.",
  },
  {
    icon: "📊",
    label: "Scored, actionable feedback",
    desc: "Every answer gets a 1–10 score with specific strengths and concrete gaps. No generic praise.",
  },
];

const stats = [
  { value: "4", label: "Top companies" },
  { value: "1–10", label: "Scored answers" },
  { value: "2", label: "Follow-up rounds" },
  { value: "Free", label: "To get started" },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 tracking-widest uppercase">
          AI-powered · Free to start
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] max-w-2xl mb-6">
          Practice interviews that{" "}
          <span className="text-indigo-600">actually prepare you</span>
        </h1>

        <p className="text-muted-foreground text-lg sm:text-xl max-w-lg leading-relaxed mb-10">
          Real questions calibrated to your target company, adaptive AI
          follow-ups, and honest feedback — so you walk in confident.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center mb-12">
          <Link href="/login" className={buttonVariants({ size: "lg" })}>
            Start practising free →
          </Link>
          <Link
            href="/pricing"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            See pricing
          </Link>
        </div>

        {/* Company logos row */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-xs text-muted-foreground mr-1">Prep for</span>
          {companies.map((c) => (
            <div
              key={c.name}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground bg-white border border-border rounded-full px-3 py-1 shadow-sm"
            >
              <span className="font-bold text-indigo-600">{c.logo}</span>
              {c.name}
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className="bg-foreground text-background px-6 py-10">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold mb-1">{s.value}</p>
              <p className="text-sm text-background/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample preview ───────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 text-center">
            What it looks like
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">
            An interview in your browser
          </h2>

          <div className="rounded-2xl border border-border bg-white shadow-lg shadow-black/5 overflow-hidden">
            {/* Window chrome */}
            <div className="bg-muted/50 border-b border-border px-5 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center gap-2 ml-1">
                <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5">
                  behavioral
                </span>
                <span className="text-xs text-muted-foreground">Amazon · SWE Intern</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Question */}
              <div className="rounded-xl border-2 border-indigo-100 bg-indigo-50/60 p-5">
                <p className="text-sm font-semibold leading-relaxed text-foreground">
                  Tell me about a time you had to deliver a project under a tight
                  deadline. How did you prioritize what mattered most?
                </p>
              </div>

              {/* Candidate answer */}
              <div className="rounded-xl bg-muted/50 border border-border p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Your answer</p>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "In my last internship, I had three days to ship a feature before the release. I
                  drew up a quick MoSCoW list with my mentor, cut two edge cases, and shipped the core flow on time…"
                </p>
              </div>

              {/* Follow-up */}
              <div className="rounded-xl border-2 border-amber-100 bg-amber-50/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    Follow-up
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  What was the measurable outcome of shipping on time — and what would have happened if you'd missed the deadline?
                </p>
              </div>

              {/* Feedback row */}
              <div className="flex items-start gap-4 pt-1">
                <div className="w-12 h-12 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  8/10
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-0.5">
                      Strengths
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Clear ownership, structured prioritization, shipped on time.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-0.5">
                      To improve
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantify the impact — what was the business outcome?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 text-center">
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-12">
            Built for real interview prep
          </h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div key={f.label} className="relative">
                <div className="w-10 h-10 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center text-xl mb-5">
                  {f.icon}
                </div>
                <p className="text-sm font-semibold mb-2">{f.label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                {i < features.length - 1 && (
                  <div className="hidden sm:block absolute top-5 right-0 w-px h-16 bg-border -mr-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ───────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Pricing
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Free to start. Upgrade when ready.
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10">
            5 questions a day, free forever. Go unlimited with Pro for $12/mo, or get the full Interview Pack for $49.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { name: "Free", price: "$0", tagline: "5 questions/day", color: "border-border" },
              { name: "Pro", price: "$12/mo", tagline: "Unlimited everything", color: "border-indigo-500", highlight: true },
              { name: "Interview Pack", price: "$49", tagline: "Pro + Countdown Kit", color: "border-border" },
            ].map((p) => (
              <div
                key={p.name}
                className={cn(
                  "rounded-xl border-2 p-5 text-left",
                  p.color,
                  p.highlight && "shadow-lg shadow-indigo-100"
                )}
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{p.name}</p>
                <p className={cn("text-2xl font-bold mb-1", p.highlight && "text-indigo-600")}>{p.price}</p>
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
              </div>
            ))}
          </div>

          <Link href="/pricing" className={buttonVariants({ variant: "outline" })}>
            See full pricing →
          </Link>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-white to-indigo-50 border-t border-border">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Ready to get the offer?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto">
          Pick your company, answer a question, get feedback in under 2 minutes.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/login" className={buttonVariants({ size: "lg" })}>
            Start now — it's free
          </Link>
          <Link href="/pricing" className={buttonVariants({ variant: "outline", size: "lg" })}>
            View pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
