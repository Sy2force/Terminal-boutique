import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/compte")({
  component: AccountDashboard,
});

function AccountDashboard() {
  const { user } = Route.useRouteContext();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl text-cream">Mon compte</h1>
      <p className="text-muted-foreground font-light">Bienvenue, {user.email}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Mes commandes", to: "/compte/commandes" },
          { label: "Favoris", to: "/compte/favoris" },
          { label: "Liste d''envies", to: "/compte/envies" },
          { label: "Modifier profil", to: "/compte/profil" },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="card-luxe p-6 rounded-[2px] text-center text-cream hover:text-primary transition-colors text-[11px] uppercase tracking-[0.25em]"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
