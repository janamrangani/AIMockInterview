// app/components/footer.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on login page and session pages
  if (pathname === "/login" || pathname.startsWith("/session/")) return null;

  return (
    <footer className="border-t border-border bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-bold text-base text-foreground block mb-2">
              InterviewAI
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Practice interviews calibrated to your target company, with honest AI feedback.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Product
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/start" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Start practising
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Session history
                </Link>
              </li>
            </ul>
          </div>

          {/* Companies */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Companies
            </p>
            <ul className="space-y-2.5">
              {["Amazon", "Google", "Meta", "Microsoft"].map((c) => (
                <li key={c}>
                  <span className="text-sm text-muted-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Legal
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} InterviewAI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for candidates who want the offer.
          </p>
        </div>
      </div>
    </footer>
  );
}
