// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Server-side client — used inside API routes only.
// Never expose the service role key to the browser.
export function getSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
