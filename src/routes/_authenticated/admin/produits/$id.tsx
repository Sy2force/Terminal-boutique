import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { listAdminProducts, upsertProduct } from "@/lib/functions/admin.functions";
import { useServerFn } from "@tanstack/react-start";

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

  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    brand: initial?.brand ?? "",
    department: initial?.department ?? "vins",
    category: initial?.category ?? "",
    country: initial?.country ?? "",
    region: initial?.region ?? "",
    grape: initial?.grape ?? "",
    year: initial?.year ?? "",
    volume: initial?.volume ?? "",
    weight: initial?.weight ?? "",
    price: initial?.price ?? 0,
    compare_at_price: initial?.compare_at_price ?? null,
    stock: initial?.stock ?? 0,
    sku: initial?.sku ?? "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutate({ data: { id: id === "new" ? undefined : id, product: form } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <h1 className="font-display text-3xl text-cream">{initial ? "Modifier" : "Ajouter"} un produit</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ["name", "Nom"],
          ["slug", "Slug"],
          ["brand", "Marque"],
          ["category", "Catégorie"],
          ["department", "Rayon"],
          ["country", "Pays"],
          ["region", "Région"],
          ["grape", "Cépage"],
          ["volume", "Volume"],
          ["weight", "Poids"],
          ["sku", "SKU"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{label}</label>
            <input
              value={String((form as any)[key] ?? "")}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-transparent border border-input text-cream px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-[2px]"
            />
          </div>
        ))}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Prix</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full bg-transparent border border-input text-cream px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-[2px]"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full bg-transparent border border-input text-cream px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-[2px]"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Millésime</label>
          <input
            type="number"
            value={form.year ?? ""}
            onChange={(e) => setForm({ ...form, year: e.target.value ? Number(e.target.value) : null })}
            className="w-full bg-transparent border border-input text-cream px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-[2px]"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
      >
        Enregistrer
      </button>
    </form>
  );
}
