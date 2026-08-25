import { createFileRoute, Link } from "@tanstack/react-router";
import { listMyFavorites } from "@/lib/functions/client.functions";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/compte/favoris")({
  loader: async () => listMyFavorites(),
  component: FavoritesPage,
});

function FavoritesPage() {
  const favorites = Route.useLoaderData() as any[];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Mes favoris</h1>
        <p className="text-muted-foreground text-sm mt-2 font-light">Vos produits coups de cœur.</p>
      </div>
      {favorites.length === 0 ? (
        <div className="card-luxe p-10 rounded-[2px] text-center">
          <p className="text-muted-foreground font-light">Vous n'avez pas encore de favoris.</p>
          <Link to="/vins" className="inline-block mt-6 btn-gold btn-gold-hover px-8 py-3 text-[11px] uppercase tracking-[0.3em]">
            Découvrir la cave
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((f: any) => (
            <Link key={f.id} to="/produit/$slug" params={{ slug: f.product.slug }} className="group card-luxe rounded-[2px] overflow-hidden hover:card-luxe-hover block">
              <div className="aspect-[4/5] overflow-hidden bg-secondary">
                <img src={f.product.image_url} alt={f.product.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{f.product.category}</p>
                <h3 className="font-display text-xl text-cream group-hover:text-gold transition-colors">{f.product.name}</h3>
                <p className="text-primary">{formatPrice(Number(f.product.price))}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
