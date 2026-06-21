"use client";
// app/components/nav.tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button, buttonVariants } from "@/components/ui/button";
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

  async function signOut() {
    await getSupabase().auth.signOut();
    router.push("/login");
  }

  if (pathname === "/login") return null;

  const isPublic = pathname === "/" || pathname === "/pricing";

  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={isPublic ? "/" : "/start"}
          className="font-bold text-base tracking-tight text-foreground"
        >
          InterviewAI
        </Link>

        {/* Public nav */}
        {isPublic && (
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

        {/* Auth nav */}
        {!isPublic && (
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
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="ml-3"
            >
              Sign out
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
