import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Nav from "@/app/components/nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "AI Mock Interview",
  description:
    "Practice real interview questions, with adaptive follow-ups, calibrated to your target company.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-background text-foreground">
        <Nav />
        {children}
      </body>
    </html>
  );
}
