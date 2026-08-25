import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui/page-hero";
import { ProductGrid } from "@/components/ui/product-grid";
import { Reveal } from "@/components/ui/reveal";
import { PRODUCTS, IMAGES } from "@/data/catalog";
import { PROMOTIONS } from "@/data/catalog";
import { bestPromotionFor, discountFor } from "@/lib/promotions";

export const Route = createFileRoute("/bonnes-affaires")({
  head: () => ({
    meta: [
      { title: "Bonnes affaires — TERMINAL 3" },
      { name: "description", content: "Les meilleures affaires de la cave Terminal 3 : promotions, prix barrés et remises sur vins et épicerie fine à Jérusalem." },
      { property: "og:title", content: "Bonnes affaires — TERMINAL 3" },
      { property: "og:description", content: "Produits remisés et prix barrés chez Terminal 3." },
    ],
  }),
  component: BonnesAffairesPage,
});

function BonnesAffairesPage() {
  const deals = [...PRODUCTS]
    .map((p) => {
      const promo = bestPromotionFor(PROMOTIONS, p, 1);
      const discount = promo ? discountFor(promo, p, 1) : 0;
      const compareDiscount = p.compareAtPrice ? p.compareAtPrice - p.price : 0;
      const totalDiscount = Math.max(discount, compareDiscount);
      return { product: p, totalDiscount };
    })
    .filter((d) => d.totalDiscount > 0)
    .sort((a, b) => b.totalDiscount - a.totalDiscount)
    .map((d) => d.product);

  return (
    <>
      <PageHero
        eyebrow="Bons plans"
        title="Bonnes affaires"
        description="Nos meilleures opportunités : promotions actives et prix barrés."
        image={IMAGES.hero}
      />
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          {deals.length === 0 ? (
            <p className="text-muted-foreground">Aucune bonne affaire en ce moment.</p>
          ) : (
            <ProductGrid products={deals} />
          )}
        </Reveal>
      </section>
    </>
  );
}
