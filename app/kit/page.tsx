"use client";
// app/kit/page.tsx — Interview Countdown Kit
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Briefcase, Mic, HelpCircle, BookMarked, Mail, Banknote,
  ClipboardList, Copy, Check, Loader2, ChevronDown, type LucideIcon,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type DocType =
  | "linkedin_headline"
  | "tell_me_about_yourself"
  | "interviewer_questions"
  | "star_story"
  | "thank_you_email"
  | "negotiation_points"
  | "logistics_checklist";

type Company = { id: string; name: string };

type DocState = {
  open: boolean;
  input: string;
  output: string | null;
  loading: boolean;
  copied: boolean;
  error: string | null;
};

// ── Kit doc metadata ──────────────────────────────────────────────────────────

const KIT_DOCS: {
  type: DocType;
  Icon: LucideIcon;
  title: string;
  desc: string;
  inputLabel: string | null;
  inputPlaceholder: string | null;
  inputHint: string | null;
}[] = [
  {
    type: "linkedin_headline",
    Icon: Briefcase,
    title: "LinkedIn rewrite",
    desc: "Headline + About section optimised for your target role.",
    inputLabel: "Your current LinkedIn headline & About section",
    inputPlaceholder: "Software Engineer at Acme Corp. Passionate about building products.\n\nAbout: I've been working in software for 5 years...",
    inputHint: "Paste your current headline and About section. The more you give, the better the rewrite.",
  },
  {
    type: "tell_me_about_yourself",
    Icon: Mic,
    title: '"Tell me about yourself"',
    desc: "A polished, company-calibrated 60-second opening pitch.",
    inputLabel: "Your background (2–4 sentences)",
    inputPlaceholder: "4 years of backend experience at a fintech startup, led a team of 3, shipped a payment processing system that handles $2M/day...",
    inputHint: "Brief bullet points are fine. Focus on your most relevant experience.",
  },
  {
    type: "interviewer_questions",
    Icon: HelpCircle,
    title: "Questions to ask",
    desc: "Smart, role-specific questions that signal preparation.",
    inputLabel: "Context (optional)",
    inputPlaceholder: "I'm most interested in the team culture and technical challenges. I've heard they're scaling their infra team...",
    inputHint: "Optional: share what you care about most in a role. Leave blank for general questions.",
  },
  {
    type: "star_story",
    Icon: BookMarked,
    title: "STAR story",
    desc: "A rough work story structured into a clean behavioral answer.",
    inputLabel: "Your rough story",
    inputPlaceholder: "Last year I noticed our CI pipeline was taking 40 minutes. I figured out the bottleneck was our test suite running sequentially. I parallelized it and got it down to 8 minutes...",
    inputHint: "Write it rough — don't worry about structure. Just tell what happened.",
  },
  {
    type: "thank_you_email",
    Icon: Mail,
    title: "Thank-you email",
    desc: "Send within 24h to stay top of mind.",
    inputLabel: "Interview details",
    inputPlaceholder: "Interviewed with Sarah (engineering manager) and Tom (senior SWE). We talked about their Kafka migration and I mentioned my experience with distributed systems. The role is senior SWE on the infra team.",
    inputHint: "Include interviewer names and any specific topics you discussed.",
  },
  {
    type: "negotiation_points",
    Icon: Banknote,
    title: "Salary negotiation",
    desc: "Specific talking points and counter-offer language.",
    inputLabel: "Your situation",
    inputPlaceholder: "They offered $160k base + 15% bonus. I currently make $145k. I have 6 YOE. I have a competing offer from Meta for $175k...",
    inputHint: "Include the offer details and any competing offers or leverage you have.",
  },
  {
    type: "logistics_checklist",
    Icon: ClipboardList,
    title: "Day-of checklist",
    desc: "Everything from tech setup to mindset — nothing forgotten.",
    inputLabel: null,
    inputPlaceholder: null,
    inputHint: null,
  },
];

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Output renderer — preserves newlines ──────────────────────────────────────

function OutputBlock({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground">
      {text}
    </div>
  );
}

// ── Single doc card ───────────────────────────────────────────────────────────

function DocCard({
  doc,
  state,
  onToggle,
  onInputChange,
  onGenerate,
  onCopy,
}: {
  doc: (typeof KIT_DOCS)[number];
  state: DocState;
  onToggle: () => void;
  onInputChange: (v: string) => void;
  onGenerate: () => void;
  onCopy: () => void;
}) {
  const { Icon, title, desc, inputLabel, inputPlaceholder, inputHint, type } = doc;

  return (
    <div className={cn(
      "rounded-xl border border-border bg-white transition-shadow duration-150",
      state.open && "shadow-sm"
    )}>
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
        {state.output && !state.open && (
          <span className="text-xs text-emerald-600 font-medium flex-shrink-0">Generated</span>
        )}
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-150",
          state.open && "rotate-180"
        )} />
      </button>

      {/* Expanded body */}
      {state.open && (
        <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
          {/* Input */}
          {inputLabel && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{inputLabel}</label>
              {inputHint && (
                <p className="text-xs text-muted-foreground">{inputHint}</p>
              )}
              <textarea
                value={state.input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={inputPlaceholder ?? ""}
                rows={4}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={onGenerate}
            disabled={state.loading || (!!inputLabel && !state.input.trim())}
            className={cn(
              buttonVariants({ size: "sm" }),
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {state.loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Generating…
              </>
            ) : state.output ? (
              "Regenerate"
            ) : (
              "Generate →"
            )}
          </button>

          {/* Error */}
          {state.error && (
            <p className="text-xs text-destructive">{state.error}</p>
          )}

          {/* Output */}
          {state.output && (
            <div>
              <OutputBlock text={state.output} />
              <button
                onClick={onCopy}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-2 gap-1.5"
                )}
              >
                {state.copied ? (
                  <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copied</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function makeDefaultState(): DocState {
  return { open: false, input: "", output: null, loading: false, copied: false, error: null };
}

export default function KitPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [docStates, setDocStates] = useState<Record<DocType, DocState>>(
    () => Object.fromEntries(KIT_DOCS.map((d) => [d.type, makeDefaultState()])) as Record<DocType, DocState>
  );
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUserId(session.user.id);
      setAccessToken(session.access_token);

      const [{ data: companiesData }, { data: profileData }] = await Promise.all([
        supabase.from("companies").select("id, name").order("name"),
        supabase.from("profiles").select("plan").eq("id", session.user.id).single(),
      ]);

      setCompanies(companiesData ?? []);
      setPlan(profileData?.plan ?? "free");
      setAuthLoading(false);
    });
  }, [router]);

  const updateDoc = useCallback((type: DocType, patch: Partial<DocState>) => {
    setDocStates((prev) => ({ ...prev, [type]: { ...prev[type], ...patch } }));
  }, []);

  async function handleGenerate(doc: (typeof KIT_DOCS)[number]) {
    const { type } = doc;
    updateDoc(type, { loading: true, error: null });

    try {
      const res = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type,
          companyId,
          role: role.trim(),
          userInput: docStates[type].input,
          accessToken,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Generation failed.");
      updateDoc(type, { output: json.document.output_text, loading: false });
    } catch (err) {
      updateDoc(type, { loading: false, error: (err as Error).message });
    }
  }

  async function handleCopy(type: DocType) {
    const text = docStates[type].output;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    updateDoc(type, { copied: true });
    setTimeout(() => updateDoc(type, { copied: false }), 2000);
  }

  const isPaidUser = plan === "pack" || plan === "admin";
  const ready = companyId && role.trim();

  if (authLoading) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[72px] rounded-xl border border-border bg-muted/30 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
          Interview Countdown Kit
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Seven documents. One interview.</h1>
        <p className="text-muted-foreground">
          Each document is generated by AI and calibrated to your company and role.
        </p>
      </div>

      {/* Access gate */}
      {!isPaidUser && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-8">
          <p className="font-semibold text-sm text-amber-900 mb-1">Interview Pack required</p>
          <p className="text-sm text-amber-800 mb-3">
            The Countdown Kit is included in the Interview Pack ($17 one-time).
          </p>
          <Link href="/pricing" className={buttonVariants({ size: "sm" })}>
            Get the Pack →
          </Link>
        </div>
      )}

      {/* Company + role selectors */}
      {isPaidUser && (
        <div className="grid sm:grid-cols-2 gap-4 mb-8 p-5 rounded-xl border border-border bg-muted/20">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Company</label>
            <Select value={companyId} onValueChange={(v) => setCompanyId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Role</label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior SWE, Product Manager"
            />
          </div>
          {!ready && (
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Select a company and role to unlock all documents.
            </p>
          )}
        </div>
      )}

      {/* Doc cards */}
      {isPaidUser && (
        <div className="space-y-3">
          {KIT_DOCS.map((doc) => (
            <div key={doc.type} className={cn(!ready && "opacity-50 pointer-events-none")}>
              <DocCard
                doc={doc}
                state={docStates[doc.type]}
                onToggle={() => updateDoc(doc.type, { open: !docStates[doc.type].open })}
                onInputChange={(v) => updateDoc(doc.type, { input: v })}
                onGenerate={() => handleGenerate(doc)}
                onCopy={() => handleCopy(doc.type)}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
