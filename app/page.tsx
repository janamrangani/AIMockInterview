import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "80px auto", padding: "0 24px", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>AI Mock Interview</h1>
      <p style={{ fontSize: 18, color: "#555", marginTop: 12 }}>
        Practice real interview questions, with adaptive follow-ups, calibrated to your target company.
      </p>
      <Link
        href="/login"
        style={{
          display: "inline-block",
          marginTop: 32,
          padding: "12px 24px",
          background: "#111",
          color: "#fff",
          borderRadius: 6,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Get started →
      </Link>
    </main>
  );
}
