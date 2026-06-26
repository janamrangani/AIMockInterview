"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  async function signOut() {
    setMobileOpen(false);
    await getSupabase().auth.signOut();
    router.push("/login");
  }

  if (pathname === "/login") return null;

  const isLoggedIn = !!userEmail;
  const initial = userEmail ? userEmail[0].toUpperCase() : "?";

  const loggedInLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history",   label: "History" },
    { href: "/kit",       label: "Kit" },
    { href: "/pricing",   label: "Pricing" },
    { href: "/profile",   label: "Profile" },
  ];

  return (
    <>
      <header className="border-b border-zinc-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-sm tracking-tight text-foreground">
            InterviewAI
          </Link>

          {/* ── Desktop nav — logged out ──────────────────────────── */}
          {!isLoggedIn && authChecked && (
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-zinc-500 hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-sm text-zinc-500 hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link href="/login" className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity">
                Get started
              </Link>
            </nav>
          )}

          {/* ── Desktop nav — logged in ───────────────────────────── */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-5">
              {loggedInLinks.slice(0, 4).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm transition-colors",
                    pathname === href ? "text-foreground font-medium" : "text-zinc-500 hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              ))}
              <Link href="/start" className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity">
                New interview
              </Link>

              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="w-7 h-7 rounded-full bg-foreground text-white text-xs font-bold flex items-center justify-center hover:opacity-80 transition-opacity"
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
                    <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
                      Profile &amp; Resume
                    </Link>
                    <Link href="/history" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
                      Session history
                    </Link>
                    <Link href="/pricing" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
                      Pricing
                    </Link>
                    <div className="border-t border-zinc-100 mt-1 pt-1">
                      <button onClick={signOut} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          )}

          {/* ── Mobile right side ────────────────────────────────── */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile CTA for logged-out */}
            {!isLoggedIn && authChecked && (
              <Link href="/login" className="sm:hidden text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity">
                Get started
              </Link>
            )}
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="p-1.5 rounded-lg hover:bg-zinc-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ───────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col md:hidden" style={{ top: "57px" }}>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!isLoggedIn && authChecked && (
              <nav className="space-y-1">
                <Link href="/pricing" className="flex items-center h-12 text-base font-medium text-foreground border-b border-zinc-100">
                  Pricing
                </Link>
                <Link href="/login" className="flex items-center h-12 text-base font-medium text-foreground border-b border-zinc-100">
                  Sign in
                </Link>
                <div className="pt-4">
                  <Link href="/login" className="inline-flex items-center justify-center w-full h-11 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity">
                    Get started →
                  </Link>
                </div>
              </nav>
            )}

            {isLoggedIn && (
              <nav className="space-y-1">
                {userEmail && (
                  <p className="text-xs text-zinc-400 pb-4 truncate">{userEmail}</p>
                )}
                {loggedInLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center h-12 text-base border-b border-zinc-100 transition-colors",
                      pathname === href ? "font-semibold text-foreground" : "font-medium text-zinc-600"
                    )}
                  >
                    {label}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <Link href="/start" className="inline-flex items-center justify-center w-full h-11 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity">
                    New interview →
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full h-11 rounded-full border border-zinc-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      )}
    </>
  );
}
