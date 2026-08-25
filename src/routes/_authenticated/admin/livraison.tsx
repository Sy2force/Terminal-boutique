import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listAdminDeliveryZones, upsertDeliveryZone, deleteDeliveryZone } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/livraison")({
  loader: async () => listAdminDeliveryZones(),
  component: AdminDelivery,
});

const empty = () => ({
  id: undefined as string | undefined,
  name: "",
  city: "Jérusalem",
  radius_km: 5,
  postal_codes: "",
  min_order: 150,
  fee: 25,
  active: true,
});

function AdminDelivery() {
  const zones = Route.useLoaderData();
  const [editing, setEditing] = useState<ReturnType<typeof empty> | null>(null);
  const mutate = useServerFn(upsertDeliveryZone);
  const remove = useServerFn(deleteDeliveryZone);

  const startEdit = (z: any) =>
    setEditing({
      id: z.id,
      name: z.name,
      city: z.city,
      radius_km: z.radius_km,
      postal_codes: Array.isArray(z.postal_codes) ? z.postal_codes.join(", ") : "",
      min_order: z.min_order,
      fee: z.fee,
      active: z.active,
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...editing,
      radius_km: Number(editing.radius_km),
      min_order: Number(editing.min_order),
      fee: Number(editing.fee),
      postal_codes: editing.postal_codes.split(",").map((s) => s.trim()).filter(Boolean),
    };
    await mutate({ data: { id: editing.id, zone: payload as any } });
    setEditing(null);
    window.location.reload();
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer cette zone ?")) return;
    await remove({ data: id });
    window.location.reload();
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Zones de livraison</h1>
        <button onClick={() => setEditing(empty())} className="btn-gold btn-gold-hover px-6 py-3 text-[11px] uppercase tracking-[0.3em]">Ajouter</button>
      </div>

      <div className="overflow-x-auto card-luxe rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Nom</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Ville</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Rayon</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Min. commande</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Frais</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z: any) => (
              <tr key={z.id} className="border-b border-border/40 last:border-0">
                <td className="p-4 text-cream">{z.name}</td>
                <td className="p-4 text-muted-foreground">{z.city}</td>
                <td className="p-4 text-muted-foreground">{z.radius_km} km</td>
                <td className="p-4 text-primary">{Number(z.min_order).toLocaleString("fr-FR")} ₪</td>
                <td className="p-4 text-primary">{Number(z.fee).toLocaleString("fr-FR")} ₪</td>
                <td className="p-4 space-x-3">
                  <button onClick={() => startEdit(z)} className="text-gold hover:text-cream text-xs uppercase tracking-wider">Modifier</button>
                  <button onClick={() => del(z.id)} className="text-destructive hover:text-cream text-xs uppercase tracking-wider">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <form onSubmit={submit} className="card-luxe p-6 md:p-8 rounded-[2px] space-y-6 max-w-4xl">
          <h2 className="font-display text-2xl text-cream">{editing.id ? "Modifier" : "Nouvelle"} zone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Nom" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Field label="Ville" value={editing.city} onChange={(v) => setEditing({ ...editing, city: v })} />
            <Field label="Rayon (km)" type="number" value={editing.radius_km} onChange={(v) => setEditing({ ...editing, radius_km: Number(v) })} />
            <Field label="Min. commande" type="number" value={editing.min_order} onChange={(v) => setEditing({ ...editing, min_order: Number(v) })} />
            <Field label="Frais" type="number" value={editing.fee} onChange={(v) => setEditing({ ...editing, fee: Number(v) })} />
            <Field label="Codes postaux (séparés par ,)" value={editing.postal_codes} onChange={(v) => setEditing({ ...editing, postal_codes: v })} />
          </div>
          <label className="flex items-center gap-3 text-muted-foreground text-sm">
            <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="accent-primary w-4 h-4" /> Active
          </label>
          <div className="flex gap-4">
            <button type="submit" className="btn-gold btn-gold-hover px-8 py-3 text-[11px] uppercase tracking-[0.3em]">Enregistrer</button>
            <button type="button" onClick={() => setEditing(null)} className="border border-primary/30 text-muted-foreground px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:border-primary hover:text-primary transition-colors">Annuler</button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
    </div>
  );
}
