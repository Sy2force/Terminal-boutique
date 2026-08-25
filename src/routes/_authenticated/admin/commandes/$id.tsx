import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAdminOrder, updateOrderStatus, confirmIdChecked, markOrderPaid, cancelOrder } from "@/lib/functions/admin.functions";
import type { Database } from "@/types/database";

type PaymentMethod = Database["public"]["Enums"]["payment_method"];

const paymentMethods = [
  { value: "cash", label: "Espèces" },
  { value: "card_in_store", label: "CB en boutique" },
  { value: "card_on_delivery", label: "CB à la livraison" },
  { value: "bank_transfer", label: "Virement" },
];

export const Route = createFileRoute("/_authenticated/admin/commandes/$id")({
  loader: async ({ params }) => getAdminOrder({ data: params.id }),
  component: AdminOrderDetail,
});

function AdminOrderDetail() {
  const order = Route.useLoaderData() as any;
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const updateStatus = useServerFn(updateOrderStatus);
  const checkId = useServerFn(confirmIdChecked);
  const paid = useServerFn(markOrderPaid);
  const cancel = useServerFn(cancelOrder);

  const canComplete = order.payment_status === "paid" && (!order.contains_alcohol || order.id_checked);

  const reload = () => window.location.reload();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Commande {order.order_number}</h1>
          <p className="text-muted-foreground text-sm mt-1 font-light">
            {new Date(order.created_at).toLocaleString("fr-FR")} · {order.channel}
          </p>
        </div>
        <span className="w-fit px-4 py-2 border border-primary/20 text-primary text-xs uppercase tracking-[0.2em] rounded-[2px]">
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Total</p>
          <p className="font-display text-3xl text-gold-soft">{Number(order.total).toLocaleString("fr-FR")} ₪</p>
        </div>
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Paiement</p>
          <p className="font-display text-3xl text-cream">{order.payment_status === "paid" ? "Payé" : "À payer"}</p>
        </div>
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Teoudat Zeout</p>
          <p className="font-display text-3xl text-cream">{order.id_checked ? "Vérifiée" : order.contains_alcohol ? "Requise" : "N/A"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="card-luxe p-6 md:p-8 rounded-[2px] space-y-4">
          <h2 className="font-display text-2xl text-cream">Client</h2>
          <div className="text-sm space-y-2 text-muted-foreground font-light">
            <p><span className="text-primary">Nom :</span> {order.customer_name}</p>
            <p><span className="text-primary">Téléphone :</span> {order.customer_phone}</p>
            {order.customer_email && <p><span className="text-primary">E-mail :</span> {order.customer_email}</p>}
          </div>
          <div className="border-t border-primary/10 pt-4">
            <p className="text-sm text-muted-foreground font-light">
              <span className="text-primary">Mode :</span> {order.fulfillment === "delivery" ? "Livraison" : "Retrait en magasin"}
            </p>
            {order.fulfillment === "delivery" && (
              <p className="text-sm text-muted-foreground font-light mt-1">
                {order.address}, {order.city} {order.postal_code}
              </p>
            )}
            {order.requested_slot && (
              <p className="text-sm text-muted-foreground font-light mt-1">
                <span className="text-primary">Créneau :</span> {order.requested_slot}
              </p>
            )}
            {order.notes && (
              <p className="text-sm text-muted-foreground font-light mt-1">
                <span className="text-primary">Note :</span> {order.notes}
              </p>
            )}
          </div>
        </div>

        <div className="card-luxe p-6 md:p-8 rounded-[2px] space-y-6">
          <h2 className="font-display text-2xl text-cream">Actions</h2>

          {order.contains_alcohol && !order.id_checked && (
            <button
              onClick={() => checkId({ data: order.id }).then(reload)}
              className="w-full btn-gold btn-gold-hover px-6 py-3 text-[11px] uppercase tracking-[0.3em]"
            >
              Pièce d'identité vérifiée (Teoudat Zeout)
            </button>
          )}

          {order.payment_status !== "paid" && (
            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.25em] text-primary">Mode de paiement</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
              >
                {paymentMethods.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <button
                onClick={() => paid({ data: { id: order.id, method: paymentMethod as PaymentMethod } }).then(reload)}
                className="w-full border border-primary/50 text-primary px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Marquer comme payé
              </button>
            </div>
          )}

          <button
            disabled={!canComplete}
            onClick={() => updateStatus({ data: { id: order.id, status: "completed" } }).then(reload)}
            className={`w-full px-6 py-3 text-[11px] uppercase tracking-[0.3em] ${
              canComplete
                ? "bg-gold text-primary-foreground hover:opacity-90 transition-opacity"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Commande remise / récupérée
          </button>

          {!canComplete && (
            <p className="text-destructive text-sm">
              {order.contains_alcohol && !order.id_checked && "Teoudat Zeout requise. "}
              {order.payment_status !== "paid" && "Paiement requis."}
            </p>
          )}

          {!showCancel && order.status !== "completed" && order.status !== "cancelled" && (
            <button
              onClick={() => setShowCancel(true)}
              className="text-destructive text-xs uppercase tracking-wider hover:text-cream transition-colors"
            >
              Annuler la commande
            </button>
          )}

          {showCancel && (
            <div className="space-y-3 border-t border-primary/10 pt-4">
              <label className="block text-[11px] uppercase tracking-[0.25em] text-primary">Motif d'annulation</label>
              <input
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Stock indisponible..."
                className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
              />
              <button
                disabled={!cancelReason.trim()}
                onClick={() => cancel({ data: { id: order.id, reason: cancelReason } }).then(reload)}
                className="w-full border border-destructive text-destructive px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-destructive hover:text-primary-foreground transition-colors disabled:opacity-50"
              >
                Confirmer l'annulation
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card-luxe p-6 md:p-8 rounded-[2px] space-y-6">
        <h2 className="font-display text-2xl text-cream">Lignes de commande</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/20">
              <tr>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Produit</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Prix unitaire</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Qté</th>
                <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any) => (
                <tr key={item.id} className="border-b border-border/40 last:border-0">
                  <td className="p-4 text-cream">{item.product_name}</td>
                  <td className="p-4 text-muted-foreground">{Number(item.unit_price).toLocaleString("fr-FR")} ₪</td>
                  <td className="p-4 text-muted-foreground">{item.quantity}</td>
                  <td className="p-4 text-primary text-right">{Number(item.line_total).toLocaleString("fr-FR")} ₪</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {order.events?.length > 0 && (
        <div className="card-luxe p-6 md:p-8 rounded-[2px] space-y-4">
          <h2 className="font-display text-2xl text-cream">Historique</h2>
          <ul className="space-y-3 text-sm text-muted-foreground font-light">
            {order.events.map((e: any) => (
              <li key={e.id} className="flex items-start gap-4">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-cream">{e.event_type}</p>
                  <p className="text-xs">{new Date(e.created_at).toLocaleString("fr-FR")}</p>
                  {e.note && <p className="text-xs mt-1">{e.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
