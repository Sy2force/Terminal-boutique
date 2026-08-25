import { createFileRoute, Link } from "@tanstack/react-router";
import { listMyWishlist } from "@/backend/functions/client.functions";
import { formatPrice } from "@/shared/lib/format";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/compte/envies")({
  loader: async () => listMyWishlist(),
  component: WishlistPage,
});

function WishlistPage() {
  const items = Route.useLoaderData() as any[];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Liste d'envies</h1>
        <p className="text-muted-foreground text-sm mt-2 font-light">Produits que vous souhaitez commander plus tard.</p>
      </div>
      {items.length === 0 ? (
        <div className="card-luxe p-10 rounded-[2px] text-center">
          <p className="text-muted-foreground font-light">Votre liste est vide.</p>
          <Link to="/vins" className="inline-block mt-6 btn-gold btn-gold-hover px-8 py-3 text-[11px] uppercase tracking-[0.3em]">
            Découvrir la cave
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it: any) => (
            <div key={it.id} className="card-luxe p-5 rounded-[2px] flex gap-5">
              <div className="w-24 h-28 shrink-0 overflow-hidden bg-secondary">
                <img src={it.product.image_url} alt={it.product.name} className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{it.product.category}</p>
                <h3 className="font-display text-xl text-cream">{it.product.name}</h3>
                <p className="text-primary">{formatPrice(Number(it.product.price))}</p>
                {it.note && <p className="text-sm text-muted-foreground font-light italic">« {it.note} »</p>}
                <Link to="/produit/$slug" params={{ slug: it.product.slug }} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold hover:text-cream transition-colors">
                  <ShoppingBag className="w-3 h-3" /> Voir le produit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
