import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listAdminBanners, upsertBanner, deleteBanner } from "@/lib/functions/admin.functions";

const placements = ["home_top", "home_mid", "category", "global_ribbon"];
const themes = ["gold", "bordeaux", "dark"];

export const Route = createFileRoute("/_authenticated/admin/banderoles")({
  loader: async () => listAdminBanners(),
  component: AdminBanners,
});

const empty = () => ({
  id: undefined as string | undefined,
  placement: "home_top" as const,
  title: "",
  subtitle: "",
  body: "",
  image_url: "",
  cta_label: "",
  cta_href: "",
  theme: "gold" as const,
  starts_at: new Date().toISOString().slice(0, 16),
  ends_at: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
  active: true,
  sort_order: 0,
});

function AdminBanners() {
  const banners = Route.useLoaderData();
  const [editing, setEditing] = useState<ReturnType<typeof empty> | null>(null);
  const mutate = useServerFn(upsertBanner);
  const remove = useServerFn(deleteBanner);

  const startEdit = (b: any) =>
    setEditing({
      id: b.id,
      placement: b.placement,
      title: b.title ?? "",
      subtitle: b.subtitle ?? "",
      body: b.body ?? "",
      image_url: b.image_url ?? "",
      cta_label: b.cta_label ?? "",
      cta_href: b.cta_href ?? "",
      theme: b.theme,
      starts_at: b.starts_at ? b.starts_at.slice(0, 16) : "",
      ends_at: b.ends_at ? b.ends_at.slice(0, 16) : "",
      active: b.active,
      sort_order: b.sort_order ?? 0,
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...editing,
      starts_at: new Date(editing.starts_at).toISOString(),
      ends_at: new Date(editing.ends_at).toISOString(),
      sort_order: Number(editing.sort_order),
    };
    await mutate({ data: { id: editing.id, banner: payload as any } });
    setEditing(null);
    window.location.reload();
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer cette banderole ?")) return;
    await remove({ data: id });
    window.location.reload();
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Banderoles</h1>
        <button onClick={() => setEditing(empty())} className="btn-gold btn-gold-hover px-6 py-3 text-[11px] uppercase tracking-[0.3em]">Ajouter</button>
      </div>

      <div className="overflow-x-auto card-luxe rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Emplacement</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Titre</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Thème</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Active</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b: any) => (
              <tr key={b.id} className="border-b border-border/40 last:border-0">
                <td className="p-4 text-muted-foreground uppercase text-xs">{b.placement}</td>
                <td className="p-4 text-cream">{b.title}</td>
                <td className="p-4 text-primary">{b.theme}</td>
                <td className="p-4 text-muted-foreground">{b.active ? "Oui" : "Non"}</td>
                <td className="p-4 space-x-3">
                  <button onClick={() => startEdit(b)} className="text-gold hover:text-cream text-xs uppercase tracking-wider">Modifier</button>
                  <button onClick={() => del(b.id)} className="text-destructive hover:text-cream text-xs uppercase tracking-wider">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <form onSubmit={submit} className="card-luxe p-6 md:p-8 rounded-[2px] space-y-6 max-w-4xl">
          <h2 className="font-display text-2xl text-cream">{editing.id ? "Modifier" : "Nouvelle"} banderole</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Titre" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <Field label="Sous-titre" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
            <Select label="Emplacement" value={editing.placement} onChange={(v) => setEditing({ ...editing, placement: v as any })} options={placements} />
            <Select label="Thème" value={editing.theme} onChange={(v) => setEditing({ ...editing, theme: v as any })} options={themes} />
            <Field label="Image URL" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} />
            <Field label="CTA label" value={editing.cta_label} onChange={(v) => setEditing({ ...editing, cta_label: v })} />
            <Field label="CTA lien" value={editing.cta_href} onChange={(v) => setEditing({ ...editing, cta_href: v })} />
            <Field label="Ordre" type="number" value={editing.sort_order} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
            <Field label="Début" type="datetime-local" value={editing.starts_at} onChange={(v) => setEditing({ ...editing, starts_at: v })} />
            <Field label="Fin" type="datetime-local" value={editing.ends_at} onChange={(v) => setEditing({ ...editing, ends_at: v })} />
          </div>
          <TextArea label="Contenu" value={editing.body} onChange={(v) => setEditing({ ...editing, body: v })} rows={3} />
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

function TextArea({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
    </div>
  );
}
