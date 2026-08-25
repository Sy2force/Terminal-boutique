import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { getPublicSupabase } from "@/backend/supabase-server";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  if (!url || !anonKey) throw new Error("Supabase not configured");
  const request = getRequest();
  const cookieHeader = request?.headers.get("cookie") ?? "";
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(cookieHeader);
      },
      setAll() {},
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { user: null, role: null };

  const publicClient = getPublicSupabase();
  const { data: role } = await publicClient.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });

  return { user: { id: user.id, email: user.email }, role: role ? "admin" : "client" };
});
