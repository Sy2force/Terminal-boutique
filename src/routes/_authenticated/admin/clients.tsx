import { createFileRoute, Link } from "@tanstack/react-router";
import { listAdminClients } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/clients")({
  loader: async () => listAdminClients(),
  component: AdminClients,
});

function AdminClients() {
  const clients = Route.useLoaderData() as any[];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Clients</h1>
        <p className="text-muted-foreground text-sm mt-2 font-light">{clients.length} compte(s) enregistré(s).</p>
      </div>
      <div className="overflow-x-auto card-luxe rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Nom</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">E-mail</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Téléphone</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Inscription</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Commandes</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-border/40 last:border-0">
                <td className="p-4 text-cream">{c.full_name || "—"}</td>
                <td className="p-4 text-muted-foreground">{c.email}</td>
                <td className="p-4 text-muted-foreground">{c.phone || "—"}</td>
                <td className="p-4 text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="p-4 text-primary">
                  {Array.isArray(c.orders) ? (
                    <Link to="/admin/commandes" className="hover:text-gold transition-colors">
                      {c.orders.length} commande{c.orders.length > 1 ? "s" : ""}
                    </Link>
                  ) : (
                    0
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
