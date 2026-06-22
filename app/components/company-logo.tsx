// app/components/company-logo.tsx
// Brand-accurate SVG logo marks for each supported company.
import { cn } from "@/lib/utils";

// ── Individual logos ──────────────────────────────────────────────────────

function AmazonLogo() {
  return (
    <svg viewBox="75 108 340 80" xmlns="http://www.w3.org/2000/svg" className="w-7">
      <path d="m 374.00642,142.18404 c -34.99948,25.79739 -85.72909,39.56123 -129.40634,39.56123 -61.24255,0 -116.37656,-22.65135 -158.08757,-60.32496 -3.2771,-2.96252 -0.34083,-6.9999 3.59171,-4.69283 45.01431,26.19064 100.67269,41.94697 158.16623,41.94697 38.774689,0 81.4295,-8.02237 120.6499,-24.67006 5.92501,-2.51683 10.87999,3.88009 5.08607,8.17965" fill="white"/>
      <path d="m 388.55678,125.53635 c -4.45688,-5.71527 -29.57261,-2.70033 -40.84585,-1.36327 -3.43442,0.41947 -3.95874,-2.56925 -0.86517,-4.71905 20.00346,-14.07844 52.82696,-10.01483 56.65462,-5.2958 3.82764,4.74526 -0.99624,37.64741 -19.79373,53.35128 -2.88385,2.41195 -5.63662,1.12734 -4.35198,-2.07113 4.2209,-10.53917 13.68519,-34.16054 9.20211,-39.90203" fill="white"/>
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
      <path d="M7 26C7 26 7 14 13 14C16 14 18 17 20 20C22 17 24 14 27 14C33 14 33 26 33 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M7 26C7 26 7 14 13 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M7 26C8 28.5 10.5 29 13 27C15 25.5 17 22 20 20C23 22 25 25.5 27 27C29.5 29 32 28.5 33 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
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

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="white"/>
    </svg>
  );
}

function NetflixLogo() {
  // Bold italic N — Netflix's wordmark initial
  return (
    <svg viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg" className="w-5 h-6">
      <path d="M2 0h5.5l7 18.5V0H20v30h-5.3L7.5 11V30H2z" fill="white"/>
    </svg>
  );
}

function UberLogo() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c2.21 0 4 1.79 4 4v2c0 2.21-1.79 4-4 4s-4-1.79-4-4v-2c0-2.21 1.79-4 4-4z" fill="white"/>
    </svg>
  );
}

function AirbnbLogo() {
  // Bélo symbol
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <path d="M12.001 1.5c-1.108 0-2.054.493-2.668 1.241C8.354 3.791 8 4.988 8 6.25c0 1.064.26 2.08.7 2.947C6.895 10.07 6 11.354 6 12.75c0 2.071 1.652 3.75 3.688 3.75.826 0 1.587-.278 2.188-.741a3.628 3.628 0 002.187.741c2.036 0 3.688-1.679 3.688-3.75 0-1.396-.895-2.68-2.7-3.553.44-.867.7-1.883.7-2.947 0-1.262-.355-2.459-1.334-3.509C13.803 1.993 12.857 1.5 12 1.5zm0 1.5c.698 0 1.303.31 1.791.847.56.616.875 1.54.875 2.403 0 .897-.23 1.778-.625 2.5h-4.08c-.396-.722-.625-1.603-.625-2.5 0-.863.314-1.787.875-2.403C10.699 3.31 11.304 3 12.001 3zm0 7.5c1.622.496 2.688 1.467 2.688 2.25 0 1.243-1.012 2.25-2.25 2.25-1.237 0-2.25-1.007-2.25-2.25 0-.783 1.066-1.754 1.812-2.25z" fill="white"/>
    </svg>
  );
}

function StripeLogo() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <path d="M13.479 9.883c-2.148-.508-2.838-.972-2.838-1.741 0-.885.822-1.46 2.072-1.46 1.315 0 2.56.528 3.747 1.486l1.785-2.38C16.94 4.59 15.218 3.75 12.8 3.75c-3.285 0-5.545 1.888-5.545 4.641 0 2.97 1.99 3.975 5.105 4.717 2.136.52 2.7 1.014 2.7 1.784 0 .972-.885 1.568-2.307 1.568-1.574 0-3.053-.642-4.32-1.794l-1.98 2.237c1.502 1.502 3.59 2.347 6.16 2.347 3.432 0 5.797-1.824 5.797-4.768-.003-3.013-2.005-4.082-4.931-4.799z" fill="white"/>
    </svg>
  );
}

function OpenAILogo() {
  // Simplified OpenAI swirl mark
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9 6.065 6.065 0 00-4.512-2.01 6.046 6.046 0 00-5.775 4.187 6.02 6.02 0 00-3.999 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9 5.985 5.985 0 004.507 2.009 6.05 6.05 0 005.775-4.19 6.02 6.02 0 003.999-2.9 6.046 6.046 0 00-.747-7.093zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.677l5.815 3.354-2.02 1.168a.076.076 0 01-.071 0l-4.83-2.786A4.504 4.504 0 012.34 7.872zm16.597 3.855l-5.843-3.369 2.02-1.168a.076.076 0 01.071 0l4.83 2.791a4.494 4.494 0 01-.676 8.104v-5.678a.79.79 0 00-.402-.68zm2.01-3.023l-.141-.085-4.774-2.759a.776.776 0 00-.785 0L9.41 9.253V6.921a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.679 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.376-3.453l-.142.08-4.778 2.758a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="white"/>
    </svg>
  );
}

function SalesforceLogo() {
  // Cloud shape
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M10.012 4.5A5.25 5.25 0 0015.2 7.125a4.5 4.5 0 014.3 4.5 4.5 4.5 0 01-4.5 4.5H6a3.75 3.75 0 110-7.5c.22 0 .438.02.65.056A5.25 5.25 0 0110.012 4.5z" fill="white"/>
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="white"/>
    </svg>
  );
}

function TwitterXLogo() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="white"/>
    </svg>
  );
}

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="white"/>
    </svg>
  );
}

function AdobeLogo() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.867 1.376H.5l8.367 19.925zM15.133 1.376h8.367L15.133 21.3z" fill="white"/>
    </svg>
  );
}

function NvidiaLogo() {
  // Stylized "N" — Nvidia brand green on black
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <path d="M3 3h3.5l9 13.5V3H19v18h-3.5L6.5 7.5V21H3z" fill="white"/>
    </svg>
  );
}

function GoldmanSachsLogo() {
  return (
    <svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg" className="w-7">
      <text x="0" y="16" fontFamily="serif" fontSize="16" fontWeight="bold" fill="white" letterSpacing="1">GS</text>
    </svg>
  );
}

function JPMorganLogo() {
  return (
    <svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg" className="w-7">
      <text x="0" y="16" fontFamily="serif" fontSize="15" fontWeight="bold" fill="white" letterSpacing="0.5">JP</text>
    </svg>
  );
}

function McKinseyLogo() {
  return (
    <svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg" className="w-7">
      <text x="0" y="16" fontFamily="serif" fontSize="14" fontWeight="bold" fill="white" letterSpacing="0.5">Mc</text>
    </svg>
  );
}

// ── Brand colors ──────────────────────────────────────────────────────────

const brandConfig: Record<string, { bg: string; border: string }> = {
  Amazon:         { bg: "bg-[#FF9900]",  border: "border-[#e68a00]" },
  Google:         { bg: "bg-white",      border: "border-gray-200" },
  Meta:           { bg: "bg-[#1877F2]",  border: "border-[#1464d2]" },
  Microsoft:      { bg: "bg-white",      border: "border-gray-200" },
  Apple:          { bg: "bg-black",      border: "border-zinc-700" },
  Netflix:        { bg: "bg-[#E50914]",  border: "border-[#cc0812]" },
  Uber:           { bg: "bg-black",      border: "border-zinc-700" },
  Airbnb:         { bg: "bg-[#FF5A5F]",  border: "border-[#e64e53]" },
  Stripe:         { bg: "bg-[#635BFF]",  border: "border-[#4f48e2]" },
  OpenAI:         { bg: "bg-[#10a37f]",  border: "border-[#0d8c6d]" },
  Salesforce:     { bg: "bg-[#00A1E0]",  border: "border-[#008ec4]" },
  LinkedIn:       { bg: "bg-[#0077B5]",  border: "border-[#006497]" },
  "Twitter/X":    { bg: "bg-black",      border: "border-zinc-700" },
  Spotify:        { bg: "bg-[#1DB954]",  border: "border-[#18a34a]" },
  Adobe:          { bg: "bg-[#FF0000]",  border: "border-[#e60000]" },
  Nvidia:         { bg: "bg-[#76b900]",  border: "border-[#5e9300]" },
  "Goldman Sachs":{ bg: "bg-[#003366]",  border: "border-[#002a55]" },
  JPMorgan:       { bg: "bg-[#003087]",  border: "border-[#002470]" },
  McKinsey:       { bg: "bg-[#002855]",  border: "border-[#001f42]" },
};

const logoMap: Record<string, React.ReactNode> = {
  Amazon:         <AmazonLogo />,
  Google:         <GoogleLogo />,
  Meta:           <MetaLogo />,
  Microsoft:      <MicrosoftLogo />,
  Apple:          <AppleLogo />,
  Netflix:        <NetflixLogo />,
  Uber:           <UberLogo />,
  Airbnb:         <AirbnbLogo />,
  Stripe:         <StripeLogo />,
  OpenAI:         <OpenAILogo />,
  Salesforce:     <SalesforceLogo />,
  LinkedIn:       <LinkedInLogo />,
  "Twitter/X":    <TwitterXLogo />,
  Spotify:        <SpotifyLogo />,
  Adobe:          <AdobeLogo />,
  Nvidia:         <NvidiaLogo />,
  "Goldman Sachs":<GoldmanSachsLogo />,
  JPMorgan:       <JPMorganLogo />,
  McKinsey:       <McKinseyLogo />,
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
