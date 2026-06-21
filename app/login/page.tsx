"use client";
// app/login/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const supabase = getSupabase();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (!data.session) {
        setLoading(false);
        setInfo("Check your email and click the confirmation link, then sign in.");
        return;
      }
      router.push("/start");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/start");
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-4 -mt-14">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === "login" ? "Welcome back" : "Create account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign in to continue your prep"
              : "Start practising for free"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>

            {info && <p className="text-sm text-emerald-600">{info}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "…" : mode === "login" ? "Sign in" : "Sign up"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setInfo(null); }}
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
