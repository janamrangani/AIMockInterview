"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function signOut() {
    await getSupabase().auth.signOut();
    router.push("/login");
  }

  if (pathname === "/login") return null;

  const isLoggedIn = !!userEmail;
  const initial = userEmail ? userEmail[0].toUpperCase() : "?";

  return (
    <header className="border-b border-zinc-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-sm tracking-tight text-foreground"
        >
          InterviewAI
        </Link>

        {!isLoggedIn && authChecked && (
          <nav className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm text-zinc-500 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm text-zinc-500 hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity"
            >
              Get started
            </Link>
          </nav>
        )}

        {isLoggedIn && (
          <nav className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className={cn(
                "text-sm transition-colors",
                pathname === "/dashboard" ? "text-foreground font-medium" : "text-zinc-500 hover:text-foreground"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/history"
              className={cn(
                "text-sm transition-colors",
                pathname === "/history" ? "text-foreground font-medium" : "text-zinc-500 hover:text-foreground"
              )}
            >
              History
            </Link>
            <Link
              href="/kit"
              className={cn(
                "text-sm transition-colors",
                pathname === "/kit" ? "text-foreground font-medium" : "text-zinc-500 hover:text-foreground"
              )}
            >
              Kit
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "text-sm transition-colors",
                pathname === "/pricing" ? "text-foreground font-medium" : "text-zinc-500 hover:text-foreground"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/start"
              className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity"
            >
              New interview
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-7 h-7 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                {initial}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-9 w-52 rounded-xl border border-zinc-100 bg-white shadow-lg shadow-zinc-100/80 py-1 z-50">
                  {userEmail && (
                    <div className="px-4 py-2.5 border-b border-zinc-100">
                      <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
                    </div>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Profile &amp; Resume
                  </Link>
                  <Link
                    href="/history"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Session history
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Pricing
                  </Link>
                  <div className="border-t border-zinc-100 mt-1 pt-1">
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
