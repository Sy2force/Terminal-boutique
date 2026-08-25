import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/functions/auth.functions";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { user } = await getSession();
    if (!user) throw redirect({ to: "/auth" });
    return { user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();
  return (
    <div className="min-h-screen pt-[4.5rem]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-[0.2em]">
          Connecté : {user.email}
        </p>
        <Outlet />
      </div>
    </div>
  );
}
