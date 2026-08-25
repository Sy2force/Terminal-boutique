import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useMemo } from "react";
import { PRODUCTS, PROMOTIONS } from "@/data/catalog";
import { cartTotals } from "@/lib/promotions";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Votre panier — TERMINAL 3" },
      { name: "description", content: "Votre panier TERMINAL 3 : vins, spiritueux, saumon et charcuterie. Commande par WhatsApp." },
      { property: "og:title", content: "Votre panier — TERMINAL 3" },
      { property: "og:description", content: "Panier de vins, spiritueux et épicerie fine à Jérusalem." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQty, clear } = useCart();
  const totals = useMemo(() => cartTotals(items, PRODUCTS, PROMOTIONS), [items]);

  const enriched = useMemo(() => {
    return items
      .map((item) => {
        const product = PRODUCTS.find((p) => p.slug === item.slug);
        return product ? { item, product } : null;
      })
      .filter(Boolean) as { item: typeof items[0]; product: typeof PRODUCTS[0] }[];
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-[6rem] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-3xl md:text-4xl text-cream mb-4">Votre panier est vide.</h1>
        <p className="text-muted-foreground mb-10 font-light">Découvrez notre sélection de vins et d'épicerie fine.</p>
        <Link to="/vins" className="bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity">
          Découvrir la cave
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[4.5rem] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
        <h1 className="font-display text-3xl md:text-5xl text-cream mb-12">Votre panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {enriched.map(({ item, product }) => {
              const lineTotal = product.price * item.qty;
              return (
                <div key={product.slug} className="card-luxe p-4 md:p-6 rounded-[2px] flex flex-col sm:flex-row gap-6">
                  <Link to="/produit/$slug" params={{ slug: product.slug }} className="shrink-0">
                    <img src={product.image} alt={product.name} className="w-24 h-24 md:w-28 md:h-28 object-cover opacity-80" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
                    <Link to="/produit/$slug" params={{ slug: product.slug }}>
                      <h3 className="font-display text-xl text-cream hover:text-gold transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground font-light mt-1">{product.brand}</p>
                    <p className="text-sm text-primary mt-3">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                    <div className="flex items-center border border-primary/20 rounded-[2px] bg-card/30">
                      <button type="button" onClick={() => setQty(product.slug, item.qty - 1)} className="px-3 py-2 text-cream hover:text-gold transition-colors" aria-label="Diminuer">−</button>
                      <span className="w-8 text-center text-sm text-cream">{item.qty}</span>
                      <button type="button" onClick={() => setQty(product.slug, item.qty + 1)} className="px-3 py-2 text-cream hover:text-gold transition-colors" aria-label="Augmenter">+</button>
                    </div>
                    <p className="font-display text-lg text-cream min-w-[4rem] text-right">{formatPrice(lineTotal)}</p>
                    <button
                      type="button"
                      onClick={() => remove(product.slug)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Supprimer ${product.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={clear}
              className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors"
            >
              Vider le panier
            </button>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit p-6 md:p-8 card-luxe glow-gold rounded-[2px]">
            <h2 className="font-display text-2xl text-cream mb-6">Récapitulatif</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground font-light">
                <span>Sous-total</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discounts.map((d, i) => (
                <div key={i} className="flex justify-between text-primary font-medium">
                  <span>{d.name}</span>
                  <span>− {formatPrice(d.amount)}</span>
                </div>
              ))}
              <div className="h-px bg-primary/20 my-4" />
              <div className="flex justify-between text-lg text-cream font-display">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totals.total)}</span>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-3 btn-gold btn-gold-hover px-8 py-4 text-[11px] uppercase tracking-[0.3em]"
              >
                Valider la commande <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/vins"
                className="w-full flex items-center justify-center gap-3 border border-primary/50 text-primary px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Continuer mes achats
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
