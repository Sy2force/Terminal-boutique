import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Percent, Tag, Wine, Sparkles } from "lucide-react";
import { listAdminPromotions, upsertPromotion, deletePromotion } from "@/backend/functions/admin.functions";
import { formatPrice } from "@/shared/lib/format";

const types = ["percent", "fixed", "special_price", "x_for_y", "bundle"];

const typeIcons: Record<string, React.ReactNode> = {
  percent: <Percent className="w-4 h-4" />,
  fixed: <Tag className="w-4 h-4" />,
  special_price: <Wine className="w-4 h-4" />,
  x_for_y: <Sparkles className="w-4 h-4" />,
  bundle: <Sparkles className="w-4 h-4" />,
};

const typeLabels: Record<string, string> = {
  percent: "%",
  fixed: "Montant fixe",
  special_price: "Prix spécial",
  x_for_y: "X pour Y",
  bundle: "Lot",
};

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
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mutate = useServerFn(upsertPromotion);
  const remove = useServerFn(deletePromotion);
  const navigate = useNavigate();

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
    setLoading(true);
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
    setLoading(false);
    setEditing(null);
    navigate({ to: "/admin/promotions", replace: true });
  };

  const del = async (id: string) => {
    setDeleting(id);
    await remove({ data: id });
    setDeleting(null);
    navigate({ to: "/admin/promotions", replace: true });
  };

  const activeCount = promotions.filter((p: any) => p.active).length;

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-cream text-neon-gold">Promotions</h1>
          <p className="text-muted-foreground text-sm mt-2 font-light">{promotions.length} offres · {activeCount} actives</p>
        </div>
        <button
          onClick={() => setEditing(empty())}
          className="btn-gold btn-gold-hover px-6 py-3 text-[11px] uppercase tracking-[0.3em] inline-flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric value={promotions.length} label="Offres" />
        <Metric value={activeCount} label="Actives" highlight />
        <Metric value={promotions.filter((p: any) => p.members_only).length} label="Membres" />
        <Metric value={promotions.filter((p: any) => !p.active).length} label="Inactives" />
      </div>

      <div className="overflow-x-auto card-luxe rounded-[2px] glow-gold">
        <table className="w-full text-left text-sm min-w-[720px]">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Offre</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Type</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Valeur</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Période</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Statut</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((p: any) => {
              const now = new Date();
              const started = !p.starts_at || new Date(p.starts_at) <= now;
              const ended = p.ends_at && new Date(p.ends_at) < now;
              const live = p.active && started && !ended;
              return (
                <tr key={p.id} className="border-b border-border/40 last:border-0">
                  <td className="p-4">
                    <div className="font-display text-base sm:text-lg text-cream">{p.name}</div>
                    {p.subtitle && <div className="text-gold-soft text-xs mt-1">{p.subtitle}</div>}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{typeIcons[p.type] || <Percent className="w-4 h-4" />}</span>
                      <span className="uppercase text-xs">{typeLabels[p.type] ?? p.type}</span>
                    </div>
                  </td>
                  <td className="p-4 text-primary font-display tracking-wide">
                    {p.type === "percent" ? `-${p.value}%` : p.type === "fixed" ? formatPrice(p.value) : Number(p.value).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-4 text-muted-foreground text-xs">
                    <div>{p.starts_at ? new Date(p.starts_at).toLocaleDateString("fr-FR") : "—"}</div>
                    <div>{p.ends_at ? new Date(p.ends_at).toLocaleDateString("fr-FR") : "—"}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-wider border rounded-[2px] ${live ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : p.active ? "border-primary/40 text-primary bg-primary/10" : "border-muted-foreground/30 text-muted-foreground"}`}>
                      {live ? "En cours" : p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => startEdit(p)} className="p-2 text-gold hover:text-cream hover:bg-primary/10 rounded-[2px] transition-colors" aria-label="Modifier">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => del(p.id)} disabled={deleting === p.id} className="p-2 text-destructive hover:text-cream hover:bg-destructive/10 rounded-[2px] transition-colors disabled:opacity-50" aria-label="Supprimer">
                      {deleting === p.id ? "..." : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="card-luxe p-6 sm:p-8 rounded-[2px] space-y-6 max-w-4xl glow-gold"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-cream text-neon-gold">{editing.id ? "Modifier" : "Nouvelle"} promotion</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-cream text-sm">Fermer ✕</button>
            </div>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Field label="Nom" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
                <Field label="Sous-titre" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
                <Select label="Type" value={editing.type} onChange={(v) => setEditing({ ...editing, type: v as any })} options={types} />
                <Field label="Valeur" type="number" value={editing.value} onChange={(v) => setEditing({ ...editing, value: Number(v) })} />
                <Field label="Quantité" type="number" value={editing.quantity ?? ""} onChange={(v) => setEditing({ ...editing, quantity: v === "" ? null : Number(v) })} />
                <Field label="Département" value={editing.department} onChange={(v) => setEditing({ ...editing, department: v })} />
                <Field label="Catégorie" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} />
                <Field label="Slugs produits" value={editing.product_slugs} onChange={(v) => setEditing({ ...editing, product_slugs: v })} />
                <Field label="Début" type="datetime-local" value={editing.starts_at} onChange={(v) => setEditing({ ...editing, starts_at: v })} />
                <Field label="Fin" type="datetime-local" value={editing.ends_at} onChange={(v) => setEditing({ ...editing, ends_at: v })} />
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-3 text-muted-foreground text-sm">
                  <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="accent-primary w-4 h-4" /> Active
                </label>
                <label className="flex items-center gap-3 text-muted-foreground text-sm">
                  <input type="checkbox" checked={editing.members_only} onChange={(e) => setEditing({ ...editing, members_only: e.target.checked })} className="accent-primary w-4 h-4" /> Membres uniquement
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" disabled={loading} className="btn-gold btn-gold-hover px-8 py-3 text-[11px] uppercase tracking-[0.3em] disabled:opacity-60">
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="btn-ghost-neon px-6 py-3 text-[11px] uppercase tracking-[0.3em]">Annuler</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className={`card-luxe p-5 rounded-[2px] ${highlight ? "border-neon-gold" : ""}`}>
      <div className="font-display text-3xl text-cream text-neon-gold">{value}</div>
      <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
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
