import "./globals.css";

export const metadata = {
  title: "AI Mock Interview",
  description: "Practice real interview questions, with adaptive follow-ups, calibrated to your target company.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
