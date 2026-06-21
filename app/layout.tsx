import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Nav from "@/app/components/nav";
import Footer from "@/app/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "InterviewAI — Practice interviews that actually prepare you",
  description:
    "Real questions calibrated to your target company, adaptive AI follow-ups, and honest feedback — so you walk in confident.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
