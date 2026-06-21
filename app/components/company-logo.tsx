// app/components/company-logo.tsx
// Brand-accurate SVG logo marks for each supported company.
import { cn } from "@/lib/utils";

// ── Individual logos ──────────────────────────────────────────────────────

function AmazonLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      {/* Wordmark-style "a" */}
      <path
        d="M20 8C15.08 8 11 10.91 11 14.5C11 16.86 12.56 18.97 15.25 20.13C14.95 21.03 14.73 21.97 14.73 22.93C14.73 24.27 15.2 25.47 16 26.4C13.17 26.69 11 28.39 11 30.5C11 32.99 14.13 35 18 35C21.87 35 25 32.99 25 30.5C25 28.97 24.05 27.63 22.57 26.8C22.86 26.2 23 25.58 23 24.97C23 24.11 22.72 23.26 22.24 22.5C24.58 21.29 26 18.98 26 16.5C26 16.18 25.97 15.87 25.92 15.57L28 14.5L26 13C24.62 10.06 22.47 8 20 8Z"
        fill="white"
        opacity="0.95"
      />
      {/* Smile arrow */}
      <path
        d="M12 31.5C14.5 33.5 17.5 34.5 21 34C24 33.5 27 32 29.5 29.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M27 28.5L29.5 29.5L28 32"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function MetaLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      {/* Meta infinity-style M */}
      <path
        d="M7 26C7 26 7 14 13 14C16 14 18 17 20 20C22 17 24 14 27 14C33 14 33 26 33 26"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M7 26C7 26 7 14 13 14"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M7 26C8 28.5 10.5 29 13 27C15 25.5 17 22 20 20C23 22 25 25.5 27 27C29.5 29 32 28.5 33 26"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect x="0"  y="0"  width="10" height="10" fill="#F25022" rx="0.5"/>
      <rect x="11" y="0"  width="10" height="10" fill="#7FBA00" rx="0.5"/>
      <rect x="0"  y="11" width="10" height="10" fill="#00A4EF" rx="0.5"/>
      <rect x="11" y="11" width="10" height="10" fill="#FFB900" rx="0.5"/>
    </svg>
  );
}

// ── Brand colors ──────────────────────────────────────────────────────────

const brandConfig: Record<string, { bg: string; border: string }> = {
  Amazon:    { bg: "bg-[#FF9900]",  border: "border-[#e68a00]" },
  Google:    { bg: "bg-white",      border: "border-gray-200" },
  Meta:      { bg: "bg-[#1877F2]",  border: "border-[#1464d2]" },
  Microsoft: { bg: "bg-white",      border: "border-gray-200" },
};

const logoMap: Record<string, React.ReactNode> = {
  Amazon:    <AmazonLogo />,
  Google:    <GoogleLogo />,
  Meta:      <MetaLogo />,
  Microsoft: <MicrosoftLogo />,
};

// ── Public component ──────────────────────────────────────────────────────

interface CompanyLogoProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 rounded-lg",
  md: "w-10 h-10 rounded-xl",
  lg: "w-12 h-12 rounded-xl",
};

export default function CompanyLogo({ name, size = "md", className }: CompanyLogoProps) {
  const config = brandConfig[name];
  const logo = logoMap[name];

  if (!config || !logo) {
    // Generic fallback: initials in indigo
    return (
      <div className={cn(
        "flex items-center justify-center flex-shrink-0 border bg-indigo-600 border-indigo-700",
        sizes[size],
        className
      )}>
        <span className="text-white font-bold text-sm">{name?.[0] ?? "?"}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center justify-center flex-shrink-0 border shadow-sm",
      config.bg,
      config.border,
      sizes[size],
      className
    )}>
      {logo}
    </div>
  );
}
