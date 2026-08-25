import { createFileRoute, Link } from "@tanstack/react-router";
import { listMyOrders } from "@/backend/functions/client.functions";

export const Route = createFileRoute("/_authenticated/compte/commandes/")({
  loader: async () => listMyOrders(),
  component: MyOrders,
});

function MyOrders() {
  const orders = Route.useLoaderData() as any[];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Mes commandes</h1>
        <p className="text-muted-foreground text-sm mt-2 font-light">Historique et suivi de vos commandes.</p>
      </div>
      {orders.length === 0 ? (
        <div className="card-luxe p-10 rounded-[2px] text-center">
          <p className="text-muted-foreground font-light">Aucune commande pour le moment.</p>
          <Link to="/vins" className="inline-block mt-6 btn-gold btn-gold-hover px-8 py-3 text-[11px] uppercase tracking-[0.3em]">
            Découvrir la cave
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto card-luxe rounded-[2px]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/20">
              <tr>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">N°</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Date</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Total</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Mode</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Statut</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Paiement</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="border-b border-border/40 last:border-0">
                  <td className="p-4">
                    <Link to="/compte/commandes/$id" params={{ id: o.id }} className="text-cream hover:text-gold transition-colors">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="p-4 text-primary">{Number(o.total).toLocaleString("fr-FR")} ₪</td>
                  <td className="p-4 text-muted-foreground">{o.fulfillment === "pickup" ? "Retrait" : "Livraison"}</td>
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
