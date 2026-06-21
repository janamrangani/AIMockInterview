// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 prose prose-sm">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mb-8">Last updated: June 2026</p>

      <section className="space-y-6 text-sm text-foreground leading-relaxed">
        <div>
          <h2 className="font-semibold text-base mb-2">What we collect</h2>
          <p>We collect your email address when you sign up, your interview session data (questions, answers, feedback), and payment information processed securely through Stripe. We do not store credit card details.</p>
        </div>
        <div>
          <h2 className="font-semibold text-base mb-2">How we use it</h2>
          <p>Your data is used solely to provide the mock interview service — generating questions, scoring answers, and producing Countdown Kit documents. We do not sell your data or use it for advertising.</p>
        </div>
        <div>
          <h2 className="font-semibold text-base mb-2">Third-party services</h2>
          <p>We use Supabase (database and auth), Stripe (payments), OpenAI (AI generation), and Vercel (hosting). Each has their own privacy policy.</p>
        </div>
        <div>
          <h2 className="font-semibold text-base mb-2">Data retention</h2>
          <p>Your session history and generated documents are retained as long as your account is active. You can request deletion at any time by emailing us.</p>
        </div>
        <div>
          <h2 className="font-semibold text-base mb-2">Contact</h2>
          <p>Questions? Email janamrangani@gmail.com</p>
        </div>
      </section>
    </main>
  );
}
