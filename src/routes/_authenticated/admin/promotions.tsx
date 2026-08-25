import { createFileRoute } from "@tanstack/react-router";
import { listAdminPromotions } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/promotions")({
  loader: async () => listAdminPromotions(),
  component: AdminPromotions,
});

function AdminPromotions() {
  const promotions = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-cream">Promotions</h1>
      <div className="overflow-x-auto border border-primary/10 rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Nom</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Type</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Valeur</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Active</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((p) => (
              <tr key={p.id} className="border-b border-border/40">
                <td className="p-4 text-cream">{p.name}</td>
                <td className="p-4 text-muted-foreground uppercase text-xs">{p.type}</td>
                <td className="p-4 text-primary">{Number(p.value).toLocaleString("fr-FR")}</td>
                <td className="p-4 text-muted-foreground">{p.active ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
