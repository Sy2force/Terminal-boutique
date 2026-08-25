import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listAdminPromotions, upsertPromotion, deletePromotion } from "@/lib/functions/admin.functions";

const types = ["percent", "fixed", "special_price", "x_for_y", "bundle"];

export const Route = createFileRoute("/_authenticated/admin/promotions")({
  loader: async () => listAdminPromotions(),
  component: AdminPromotions,
});

const empty = () => ({
  id: undefined as string | undefined,
  name: "",
  subtitle: "",
  type: "percent" as const,
  value: 0,
  quantity: null as number | null,
  department: "",
  category: "",
  product_slugs: "",
  starts_at: new Date().toISOString().slice(0, 16),
  ends_at: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
  active: true,
  members_only: false,
});

function AdminPromotions() {
  const promotions = Route.useLoaderData();
  const [editing, setEditing] = useState<ReturnType<typeof empty> | null>(null);
  const mutate = useServerFn(upsertPromotion);
  const remove = useServerFn(deletePromotion);

  const startEdit = (p: any) =>
    setEditing({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle ?? "",
      type: p.type,
      value: p.value,
      quantity: p.quantity ?? null,
      department: p.department ?? "",
      category: p.category ?? "",
      product_slugs: Array.isArray(p.product_slugs) ? p.product_slugs.join(", ") : "",
      starts_at: p.starts_at ? p.starts_at.slice(0, 16) : "",
      ends_at: p.ends_at ? p.ends_at.slice(0, 16) : "",
      active: p.active,
      members_only: p.members_only,
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...editing,
      value: Number(editing.value),
      quantity: editing.quantity ? Number(editing.quantity) : null,
      product_slugs: editing.product_slugs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      starts_at: new Date(editing.starts_at).toISOString(),
      ends_at: new Date(editing.ends_at).toISOString(),
    };
    await mutate({ data: { id: editing.id, promotion: payload as any } });
    setEditing(null);
    window.location.reload();
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer cette promotion ?")) return;
    await remove({ data: id });
    window.location.reload();
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Promotions</h1>
        <button
          onClick={() => setEditing(empty())}
          className="btn-gold btn-gold-hover px-6 py-3 text-[11px] uppercase tracking-[0.3em]"
        >
          Ajouter
        </button>
      </div>

      <div className="overflow-x-auto card-luxe rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Nom</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Type</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Valeur</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Active</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((p: any) => (
              <tr key={p.id} className="border-b border-border/40 last:border-0">
                <td className="p-4 text-cream">{p.name}</td>
                <td className="p-4 text-muted-foreground uppercase text-xs">{p.type}</td>
                <td className="p-4 text-primary">{Number(p.value).toLocaleString("fr-FR")}</td>
                <td className="p-4 text-muted-foreground">{p.active ? "Oui" : "Non"}</td>
                <td className="p-4 space-x-3">
                  <button onClick={() => startEdit(p)} className="text-gold hover:text-cream text-xs uppercase tracking-wider">Modifier</button>
                  <button onClick={() => del(p.id)} className="text-destructive hover:text-cream text-xs uppercase tracking-wider">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <form onSubmit={submit} className="card-luxe p-6 md:p-8 rounded-[2px] space-y-6 max-w-4xl">
          <h2 className="font-display text-2xl text-cream">{editing.id ? "Modifier" : "Nouvelle"} promotion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Nom" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Field label="Sous-titre" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
            <Select label="Type" value={editing.type} onChange={(v) => setEditing({ ...editing, type: v as any })} options={types} />
            <Field label="Valeur" type="number" value={editing.value} onChange={(v) => setEditing({ ...editing, value: Number(v) })} />
            <Field label="Quantité" type="number" value={editing.quantity ?? ""} onChange={(v) => setEditing({ ...editing, quantity: v === "" ? null : Number(v) })} />
            <Field label="Département" value={editing.department} onChange={(v) => setEditing({ ...editing, department: v })} />
            <Field label="Catégorie" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} />
            <Field label="Slugs produits (séparés par ,)" value={editing.product_slugs} onChange={(v) => setEditing({ ...editing, product_slugs: v })} />
            <Field label="Début" type="datetime-local" value={editing.starts_at} onChange={(v) => setEditing({ ...editing, starts_at: v })} />
            <Field label="Fin" type="datetime-local" value={editing.ends_at} onChange={(v) => setEditing({ ...editing, ends_at: v })} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 text-muted-foreground text-sm">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="accent-primary w-4 h-4" /> Active
            </label>
            <label className="flex items-center gap-3 text-muted-foreground text-sm">
              <input type="checkbox" checked={editing.members_only} onChange={(e) => setEditing({ ...editing, members_only: e.target.checked })} className="accent-primary w-4 h-4" /> Membres uniquement
            </label>
          </div>
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

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
