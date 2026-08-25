import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "@/lib/cart";
import { bestPromotionFor, discountFor } from "@/lib/promotions";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";
import { PROMOTIONS } from "@/data/catalog";
import { arrivalLabel } from "@/lib/format";
import { FavoriteButton } from "@/components/widgets/favorite-button";

interface ProductCardProps {
  product: Product;
  showArrival?: boolean;
}

export function ProductCard({ product, showArrival }: ProductCardProps) {
  const { add } = useCart();
  const promo = bestPromotionFor(PROMOTIONS, product, 1);
  const discount = promo ? discountFor(promo, product, 1) : 0;
  const finalPrice = Math.max(0, product.price - discount);

  const hasCompare = product.compareAtPrice && product.compareAtPrice > finalPrice;
  const percentOff = promo?.type === "percent" ? promo.value : hasCompare ? Math.round(((product.compareAtPrice! - finalPrice) / product.compareAtPrice!) * 100) : 0;

  return (
    <article className="card-luxe group rounded-[2px] overflow-hidden hover:card-luxe-hover">
      <Link to="/produit/$slug" params={{ slug: product.slug }} className="block relative">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {product.isNew && (
            <span className="px-3 py-1 text-[9px] uppercase tracking-[0.25em] border border-primary/60 text-primary bg-background/80 backdrop-blur-sm">
              Nouveau
            </span>
          )}
          {percentOff > 0 && (
            <span className="px-3 py-1 text-[9px] uppercase tracking-[0.25em] bg-primary text-primary-foreground">
              -{percentOff}%
            </span>
          )}
        </div>
        <FavoriteButton productId={product.id} className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm" />
      </Link>
      <div className="p-5 relative">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
          {product.category} · {product.country}
        </div>
        <Link to="/produit/$slug" params={{ slug: product.slug }}>
          <h3 className="font-display text-xl md:text-2xl text-foreground group-hover:text-gold transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1 font-light">{product.brand}</p>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-lg text-primary font-display tracking-wide">{formatPrice(finalPrice)}</span>
          {hasCompare && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice!)}</span>
          )}
        </div>
        {showArrival && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold-soft mt-3">{arrivalLabel(product.createdAt)}</p>
        )}
        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            add(product, 1);
          }}
          className="absolute bottom-5 right-5 flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.25em] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          aria-label={`Ajouter ${product.name} au panier`}
          whileTap={{ scale: 0.97 }}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Ajouter
        </motion.button>
      </div>
    </article>
  );
}
