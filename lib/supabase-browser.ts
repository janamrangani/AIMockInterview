// lib/supabase-browser.ts
import { createClient } from "@supabase/supabase-js";

// Browser-side Supabase client — safe to use in Client Components.
// Uses the anon key (not the service role key). Session is stored in localStorage.
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
