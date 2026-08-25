import { createFileRoute } from "@tanstack/react-router";
import { getAdminOrder, updateOrderStatus, confirmIdChecked, markOrderPaid } from "@/lib/functions/admin.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/admin/commandes/$id")({
  loader: async ({ params }) => getAdminOrder({ data: params.id }),
  component: AdminOrderDetail,
});

function AdminOrderDetail() {
  const order = Route.useLoaderData() as any;
  const updateStatus = useServerFn(updateOrderStatus);
  const checkId = useServerFn(confirmIdChecked);
  const paid = useServerFn(markOrderPaid);

  const canComplete =
    order.payment_status === "paid" && (!order.contains_alcohol || order.id_checked);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-cream">Commande {order.order_number}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Total</p>
          <p className="font-display text-2xl text-cream">{Number(order.total).toLocaleString("fr-FR")} ₪</p>
        </div>
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Paiement</p>
          <p className="font-display text-2xl text-cream">{order.payment_status === "paid" ? "Payé" : "À payer"}</p>
        </div>
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Teoudat Zeout</p>
          <p className="font-display text-2xl text-cream">{order.id_checked ? "Vérifiée" : order.contains_alcohol ? "Requise" : "N/A"}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2xl text-cream">Lignes</h2>
        {order.items.map((item: any) => (
          <div key={item.id} className="flex justify-between py-3 border-b border-border/40 text-sm">
            <span className="text-cream">{item.product_name} × {item.quantity}</span>
            <span className="text-primary">{Number(item.line_total).toLocaleString("fr-FR")} ₪</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {order.contains_alcohol && !order.id_checked && (
          <button
            onClick={() => checkId({ data: order.id })}
            className="bg-primary text-primary-foreground px-6 py-3 text-[11px] uppercase tracking-[0.3em]"
          >
            Pièce d''identité vérifiée
          </button>
        )}
        {order.payment_status !== "paid" && (
          <button
            onClick={() => paid({ data: { id: order.id, method: "cash" } })}
            className="border border-primary/50 text-primary px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Marquer comme payé
          </button>
        )}
        <button
          disabled={!canComplete}
          onClick={() => updateStatus({ data: { id: order.id, status: "completed" } })}
          className={`px-6 py-3 text-[11px] uppercase tracking-[0.3em] ${
            canComplete
              ? "bg-gold text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Commande remise / récupérée
        </button>
      </div>
      {!canComplete && (
        <p className="text-destructive text-sm">
          {order.contains_alcohol && !order.id_checked && "Teoudat Zeout requise. "}
          {order.payment_status !== "paid" && "Paiement requis."}
        </p>
      )}
    </div>
  );
}
