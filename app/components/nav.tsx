"use client";
// app/components/nav.tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { buttonVariants } from "@/components/ui/button";
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

  // Close dropdown on outside click
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
  const isPublic = pathname === "/" || pathname === "/pricing";
  const initial = userEmail ? userEmail[0].toUpperCase() : "?";

  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="font-bold text-base tracking-tight text-foreground"
        >
          InterviewAI
        </Link>

        {/* Public nav — only when not logged in */}
        {isPublic && !isLoggedIn && authChecked && (
          <nav className="flex items-center gap-1">
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                pathname === "/pricing"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground ml-1"
              )}
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm" }), "ml-2")}
            >
              Get started →
            </Link>
          </nav>
        )}

        {/* Auth nav — when logged in on any page */}
        {isLoggedIn && (
          <nav className="flex items-center gap-1">
            <Link
              href="/history"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                pathname === "/history"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              History
            </Link>
            <Link
              href="/kit"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                pathname === "/kit"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              Kit
            </Link>
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                pathname === "/pricing"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/start"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                pathname === "/start"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              New interview
            </Link>

            {/* Profile avatar + dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center hover:bg-indigo-700 transition-colors"
              >
                {initial}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-56 rounded-xl border border-border bg-white shadow-lg py-1 z-50">
                  {userEmail && (
                    <div className="px-4 py-2.5 border-b border-border">
                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                  >
                    Profile &amp; Resume
                  </Link>
                  <Link
                    href="/history"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                  >
                    Session history
                  </Link>
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
