"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const highlights = [
  "Questions calibrated to your exact company and role",
  "AI follow-ups that probe your gaps like a real interviewer",
  "Honest 1–10 scores with specific improvement points",
  "7 prep documents tailored to your interview",
];

const testimonial = {
  quote: "The follow-up questions were brutal in the best way. My real interviewer asked almost the exact same one. I knew exactly what to say.",
  name: "Marcus T.",
  role: "APM candidate — Google",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PasswordRule = { label: string; pass: (p: string) => boolean };
const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters",           pass: (p) => p.length >= 8 },
  { label: "One uppercase letter",             pass: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter",             pass: (p) => /[a-z]/.test(p) },
  { label: "One number",                       pass: (p) => /[0-9]/.test(p) },
  { label: "One special character (!@#$…)",   pass: (p) => /[^A-Za-z0-9]/.test(p) },
];

const inputClass =
  "flex h-11 w-full rounded-xl border bg-white px-4 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:border-foreground/40 transition-all";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]               = useState<string | null>(null);
  const [info, setInfo]                 = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [touched, setTouched]           = useState({ email: false, password: false, confirmPassword: false });
  const router = useRouter();

  const emailValid      = EMAIL_RE.test(email);
  const passwordsMatch  = password === confirmPassword;
  const pwRules         = useMemo(() => PASSWORD_RULES.map((r) => ({ ...r, ok: r.pass(password) })), [password]);
  const pwStrength   = pwRules.filter((r) => r.ok).length; // 0–5
  const pwAllPass    = pwStrength === PASSWORD_RULES.length;

  const strengthLabel = ["", "Weak", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const strengthColor = ["", "bg-red-400", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"][pwStrength];

  function switchMode(m: "login" | "signup") {
    setMode(m);
    setError(null);
    setInfo(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setTouched({ email: false, password: false, confirmPassword: false });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "signup") {
      if (!emailValid)      { setError("Please enter a valid email address."); return; }
      if (!pwAllPass)       { setError("Your password doesn't meet all the requirements."); return; }
      if (!passwordsMatch)  { setError("Passwords don't match."); return; }
    }

    setLoading(true);
    const supabase = getSupabase();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (!data.session) {
        setLoading(false);
        setInfo("Check your email and click the confirmation link, then sign in.");
        return;
      }
      router.push("/");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/");
  }

  return (
    <div className="flex min-h-screen">

      {/* ── Left panel ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-12">
        <Link href="/" className="text-white font-bold text-sm tracking-tight">
          InterviewAI
        </Link>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/40 mb-6">
            The unfair interview advantage
          </p>
          <h2 className="text-4xl font-bold text-white leading-[1.1] mb-10">
            Walk into your next<br />interview knowing<br />exactly what to say.
          </h2>

          <ul className="space-y-4 mb-14">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-sm text-white/70 leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/10 pt-8">
            <p className="text-sm text-white/60 leading-relaxed italic mb-4">
              "{testimonial.quote}"
            </p>
            <div>
              <p className="text-sm font-semibold text-white">{testimonial.name}</p>
              <p className="text-xs text-white/40 mt-0.5">{testimonial.role}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/25">© {new Date().getFullYear()} InterviewAI</p>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-start lg:justify-center px-6 py-10 bg-white overflow-y-auto">
        <Link href="/" className="lg:hidden font-bold text-sm tracking-tight mb-10 self-start">
          InterviewAI
        </Link>

        <div className="w-full max-w-sm">

          {/* Tabs */}
          <div className="flex rounded-xl border border-zinc-100 bg-zinc-50 p-1 mb-8">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={cn(
                  "flex-1 h-9 rounded-lg text-sm font-medium transition-all",
                  mode === m
                    ? "bg-white text-foreground shadow-sm border border-zinc-100"
                    : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                {m === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {mode === "login" ? "Welcome back." : "Start for free."}
            </h1>
            <p className="text-sm text-zinc-500">
              {mode === "login" ? "Sign in to continue your prep." : "No credit card required."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className={cn(
                  inputClass,
                  touched.email && !emailValid ? "border-red-300 focus-visible:ring-red-200" : "border-zinc-200"
                )}
              />
              {touched.email && !emailValid && (
                <p className="text-xs text-red-500">Enter a valid email address.</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="••••••••"
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className={cn(
                  inputClass,
                  touched.password && mode === "signup" && !pwAllPass
                    ? "border-amber-300 focus-visible:ring-amber-200"
                    : "border-zinc-200"
                )}
              />

              {/* Strength bar + rules — signup only */}
              {mode === "signup" && password.length > 0 && (
                <div className="pt-1 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-colors",
                            pwStrength >= i ? strengthColor : "bg-zinc-100"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-zinc-500 w-10 text-right">{strengthLabel}</span>
                  </div>
                  <ul className="space-y-1">
                    {pwRules.map((r) => (
                      <li key={r.label} className="flex items-center gap-2">
                        {r.ok
                          ? <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          : <X    className="w-3 h-3 text-zinc-300 flex-shrink-0" />
                        }
                        <span className={cn("text-xs", r.ok ? "text-emerald-600" : "text-zinc-400")}>
                          {r.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm password — signup only */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className={cn(
                    inputClass,
                    touched.confirmPassword && !passwordsMatch ? "border-red-300 focus-visible:ring-red-200" : "border-zinc-200"
                  )}
                />
                {touched.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500">Passwords don't match.</p>
                )}
                {touched.confirmPassword && passwordsMatch && confirmPassword && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Passwords match.
                  </p>
                )}
              </div>
            )}

            {info && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-sm text-emerald-700">{info}</p>
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {loading ? "…" : mode === "login" ? "Sign in →" : "Create account →"}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-400 mt-6">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-foreground hover:underline underline-offset-4"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>

          {mode === "signup" && (
            <p className="text-center text-xs text-zinc-400 mt-3">
              By signing up you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">Privacy Policy</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
