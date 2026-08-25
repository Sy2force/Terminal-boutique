import { createFileRoute, Link } from "@tanstack/react-router";
import { listMyOrders } from "@/lib/functions/client.functions";

export const Route = createFileRoute("/_authenticated/compte/commandes/")({
  loader: async () => listMyOrders(),
  component: MyOrders,
});

function MyOrders() {
  const orders = Route.useLoaderData();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-cream">Mes commandes</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground font-light">Aucune commande pour le moment.</p>
      ) : (
        <div className="overflow-x-auto border border-primary/10 rounded-[2px]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/20">
              <tr>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">N°</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Date</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Total</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Statut</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Paiement</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="border-b border-border/40">
                  <td className="p-4">
                    <Link to="/compte/commandes/$id" params={{ id: o.id }} className="text-cream hover:text-gold transition-colors">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="p-4 text-primary">{Number(o.total).toLocaleString("fr-FR")} ₪</td>
                  <td className="p-4 text-muted-foreground uppercase text-xs">{o.status}</td>
                  <td className="p-4 text-muted-foreground">{o.payment_status === "paid" ? "Payé" : "À payer sur place"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
