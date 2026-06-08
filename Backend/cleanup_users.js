import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(".env") });

import { supabase } from "./src/config/supabase.js";

async function run() {
  if (!supabase) return console.log("Supabase not configured");
  console.log("Cleaning up users table...");
  const { data, error } = await supabase.from("users").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    console.error("Cleanup failed:", error);
  } else {
    console.log("Cleanup succeeded.");
  }
}
run();
