import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getPublicSupabase() {
  if (!url || !anonKey) {
    throw new Error("SUPABASE_URL et SUPABASE_ANON_KEY sont requis");
  }
  return createClient(url, anonKey);
}

export function getAdminSupabase() {
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis");
  }
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
