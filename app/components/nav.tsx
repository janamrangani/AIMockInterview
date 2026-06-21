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

  const showNav = !["/login", "/"].includes(pathname);
  if (!showNav) return null;

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/start" className="font-semibold text-sm tracking-tight">
          AI Mock Interview
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/history"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              pathname === "/history" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            History
          </Link>
          <Link
            href="/start"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              pathname === "/start" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            New interview
          </Link>
          <Button variant="outline" size="sm" onClick={signOut} className="ml-2">
            Sign out
          </Button>
        </nav>
      </div>
    </header>
  );
}
