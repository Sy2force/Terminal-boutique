import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Heart, List, User, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/compte")({
  component: AccountDashboard,
});

function AccountDashboard() {
  const { user } = Route.useRouteContext();

  const firstName = (user.email ?? "").split("@")[0];

  const links = [
    { label: "Mes commandes", to: "/compte/commandes", icon: Package, desc: "Historique et suivi" },
    { label: "Favoris", to: "/compte/favoris", icon: Heart, desc: "Produits aimés" },
    { label: "Liste d'envies", to: "/compte/envies", icon: List, desc: "À commander plus tard" },
    { label: "Profil", to: "/compte/profil", icon: User, desc: "Coordonnées" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Mon compte</h1>
        <p className="text-muted-foreground font-light mt-2">
          Bienvenue, <span className="text-gold-soft">{firstName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className="group card-luxe p-6 rounded-[2px] hover:card-luxe-hover flex items-center gap-5"
            >
              <div className="p-3 border border-primary/20 text-primary group-hover:text-cream group-hover:bg-primary/10 transition-colors rounded-[2px]">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-cream text-[11px] uppercase tracking-[0.25em] group-hover:text-gold transition-colors">{l.label}</p>
                <p className="text-muted-foreground text-xs font-light mt-1">{l.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
