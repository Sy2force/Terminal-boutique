import { createFileRoute } from "@tanstack/react-router";
import { listAdminBanners } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/banderoles")({
  loader: async () => listAdminBanners(),
  component: AdminBanners,
});

function AdminBanners() {
  const banners = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-cream">Banderoles</h1>
      <div className="overflow-x-auto border border-primary/10 rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Emplacement</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Titre</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Thème</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Active</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-b border-border/40">
                <td className="p-4 text-muted-foreground uppercase text-xs">{b.placement}</td>
                <td className="p-4 text-cream">{b.title}</td>
                <td className="p-4 text-primary">{b.theme}</td>
                <td className="p-4 text-muted-foreground">{b.active ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
