import { createFileRoute } from "@tanstack/react-router";
import { listMyFavorites } from "@/lib/functions/client.functions";

export const Route = createFileRoute("/_authenticated/compte/favoris")({
  loader: async () => listMyFavorites(),
  component: FavoritesPage,
});

function FavoritesPage() {
  const favorites = Route.useLoaderData();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-cream">Mes favoris</h1>
      {favorites.length === 0 ? (
        <p className="text-muted-foreground font-light">Vous n''avez pas encore de favoris.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((f: any) => (
            <div key={f.id} className="card-luxe p-4 rounded-[2px] space-y-3">
              <p className="font-display text-xl text-cream">{f.product.name}</p>
              <p className="text-primary">{Number(f.product.price).toLocaleString("fr-FR")} ₪</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
