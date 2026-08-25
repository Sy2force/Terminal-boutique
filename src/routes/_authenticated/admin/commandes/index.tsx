import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { listAdminOrders } from "@/lib/functions/admin.functions";

const statuses = ["pending", "confirmed", "ready", "out_for_delivery", "completed", "cancelled"];

export const Route = createFileRoute("/_authenticated/admin/commandes/")({
  loader: async () => listAdminOrders({ data: {} }),
  component: AdminOrders,
});

function AdminOrders() {
  const orders = Route.useLoaderData() as any[];
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders
      .filter((o) => (status ? o.status === status : true))
      .filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q)
      );
  }, [orders, search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Commandes</h1>
          <p className="text-muted-foreground text-sm mt-2 font-light">{orders.length} commande(s) dont {orders.filter((o) => o.status === "pending").length} en attente.</p>
        </div>
        <Link
          to="/admin/commande-telephone"
          className="btn-gold btn-gold-hover px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-center"
        >
          Commande téléphone
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher n°, client, téléphone"
          className="md:col-span-2 input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
        >
          <option value="">Tous les statuts</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto card-luxe rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">N°</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Date</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Client</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Mode</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Total</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Statut</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Paiement</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-border/40 last:border-0">
                <td className="p-4">
                  <Link to="/admin/commandes/$id" params={{ id: o.id }} className="text-cream hover:text-gold transition-colors">
                    {o.order_number}
                  </Link>
                </td>
                <td className="p-4 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="p-4 text-muted-foreground">{o.customer_name}</td>
                <td className="p-4 text-muted-foreground">{o.fulfillment === "pickup" ? "Retrait" : "Livraison"}</td>
                <td className="p-4 text-primary">{Number(o.total).toLocaleString("fr-FR")} ₪</td>
                <td className="p-4 text-muted-foreground uppercase text-xs">{o.status}</td>
                <td className="p-4 text-muted-foreground">{o.payment_status === "paid" ? "Payé" : "À payer"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
