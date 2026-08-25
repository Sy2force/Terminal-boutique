import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { PRODUCTS, PROMOTIONS } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { bestPromotionFor, discountFor } from "@/lib/promotions";
import { FavoriteButton } from "@/components/widgets/favorite-button";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — ${loaderData.category} | TERMINAL 3` },
          { name: "description", content: `${loaderData.brand} — ${loaderData.country}. ${loaderData.description.slice(0, 120)} Prix : ${formatPrice(loaderData.price)}.` },
          { property: "og:title", content: `${loaderData.name} | TERMINAL 3` },
          { property: "og:description", content: loaderData.description },
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
  const product = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);

  const promo = bestPromotionFor(PROMOTIONS, product, qty);
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
  const sameDepartment = PRODUCTS.filter((p) => p.department === product.department && p.slug !== product.slug).slice(0, 4);

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
              <div className="relative aspect-[4/5] overflow-hidden border border-primary/20 bg-secondary">
                <img src={mainImage} alt={product.name} loading="eager" className="h-full w-full object-cover opacity-90" />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.2em]">
                    Promo
                  </span>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMainImage(src)}
                      className={`w-20 h-20 overflow-hidden border transition-colors ${mainImage === src ? "border-primary" : "border-primary/20 hover:border-primary/60"}`}
                      aria-label={`Image ${i + 1}`}
                    >
                      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover opacity-80" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="eyebrow block mb-4">{product.category} · {product.country}</span>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-cream leading-tight">{product.name}</h1>
                <FavoriteButton productId={product.id} className="shrink-0" />
              </div>
              <p className="text-lg text-muted-foreground mt-3 font-light">{product.brand}</p>

              <div className="mt-8 flex items-baseline gap-4">
                <span className="font-display text-4xl text-primary">{formatPrice(unitFinal)}</span>
                {product.compareAtPrice && product.compareAtPrice > unitFinal && (
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
              </div>

              {promo && (
                <div className="mt-4 p-4 border border-primary/20 bg-primary/5">
                  <p className="text-sm text-primary font-medium">{promo.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{promo.subtitle}</p>
                </div>
              )}

              <p className="mt-8 text-muted-foreground leading-relaxed font-light">{product.description}</p>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex items-center border border-input rounded-[2px]">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-3 text-cream hover:text-primary transition-colors"
                    aria-label="Diminuer la quantité"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-cream text-sm">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(qty + 1, Math.max(product.stock, 1)))}
                    className="px-4 py-3 text-cream hover:text-primary transition-colors"
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                  {product.stock > 0 ? "En stock" : "Sur commande"}
                </p>
              </div>

              <motion.button
                type="button"
                onClick={() => add(product, qty)}
                className="mt-8 w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
                whileTap={{ scale: 0.99 }}
              >
                <ShoppingBag className="w-4 h-4" />
                Ajouter au panier
              </motion.button>

              <div className="mt-12">
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-primary mb-4">Caractéristiques</h2>
                <dl className="border-t border-border">
                  {specs
                    .filter((s) => s.value)
                    .map((s) => (
                      <div key={s.label} className="flex justify-between py-3 border-b border-border/40">
                        <dt className="text-xs text-muted-foreground uppercase tracking-[0.15em]">{s.label}</dt>
                        <dd className="text-sm text-foreground font-light">{s.value}</dd>
                      </div>
                    ))}
                </dl>
              </div>

              <div className="mt-10 space-y-6">
                {product.tasting && (
                  <div>
                    <h3 className="font-display text-xl text-cream mb-2">Notes de dégustation</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{product.tasting}</p>
                  </div>
                )}
                {product.serving && (
                  <div>
                    <h3 className="font-display text-xl text-cream mb-2">Température de service</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{product.serving}</p>
                  </div>
                )}
                {product.pairing && (
                  <div>
                    <h3 className="font-display text-xl text-cream mb-2">Accords mets & vins</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{product.pairing}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-24 md:mt-32">
            <span className="eyebrow block mb-5">À découvrir</span>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-10">Dans le même esprit</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sameDepartment.map((p) => (
                <Link
                  key={p.slug}
                  to="/produit/$slug"
                  params={{ slug: p.slug }}
                  className="group block card-luxe rounded-[2px] overflow-hidden hover:card-luxe-hover"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-secondary">
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{p.category}</p>
                    <h3 className="font-display text-lg text-cream group-hover:text-gold transition-colors">{p.name}</h3>
                    <p className="text-sm text-primary mt-2">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
