import { createFileRoute, Link } from "@tanstack/react-router";
import { listAdminProducts } from "@/backend/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/produits/")({
  loader: async () => listAdminProducts(),
  component: AdminProducts,
});

function AdminProducts() {
  const products = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-cream">Produits</h1>
        <Link
          to="/admin/produits/$id"
          params={{ id: "new" }}
          className="bg-primary text-primary-foreground px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
        >
          Ajouter
        </Link>
      </div>
      <div className="overflow-x-auto border border-primary/10 rounded-[2px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Nom</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Catégorie</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Prix</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Stock</th>
              <th className="p-4 text-[11px] uppercase tracking-[0.2em] text-primary font-normal">Publié</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border/40">
                <td className="p-4">
                  <Link to="/admin/produits/$id" params={{ id: p.id }} className="text-cream hover:text-gold transition-colors">
                    {p.name}
                  </Link>
                </td>
                <td className="p-4 text-muted-foreground">{p.category}</td>
                <td className="p-4 text-primary">{Number(p.price).toLocaleString("fr-FR")} ₪</td>
                <td className="p-4 text-muted-foreground">{p.stock}</td>
                <td className="p-4 text-muted-foreground">{p.is_published ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
