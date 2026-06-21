// app/checkout/success/page.tsx
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
      <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-6">
        <Sparkles className="w-7 h-7 text-emerald-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        You're all set!
      </h1>
      <p className="text-muted-foreground text-lg max-w-sm mb-2">
        Your Interview Pack is active for the next 30 days.
      </p>
      <p className="text-sm text-muted-foreground mb-10">
        5 mock sessions + the full Countdown Kit — go make it count.
      </p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link href="/start" className={buttonVariants({ size: "lg" })}>
          Start your first interview →
        </Link>
        <Link href="/history" className={buttonVariants({ variant: "outline" })}>
          View history
        </Link>
      </div>
    </main>
  );
}
