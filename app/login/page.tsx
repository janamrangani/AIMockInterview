"use client";
// app/login/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

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

    const supabase = getSupabaseBrowserClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // If session is null, Supabase requires email confirmation before login
      if (!data.session) {
        setLoading(false);
        setInfo("Check your email and click the confirmation link, then sign in here.");
        return;
      }
      router.push("/start");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/start");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
    boxSizing: "border-box",
    fontFamily: "system-ui",
  };

  return (
    <main
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: "0 24px",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
        AI Mock Interview
      </h1>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 0 }}>
        {mode === "login" ? "Sign in" : "Create account"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <label
            style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            style={inputStyle}
          />
        </div>

        {info && (
          <p style={{ color: "#16a34a", fontSize: 14, margin: 0 }}>{info}</p>
        )}
        {error && (
          <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4,
            padding: "11px 16px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            fontFamily: "system-ui",
          }}
        >
          {loading ? "…" : mode === "login" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 14, color: "#555", textAlign: "center" }}>
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setInfo(null);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#111",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
            padding: 0,
            fontFamily: "system-ui",
          }}
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </main>
  );
}
