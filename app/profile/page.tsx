"use client";
// app/profile/page.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Upload, FileText, CheckCircle2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type ProfileData = {
  email: string;
  plan: string;
  pack_expires_at: string | null;
  resume_filename: string | null;
  resume_text: string | null;
  member_since: string;
  session_count: number;
};

function PlanBadge({ plan }: { plan: string }) {
  if (plan === "admin") return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Admin</Badge>;
  if (plan === "pack") return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Pack</Badge>;
  return <Badge variant="outline" className="text-muted-foreground">Free</Badge>;
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const texts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    texts.push(pageText);
  }

  return texts.join("\n").trim();
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const res = await fetch(`/api/profile?accessToken=${session.access_token}`);
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    });
  }, [router]);

  async function uploadResume(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File must be under 2MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      let resumeText = "";
      if (file.type === "application/pdf") {
        resumeText = await extractTextFromPDF(file);
      } else {
        resumeText = await file.text();
      }

      if (!resumeText.trim()) {
        setUploadError("Could not extract text from this file.");
        setUploading(false);
        return;
      }

      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/profile/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: session.access_token,
          resumeText,
          filename: file.name,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setUploadError(json.error ?? "Upload failed.");
      } else {
        setUploadSuccess(true);
        setProfile((prev) => prev ? { ...prev, resume_filename: file.name } : prev);
      }
    } catch (err) {
      console.error(err);
      setUploadError("Failed to read file.");
    }

    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadResume(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadResume(file);
  }

  if (loading) {
    return (
      <main className="max-w-lg mx-auto px-6 py-16">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (!profile) return null;

  const memberSince = new Date(profile.member_since).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="max-w-lg mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Profile</h1>

      {/* User details */}
      <div className="rounded-xl border border-border bg-white p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{profile.email}</p>
            <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Plan</span>
            <PlanBadge plan={profile.plan} />
          </div>
          <span className="text-muted-foreground">{profile.session_count} interview{profile.session_count !== 1 ? "s" : ""} completed</span>
        </div>
      </div>

      {/* Resume upload */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-semibold text-sm mb-1">Resume</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Upload your resume and we'll tailor behavioral questions to your actual experience.
        </p>

        {profile.resume_filename && !uploadSuccess && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 mb-4">
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{profile.resume_filename}</span>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 ml-auto" />
          </div>
        )}

        {uploadSuccess && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 mb-4">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Resume uploaded successfully!</span>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-red-600 mb-3">{uploadError}</p>
        )}

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-indigo-400 bg-indigo-50" : "border-border hover:border-indigo-300 hover:bg-muted/30"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            {uploading ? "Processing…" : "Drop your resume here or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">PDF or TXT · Max 2MB</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </main>
  );
}
