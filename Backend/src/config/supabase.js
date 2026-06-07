import { createClient } from "@supabase/supabase-js";

// Use service-role key so backend can bypass RLS when needed
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Anon client — used when acting as the user (respects RLS)
export const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
