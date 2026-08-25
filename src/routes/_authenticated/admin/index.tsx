import { createFileRoute, Link } from "@tanstack/react-router";
import { getDashboardStats } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: async () => getDashboardStats(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = Route.useLoaderData();

  const cards = [
    { label: "Commandes aujourd'hui", value: stats.ordersToday, href: "/admin/commandes" },
    { label: "À préparer", value: stats.pendingOrders, href: "/admin/commandes" },
    { label: "Non payées", value: stats.unpaidOrders, href: "/admin/commandes" },
    { label: "Ruptures de stock", value: stats.lowStock, href: "/admin/produits" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm mt-2 font-light">Vue d'ensemble de l'activité et des alertes.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s) => (
          <Link key={s.label} to={s.href} className="card-luxe p-6 rounded-[2px] hover:card-luxe-hover block">
            <p className="eyebrow block mb-2">{s.label}</p>
            <p className="font-display text-4xl text-gold-soft">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="card-luxe rounded-[2px] overflow-hidden">
        <div className="p-6 border-b border-primary/10 flex items-center justify-between">
          <h2 className="font-display text-2xl text-cream">Dernières commandes</h2>
          <Link to="/admin/commandes" className="text-[11px] uppercase tracking-[0.2em] text-gold hover:text-primary transition-colors">
            Voir tout →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/20">
              <tr>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">N°</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Client</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Total</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o: any) => (
                <tr key={o.id} className="border-b border-border/40 last:border-0">
                  <td className="p-4 text-cream">
                    <Link to="/admin/commandes/$id" params={{ id: o.id }} className="hover:text-gold transition-colors">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">{o.customer_name}</td>
                  <td className="p-4 text-primary">{Number(o.total).toLocaleString("fr-FR")} ₪</td>
                  <td className="p-4 text-muted-foreground uppercase text-xs tracking-wider">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
