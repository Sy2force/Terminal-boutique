import { createFileRoute } from "@tanstack/react-router";
import { getMyOrder } from "@/lib/functions/client.functions";

export const Route = createFileRoute("/_authenticated/compte/commandes/$id")({
  loader: async ({ params }) => getMyOrder({ data: params.id }),
  component: MyOrderDetail,
});

function MyOrderDetail() {
  const order = Route.useLoaderData();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-cream">Commande {order.order_number}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Total</p>
          <p className="font-display text-2xl text-cream">{Number(order.total).toLocaleString("fr-FR")} ₪</p>
        </div>
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Mode</p>
          <p className="font-display text-2xl text-cream">{order.fulfillment === "pickup" ? "Retrait" : "Livraison"}</p>
        </div>
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Statut</p>
          <p className="font-display text-2xl text-cream">{order.status}</p>
        </div>
      </div>
      {order.contains_alcohol && (
        <div className="bg-bordeaux/10 border border-bordeaux/30 p-6 rounded-[2px]">
          <p className="text-cream text-sm">
            Votre commande contient de l''alcool. La Teoudat Zeout (pièce d''identité) est obligatoire au retrait ou à la livraison.
          </p>
        </div>
      )}
      <div>
        <h2 className="font-display text-2xl text-cream mb-6">Lignes</h2>
        {order.items.map((item: any) => (
          <div key={item.id} className="flex justify-between py-3 border-b border-border/40 text-sm">
            <span className="text-cream">{item.product_name} × {item.quantity}</span>
            <span className="text-primary">{Number(item.line_total).toLocaleString("fr-FR")} ₪</span>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <h2 className="font-display text-2xl text-cream">Suivi</h2>
        {order.events?.map((e: any) => (
          <div key={e.id} className="flex gap-4 text-sm text-muted-foreground">
            <span>{new Date(e.created_at).toLocaleDateString("fr-FR")}</span>
            <span>{e.from_status ? `${e.from_status} → ${e.to_status}` : e.to_status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
