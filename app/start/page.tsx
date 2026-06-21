"use client";
// app/start/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Company = { id: string; name: string };

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function StartPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capReached, setCapReached] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      supabase
        .from("companies")
        .select("id, name")
        .order("name")
        .then(({ data, error: err }) => {
          if (err) setError(`Could not load companies: ${err.message}`);
          else setCompanies(data ?? []);
        });
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setCapReached(false);

    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace("/login"); return; }

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId,
        role: role.trim(),
        accessToken: session.access_token,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      if (json.error === "free_cap_reached" || json.error === "pack_cap_reached" || json.error === "pack_expired") {
        setCapReached(true);
        setError(json.message);
      } else {
        setError(json.message ?? json.error ?? "Something went wrong.");
      }
      setSubmitting(false);
      return;
    }

    router.push(`/session/${json.session.id}`);
  }

  const canSubmit = companyId && role.trim() && !submitting;

  return (
    <main className="max-w-lg mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Start a mock interview</h1>
        <p className="text-muted-foreground">
          Pick your target company and the role you're interviewing for.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Company</label>
          <Select value={companyId} onValueChange={(v) => setCompanyId(v ?? "")} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. SWE Intern, New Grad SWE, Product Manager"
            required
          />
        </div>

        {error && (
          <div className={capReached
            ? "rounded-lg border border-amber-200 bg-amber-50 p-4"
            : ""
          }>
            <p className={`text-sm ${capReached ? "text-amber-800" : "text-destructive"}`}>
              {error}
            </p>
            {capReached && (
              <Link
                href="/pricing"
                className="text-sm font-semibold text-amber-900 underline underline-offset-2 mt-1 inline-block"
              >
                Get the Interview Pack →
              </Link>
            )}
          </div>
        )}

        <Button type="submit" disabled={!canSubmit} className="w-full" size="lg">
          {submitting ? "Starting…" : "Start interview →"}
        </Button>
      </form>
    </main>
  );
}
