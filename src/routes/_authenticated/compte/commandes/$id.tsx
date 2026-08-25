import { createFileRoute } from "@tanstack/react-router";
import { getMyOrder } from "@/lib/functions/client.functions";

export const Route = createFileRoute("/_authenticated/compte/commandes/$id")({
  loader: async ({ params }) => getMyOrder({ data: params.id }),
  component: MyOrderDetail,
});

function MyOrderDetail() {
  const order = Route.useLoaderData() as any;

  const statusSteps = ["pending", "confirmed", "ready", "completed"];
  const currentIndex = statusSteps.indexOf(order.status);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Commande {order.order_number}</h1>
        <p className="text-muted-foreground text-sm mt-2 font-light">
          {new Date(order.created_at).toLocaleString("fr-FR")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Total</p>
          <p className="font-display text-3xl text-gold-soft">{Number(order.total).toLocaleString("fr-FR")} ₪</p>
        </div>
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Mode</p>
          <p className="font-display text-3xl text-cream">{order.fulfillment === "pickup" ? "Retrait" : "Livraison"}</p>
        </div>
        <div className="card-luxe p-6 rounded-[2px]">
          <p className="eyebrow block mb-2">Statut</p>
          <p className="font-display text-3xl text-cream">{order.status}</p>
        </div>
      </div>

      {order.contains_alcohol && (
        <div className="bg-bordeaux/10 border border-bordeaux/30 p-6 rounded-[2px]">
          <p className="text-cream text-sm">
            Votre commande contient de l'alcool. La Teoudat Zeout (pièce d'identité) est obligatoire au retrait ou à la livraison.
          </p>
        </div>
      )}

      <div className="card-luxe p-6 md:p-8 rounded-[2px] space-y-6">
        <h2 className="font-display text-2xl text-cream">Lignes de commande</h2>
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between py-3 border-b border-border/40 text-sm">
              <span className="text-cream">{item.product_name} × {item.quantity}</span>
              <span className="text-primary">{Number(item.line_total).toLocaleString("fr-FR")} ₪</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-luxe p-6 md:p-8 rounded-[2px] space-y-6">
        <h2 className="font-display text-2xl text-cream">Suivi</h2>
        <div className="relative flex items-center justify-between">
          {statusSteps.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2 z-10">
              <div className={`w-3 h-3 rounded-full ${i <= currentIndex ? "bg-primary" : "bg-muted"}`} />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{step}</span>
            </div>
          ))}
          <div className="absolute top-[5px] left-0 right-0 h-px bg-muted -z-0" />
        </div>
        <div className="space-y-4">
          {order.events?.map((e: any) => (
            <div key={e.id} className="flex gap-4 text-sm text-muted-foreground font-light">
              <span className="text-primary">{new Date(e.created_at).toLocaleString("fr-FR")}</span>
              <span>{e.from_status ? `${e.from_status} → ${e.to_status}` : e.to_status}</span>
              {e.comment && <span className="italic">— {e.comment}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
