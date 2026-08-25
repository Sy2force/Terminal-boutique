import { createFileRoute, Link } from "@tanstack/react-router";
import { listAdminOrders } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/commandes/")({
  loader: async () => listAdminOrders({ data: {} }),
  component: AdminOrders,
});

function AdminOrders() {
  const orders = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-cream">Commandes</h1>
      <div className="overflow-x-auto border border-primary/10 rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">N°</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Client</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Total</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Statut</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Alcool</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border/40">
                <td className="p-4">
                  <Link to="/admin/commandes/$id" params={{ id: o.id }} className="text-cream hover:text-gold transition-colors">
                    {o.order_number}
                  </Link>
                </td>
                <td className="p-4 text-muted-foreground">{o.customer_name}</td>
                <td className="p-4 text-primary">{Number(o.total).toLocaleString("fr-FR")} ₪</td>
                <td className="p-4 text-muted-foreground uppercase text-xs">{o.status}</td>
                <td className="p-4 text-muted-foreground">{o.contains_alcohol ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
