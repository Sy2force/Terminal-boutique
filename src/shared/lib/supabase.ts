import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) {
    // Allow rendering even when Supabase env vars are not configured yet.
    return null;
  }
  return createBrowserClient(url, key);
}
