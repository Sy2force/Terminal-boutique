import { createFileRoute } from "@tanstack/react-router";
import { getDashboardStats } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: async () => getDashboardStats(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = Route.useLoaderData();

  return (
    <div className="space-y-10">
      <h1 className="font-display text-3xl md:text-4xl text-cream">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Commandes aujourd''hui", value: stats.ordersToday },
          { label: "À préparer", value: stats.pendingOrders },
          { label: "Non payées", value: stats.unpaidOrders },
          { label: "Ruptures de stock", value: stats.lowStock },
        ].map((s) => (
          <div key={s.label} className="card-luxe p-6 rounded-[2px]">
            <p className="eyebrow block mb-2">{s.label}</p>
            <p className="font-display text-3xl text-cream">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-2xl text-cream mb-6">Dernières commandes</h2>
        <div className="overflow-x-auto border border-primary/10 rounded-[2px]">
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
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border/40">
                  <td className="p-4 text-cream">{o.order_number}</td>
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
