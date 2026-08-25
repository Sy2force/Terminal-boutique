import { createFileRoute } from "@tanstack/react-router";
import { listMyWishlist } from "@/lib/functions/client.functions";

export const Route = createFileRoute("/_authenticated/compte/envies")({
  loader: async () => listMyWishlist(),
  component: WishlistPage,
});

function WishlistPage() {
  const items = Route.useLoaderData();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-cream">Liste d''envies</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground font-light">Votre liste est vide.</p>
      ) : (
        <div className="space-y-4">
          {items.map((it: any) => (
            <div key={it.id} className="card-luxe p-4 rounded-[2px] flex justify-between items-center">
              <div>
                <p className="font-display text-lg text-cream">{it.product.name}</p>
                {it.note && <p className="text-muted-foreground text-sm mt-1">{it.note}</p>}
              </div>
              <button className="bg-primary text-primary-foreground px-5 py-2 text-[10px] uppercase tracking-[0.2em]">
                Commander
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
