"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname.startsWith("/session/")) return null;

  return (
    <footer className="border-t border-zinc-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-bold text-sm text-foreground block mb-2">
              InterviewAI
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Practice interviews calibrated to your target company, with honest AI feedback.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-4">Product</p>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Pricing", href: "/pricing" },
                { label: "Start practising", href: "/start" },
                { label: "Session history", href: "/history" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-zinc-500 hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-4">Companies</p>
            <ul className="space-y-2.5">
              {["Amazon", "Google", "Meta", "Microsoft"].map((c) => (
                <li key={c}>
                  <span className="text-sm text-zinc-500">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-sm text-zinc-500 hover:text-foreground transition-colors">Privacy policy</Link></li>
              <li><Link href="/terms" className="text-sm text-zinc-500 hover:text-foreground transition-colors">Terms of service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">© {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
          <p className="text-xs text-zinc-400">Built for candidates who want the offer.</p>
        </div>
      </div>
    </footer>
  );
}
