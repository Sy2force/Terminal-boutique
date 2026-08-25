import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "@/shared/lib/cart";
import { formatPrice } from "@/shared/lib/format";
import { bestPromotionFor, discountFor } from "@/shared/lib/promotions";
import { FavoriteButton } from "@/components/widgets/favorite-button";
import { getProductBySlug, listProducts, listPromotions } from "@/backend/functions/public.functions";
import { mapDbProduct, mapDbPromotion } from "@/shared/lib/mappers";

export const Route = createFileRoute("/produit/$slug")({
  loader: async ({ params }) => {
    const [product, products, promotions] = await Promise.all([
      getProductBySlug({ data: params.slug }),
      listProducts(),
      listPromotions(),
    ]);
    if (!product) throw notFound();
    return {
      product: mapDbProduct(product),
      products: (products ?? []).map(mapDbProduct),
      promotions: (promotions ?? []).map(mapDbPromotion),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.product
      ? [
          { title: `${loaderData.product.name} — ${loaderData.product.category} | TERMINAL 3` },
          { name: "description", content: `${loaderData.product.brand} — ${loaderData.product.country}. ${loaderData.product.description.slice(0, 120)} Prix : ${formatPrice(loaderData.product.price)}.` },
          { property: "og:title", content: `${loaderData.product.name} | TERMINAL 3` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:type", content: "product" },
        ]
      : [
          { title: "Produit introuvable — TERMINAL 3" },
          { name: "robots", content: "noindex" },
        ],
  }),
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <div className="min-h-screen pt-[6rem] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl md:text-4xl text-cream mb-4">Produit introuvable</h1>
      <p className="text-muted-foreground mb-10 max-w-md font-light">Cette référence n'existe pas ou a été retirée.</p>
      <Link to="/vins" className="bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity">
        Retour à la cave
      </Link>
    </div>
  );
}

function ProductPage() {
  const { product, products, promotions } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);

  useEffect(() => {
    setMainImage(product.image);
  }, [product.image]);

  const promo = bestPromotionFor(promotions, product, qty);
  const discount = promo ? discountFor(promo, product, qty) : 0;
  const unitDiscount = qty > 0 ? discount / qty : 0;
  const unitFinal = Math.max(0, product.price - unitDiscount);

  const gallery = [product.image, ...(product.gallery || [])];

  const departmentRoute = {
    vins: "/vins" as const,
    spiritueux: "/spiritueux" as const,
    saumon: "/sarfati" as const,
    charcuterie: "/charcuterie" as const,
    plateaux: "/plateaux" as const,
  }[product.department];
  const sameDepartment = products.filter((p) => p.department === product.department && p.slug !== product.slug).slice(0, 4);

  const specs = [
    { label: "Marque", value: product.brand },
    { label: "Millésime", value: product.year },
    { label: "Pays", value: product.country },
    { label: "Région", value: product.region },
    { label: "Cépage", value: product.grape },
    { label: "Volume", value: product.volume },
    { label: "Poids", value: product.weight },
    { label: "Style", value: product.style },
    { label: "Référence", value: product.sku },
  ];

  const productJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    sku: product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "ILS",
      price: unitFinal.toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://terminal3.co.il/produit/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJson) }} />
      <div className="pt-[4.5rem]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
          <Link to={departmentRoute} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>

          <nav aria-label="Fil d'Ariane" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span className="mx-3 text-primary">/</span>
            <Link to={departmentRoute} className="hover:text-primary transition-colors">{product.category}</Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="relative aspect-[4/5] overflow-hidden border border-primary/20 bg-secondary glow-gold">
                <img src={mainImage} alt={product.name} loading="eager" className="h-full w-full object-cover opacity-90" />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.2em]">
                    Promo
                  </span>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMainImage(img)}
                      className={`shrink-0 w-20 h-20 border overflow-hidden ${mainImage === img ? "border-primary" : "border-primary/20"}`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover opacity-80" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="eyebrow block mb-4">{product.category} · {product.country}</span>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-cream leading-tight text-shadow-gold">{product.name}</h1>
                <FavoriteButton productId={product.id} className="shrink-0" />
              </div>
              <p className="text-lg text-muted-foreground mt-3 font-light">{product.brand}</p>

              <div className="mt-8 flex items-baseline gap-4">
                <span className="text-3xl md:text-4xl font-display text-primary">{formatPrice(unitFinal)}</span>
                {unitDiscount > 0 && (
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
                )}
              </div>
              {product.stock > 0 ? (
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold-soft">En stock</p>
              ) : (
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Rupture de stock</p>
              )}

              {product.summary && (
                <p className="mt-6 text-muted-foreground font-light leading-relaxed">{product.summary}</p>
              )}

              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center border border-primary/30">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-cream hover:bg-primary/10">−</button>
                  <span className="w-12 text-center text-cream text-sm">{qty}</span>
                  <button type="button" onClick={() => setQty(qty + 1)} className="px-4 py-3 text-cream hover:bg-primary/10">+</button>
                </div>
                <motion.button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() => add(product, qty)}
                  className="flex-1 inline-flex items-center justify-center gap-3 btn-gold btn-gold-hover px-8 py-4 text-[11px] uppercase tracking-[0.25em] disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ajouter
                </motion.button>
              </div>

              {product.isAlcohol && (
                <p className="mt-6 text-xs text-muted-foreground border-l border-bordeaux/50 pl-4">
                  Vente d'alcool réservée aux personnes majeures. Une pièce d'identité (Teoudat Zeout) sera demandée au retrait ou à la livraison.
                </p>
              )}

              <div className="mt-12 border-t border-primary/10 pt-10">
                <h2 className="font-display text-2xl text-cream mb-6">Caractéristiques</h2>
                <dl className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  {specs.filter((s) => s.value).map((s) => (
                    <div key={s.label}>
                      <dt className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-1">{s.label}</dt>
                      <dd className="text-cream">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {product.tasting && (
                <div className="mt-10 border-t border-primary/10 pt-10">
                  <h2 className="font-display text-2xl text-cream mb-4">Dégustation</h2>
                  <p className="text-muted-foreground font-light leading-relaxed">{product.tasting}</p>
                </div>
              )}
              {product.serving && (
                <div className="mt-10">
                  <h3 className="font-display text-xl text-cream mb-2">Service</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{product.serving}</p>
                </div>
              )}
              {product.pairing && (
                <div className="mt-10">
                  <h3 className="font-display text-xl text-cream mb-2">Accords</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{product.pairing}</p>
                </div>
              )}
            </div>
          </div>

          {sameDepartment.length > 0 && (
            <div className="mt-24 border-t border-primary/10 pt-16">
              <h2 className="font-display text-2xl md:text-3xl text-cream mb-10">Dans la même catégorie</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sameDepartment.map((p) => (
                  <Link key={p.slug} to="/produit/$slug" params={{ slug: p.slug }} className="group">
                    <div className="aspect-[4/5] overflow-hidden border border-primary/10 bg-secondary mb-4">
                      <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <h3 className="font-display text-lg text-cream group-hover:text-gold transition-colors">{p.name}</h3>
                    <p className="text-sm text-muted-foreground font-light">{formatPrice(p.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
