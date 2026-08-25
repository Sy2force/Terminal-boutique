import { createFileRoute } from "@tanstack/react-router";
import { listAdminDeliveryZones } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/livraison")({
  loader: async () => listAdminDeliveryZones(),
  component: AdminDelivery,
});

function AdminDelivery() {
  const zones = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-cream">Zones de livraison</h1>
      <div className="overflow-x-auto border border-primary/10 rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Nom</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Ville</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Rayon</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Min. commande</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Frais</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={z.id} className="border-b border-border/40">
                <td className="p-4 text-cream">{z.name}</td>
                <td className="p-4 text-muted-foreground">{z.city}</td>
                <td className="p-4 text-muted-foreground">{z.radius_km} km</td>
                <td className="p-4 text-primary">{Number(z.min_order).toLocaleString("fr-FR")} ₪</td>
                <td className="p-4 text-primary">{Number(z.fee).toLocaleString("fr-FR")} ₪</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
