import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { getSession } from "@/lib/functions/auth.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { role } = await getSession();
    if (role !== "admin") {
      return { forbidden: true };
    }
    return { forbidden: false };
  },
  component: AdminLayout,
});

const links = [
  { label: "Dashboard", to: "/admin" },
  { label: "Produits", to: "/admin/produits" },
  { label: "Médias", to: "/admin/medias" },
  { label: "Promotions", to: "/admin/promotions" },
  { label: "Banderoles", to: "/admin/banderoles" },
  { label: "Pages", to: "/admin/pages" },
  { label: "Commandes", to: "/admin/commandes" },
  { label: "Téléphone", to: "/admin/commande-telephone" },
  { label: "Livraison", to: "/admin/livraison" },
  { label: "Clients", to: "/admin/clients" },
];

function AdminLayout() {
  const { forbidden } = Route.useRouteContext();
  if (forbidden) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-3xl text-cream mb-4">Accès refusé</h1>
        <p className="text-muted-foreground font-light mb-8">Vous n''avez pas les droits pour accéder à cet espace.</p>
        <Link to="/" className="bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em]">
          Retour à l''accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
      <aside className="space-y-2 lg:sticky lg:top-28 h-fit">
        <p className="eyebrow mb-4">Admin</p>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeProps={{ className: "text-primary border-primary/50 bg-primary/10" }}
            className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground border border-transparent px-3 py-2 hover:text-primary hover:border-primary/30 transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
