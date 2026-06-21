import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 text-center">
      <div className="max-w-xl">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
          AI-powered interview prep
        </span>
        <h1 className="text-5xl font-bold tracking-tight leading-tight mb-4">
          Ace your next
          <br />
          tech interview
        </h1>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Real questions calibrated to your target company, adaptive follow-ups,
          and honest AI feedback — so you walk in prepared.
        </p>
        <Link href="/login" className={buttonVariants({ size: "lg" })}>
          Get started free
        </Link>

        <div className="mt-16 grid grid-cols-3 gap-6 text-left">
          {[
            { label: "Company-calibrated", desc: "Questions tuned to Amazon, Google, Meta, and Microsoft interview styles." },
            { label: "Adaptive follow-ups", desc: "AI probes your answers just like a real interviewer would." },
            { label: "Honest feedback", desc: "Score, strengths, and concrete gaps — not generic praise." },
          ].map((f) => (
            <div key={f.label} className="p-4 rounded-xl border border-border bg-card">
              <p className="font-semibold text-sm mb-1">{f.label}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
