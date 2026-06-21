"use client";
// app/start/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Company = { id: string; name: string };

export default function StartPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
        return;
      }

      supabase
        .from("companies")
        .select("id, name")
        .order("name")
        .then(({ data, error }) => {
          if (error) setError(`Could not load companies: ${error.message}`);
          else setCompanies(data ?? []);
        });
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace("/login"); return; }

    const { data: session_row, error: insertError } = await supabase
      .from("sessions")
      .insert({ user_id: session.user.id, company_id: companyId, role: role.trim() })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push(`/session/${session_row.id}`);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
    boxSizing: "border-box",
    fontFamily: "system-ui",
    background: "#fff",
  };

  const canSubmit = companyId && role.trim() && !submitting;

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "80px auto",
        padding: "0 24px",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
        Start a mock interview
      </h1>
      <p style={{ fontSize: 16, color: "#555", marginTop: 10, marginBottom: 0 }}>
        Pick your target company and the role you're interviewing for.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div>
          <label
            style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
          >
            Company
          </label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select a company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
          >
            Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. SWE Intern, New Grad SWE, Product Manager"
            required
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            marginTop: 4,
            padding: "12px 16px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 15,
            fontWeight: 600,
            cursor: canSubmit ? "pointer" : "not-allowed",
            opacity: canSubmit ? 1 : 0.4,
            fontFamily: "system-ui",
          }}
        >
          {submitting ? "Starting…" : "Start interview →"}
        </button>
      </form>
    </main>
  );
}
