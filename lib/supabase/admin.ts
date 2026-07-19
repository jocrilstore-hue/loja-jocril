import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS. Server-side only — importing this from a
// client component fails the build via "server-only". Every route that uses it
// MUST enforce its own authorization first (Clerk ownership, admin allowlist,
// order capability token, or webhook secret) — see the route authorization
// matrix in AI_OS/SESSION-PROMPTS/SESSIONS/2026-07-18/2026-07-19_correction-execution-plan-v2.md.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (Supabase project settings → API)."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Semantic alias: "service client" reads better at call sites that are not
// admin backoffice (checkout, payments, webhook) but still need service-role
// after their own authorization check.
export const createServiceClient = createAdminClient;
