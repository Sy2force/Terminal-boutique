import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useState } from "react";
import { listAdminProducts, upsertProduct, deleteProduct } from "@/lib/functions/admin.functions";
import { useServerFn } from "@tanstack/react-start";
import { MediaPicker } from "@/components/admin/media-picker";

const departments = ["vins", "spiritueux", "saumon", "charcuterie", "plateaux"];
const styles = ["Sec", "Fruité", "Boisé", "Doux"];
const alcoholOptions = [
  { key: "is_alcohol", label: "Alcoolisé" },
  { key: "is_new", label: "Nouveauté" },
  { key: "is_featured", label: "Mis en avant" },
  { key: "is_premium", label: "Prestige" },
  { key: "is_published", label: "Publié" },
];

export const Route = createFileRoute("/_authenticated/admin/produits/$id")({
  loader: async ({ params }) => {
    if (params.id === "new") return null;
    const all = await listAdminProducts();
    return all.find((p) => p.id === params.id) ?? null;
  },
  component: ProductForm,
});

function ProductForm() {
  const initial = Route.useLoaderData();
  const { id } = useParams({ from: "/_authenticated/admin/produits/$id" });
  const mutate = useServerFn(upsertProduct);
  const remove = useServerFn(deleteProduct);

  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    brand: initial?.brand ?? "",
    department: initial?.department ?? "vins",
    category: initial?.category ?? "",
    country: initial?.country ?? "",
    region: initial?.region ?? "",
    grape: initial?.grape ?? "",
    year: initial?.year ?? "" as string | number,
    volume: initial?.volume ?? "",
    weight: initial?.weight ?? "",
    price: initial?.price ?? 0,
    compare_at_price: initial?.compare_at_price ?? null as number | null,
    stock: initial?.stock ?? 0,
    sku: initial?.sku ?? "",
    image_url: initial?.image_url ?? "",
    description: initial?.description ?? "",
    summary: initial?.summary ?? "",
    tasting: initial?.tasting ?? "",
    serving: initial?.serving ?? "",
    pairing: initial?.pairing ?? "",
    style: initial?.style ?? "",
    is_new: initial?.is_new ?? false,
    is_featured: initial?.is_featured ?? false,
    is_premium: initial?.is_premium ?? false,
    is_alcohol: initial?.is_alcohol ?? true,
    is_published: initial?.is_published ?? true,
  });

  const set = (key: keyof typeof form, value: any) => setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      year: form.year === "" ? null : Number(form.year),
    };
    await mutate({ data: { id: id === "new" ? undefined : id, product: payload as any } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl">
      <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">{initial ? "Modifier" : "Ajouter"} un produit</h1>

      <section className="space-y-6 card-luxe p-6 md:p-8 rounded-[2px]">
        <h2 className="font-display text-xl text-gold-soft">Identification</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Nom" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
          <Field label="Marque" value={form.brand} onChange={(v) => set("brand", v)} />
          <Field label="SKU" value={form.sku} onChange={(v) => set("sku", v)} />
          <Select label="Rayon" value={form.department} onChange={(v) => set("department", v)} options={departments} />
          <Field label="Catégorie" value={form.category} onChange={(v) => set("category", v)} />
        </div>
      </section>

      <section className="space-y-6 card-luxe p-6 md:p-8 rounded-[2px]">
        <h2 className="font-display text-xl text-gold-soft">Origine</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Pays" value={form.country} onChange={(v) => set("country", v)} />
          <Field label="Région" value={form.region} onChange={(v) => set("region", v)} />
          <Field label="Cépage" value={form.grape} onChange={(v) => set("grape", v)} />
          <Field label="Millésime" type="number" value={form.year} onChange={(v) => set("year", v)} />
          <Field label="Volume" value={form.volume} onChange={(v) => set("volume", v)} />
          <Field label="Poids" value={form.weight} onChange={(v) => set("weight", v)} />
          <Select label="Style" value={form.style} onChange={(v) => set("style", v)} options={["", ...styles]} />
        </div>
      </section>

      <section className="space-y-6 card-luxe p-6 md:p-8 rounded-[2px]">
        <h2 className="font-display text-xl text-gold-soft">Prix & Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Prix" type="number" value={form.price} onChange={(v) => set("price", Number(v))} />
          <Field label="Prix comparé" type="number" value={form.compare_at_price ?? ""} onChange={(v) => set("compare_at_price", v === "" ? null : Number(v))} />
          <Field label="Stock" type="number" value={form.stock} onChange={(v) => set("stock", Number(v))} />
        </div>
      </section>

      <section className="space-y-6 card-luxe p-6 md:p-8 rounded-[2px]">
        <h2 className="font-display text-xl text-gold-soft">Média</h2>
        <MediaPicker value={form.image_url} onChange={(v) => set("image_url", v)} />
      </section>

      <section className="space-y-6 card-luxe p-6 md:p-8 rounded-[2px]">
        <h2 className="font-display text-xl text-gold-soft">Contenu</h2>
        <TextArea label="Description" value={form.description} onChange={(v) => set("description", v)} rows={4} />
        <TextArea label="Résumé" value={form.summary} onChange={(v) => set("summary", v)} rows={2} />
        <TextArea label="Dégustation" value={form.tasting} onChange={(v) => set("tasting", v)} rows={3} />
        <TextArea label="Service" value={form.serving} onChange={(v) => set("serving", v)} rows={2} />
        <TextArea label="Accords" value={form.pairing} onChange={(v) => set("pairing", v)} rows={2} />
      </section>

      <section className="space-y-6 card-luxe p-6 md:p-8 rounded-[2px]">
        <h2 className="font-display text-xl text-gold-soft">Options</h2>
        <div className="flex flex-wrap gap-6">
          {alcoholOptions.map((opt) => (
            <label key={opt.key} className="flex items-center gap-3 cursor-pointer text-muted-foreground text-sm">
              <input
                type="checkbox"
                checked={Boolean((form as any)[opt.key])}
                onChange={(e) => set(opt.key as any, e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="btn-gold btn-gold-hover px-10 py-4 text-[11px] uppercase tracking-[0.3em]"
        >
          Enregistrer le produit
        </button>
        <Link
          to="/admin/produits"
          className="border border-primary/30 text-muted-foreground px-6 py-4 text-[11px] uppercase tracking-[0.3em] hover:border-primary hover:text-primary transition-colors rounded-[2px]"
        >
          Retour
        </Link>
        {id !== "new" && (
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Supprimer ce produit ?")) return;
              await remove({ data: id });
              window.location.href = "/admin/produits";
            }}
            className="ml-auto text-destructive text-xs uppercase tracking-wider hover:text-cream transition-colors"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o || "—"}</option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
      />
    </div>
  );
}
