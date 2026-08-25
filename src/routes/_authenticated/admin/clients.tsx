import { createFileRoute } from "@tanstack/react-router";
import { listAdminClients } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/clients")({
  loader: async () => listAdminClients(),
  component: AdminClients,
});

function AdminClients() {
  const clients = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-cream">Clients</h1>
      <div className="overflow-x-auto border border-primary/10 rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Nom</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">E-mail</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Téléphone</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Commandes</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-border/40">
                <td className="p-4 text-cream">{c.full_name}</td>
                <td className="p-4 text-muted-foreground">{c.email}</td>
                <td className="p-4 text-muted-foreground">{c.phone}</td>
                <td className="p-4 text-primary">{Array.isArray(c.orders) ? c.orders.length : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
