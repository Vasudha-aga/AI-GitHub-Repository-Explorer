import { createClient } from "@supabase/supabase-js";

const PLACEHOLDER_VALUES = [
  "https://your-project-id.supabase.co",
  "your-anon-key-here",
  "your-service-role-key-here",
  "",
  undefined,
];

function isConfigured(val) {
  return val && !PLACEHOLDER_VALUES.includes(val);
}

export const supabaseConfigured =
  isConfigured(process.env.SUPABASE_URL) &&
  isConfigured(process.env.SUPABASE_ANON_KEY) &&
  isConfigured(process.env.SUPABASE_SERVICE_ROLE_KEY);

// Only create clients if Supabase is actually configured
export const supabase = supabaseConfigured
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export const supabaseAnon = supabaseConfigured
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  : null;

if (!supabaseConfigured) {
  console.log("⚠️  Supabase not configured — using local JSON database (db.json)");
}
