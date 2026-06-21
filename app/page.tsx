import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const companies = ["Amazon", "Google", "Meta", "Microsoft"];

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

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          AI-powered · Free to start
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] max-w-2xl mb-6">
          Practice interviews that{" "}
          <span className="text-indigo-600">actually prepare you</span>
        </h1>

        <p className="text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed mb-10">
          Real questions calibrated to your target company, adaptive AI
          follow-ups, and honest feedback — so you walk in confident.
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/login" className={buttonVariants({ size: "lg" })}>
            Start practising free →
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Sign in
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Prep for{" "}
          {companies.map((c, i) => (
            <span key={c}>
              <span className="font-medium text-foreground">{c}</span>
              {i < companies.length - 1 && (
                <span className="mx-1.5 text-border">·</span>
              )}
            </span>
          ))}
        </p>
      </section>

      {/* Sample question preview */}
      <section className="bg-white border-y border-border py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 text-center">
            What it looks like
          </p>
          <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="bg-muted/40 border-b border-border px-5 py-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5">
                behavioral
              </span>
              <span className="text-xs text-muted-foreground">Amazon · SWE Intern</span>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-base font-semibold leading-relaxed">
                Tell me about a time you had to deliver a project under a tight
                deadline. How did you prioritize what mattered most?
              </p>
              <div className="rounded-lg bg-muted/50 border border-border p-4 text-sm text-muted-foreground italic">
                "In my last internship, I had three days to ship a feature…"
              </div>
              <div className="flex items-start gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  8/10
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-0.5">
                    Strengths
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Clear ownership and strong result quantification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-12 text-center">
            How it works
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.label}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <p className="font-semibold text-sm mb-2">{f.label}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="py-16 px-6 text-center border-t border-border bg-gradient-to-b from-white to-indigo-50">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Ready to get the offer?
        </h2>
        <p className="text-muted-foreground mb-8">
          Pick your company, answer a question, get feedback in under 2 minutes.
        </p>
        <Link href="/login" className={buttonVariants({ size: "lg" })}>
          Start now — it's free
        </Link>
      </section>
    </div>
  );
}
