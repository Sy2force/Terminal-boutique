import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

function createAuthSupabase(cookieHeader: string) {
  if (!url || !anonKey) throw new Error("SUPABASE_URL ou SUPABASE_ANON_KEY manquant");
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(cookieHeader);
      },
      setAll() {
        // Server functions do not set cookies back to the browser.
      },
    },
  });
}

export const requireSupabaseAuth = createMiddleware().server(async ({ next }) => {
  const request = getRequest();
  const cookieHeader = request?.headers.get("cookie") ?? "";
  const supabase = createAuthSupabase(cookieHeader);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Non authentifié");
  }

  return next({ context: { user, supabase } });
});

export const requireAdmin = createMiddleware().server(async ({ next, context }) => {
  const { user, supabase } = context as any;
  const { data: isAdmin, error } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });

  if (error || !isAdmin) {
    throw new Error("Accès refusé");
  }

  return next({ context: { user, supabase, role: "admin" as const } });
});
