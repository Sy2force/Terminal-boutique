import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { ProductGrid } from "@/components/ui/product-grid";
import { ACTIVE_PROMOTIONS, PRODUCTS, IMAGES } from "@/data/catalog";
import { promotionApplies } from "@/lib/promotions";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "Promotions en cours — TERMINAL 3" },
      { name: "description", content: "Promotions et offres du moment sur les vins, spiritueux, saumon et charcuterie chez Terminal 3 à Jérusalem." },
      { property: "og:title", content: "Promotions en cours — TERMINAL 3" },
      { property: "og:description", content: "Remises automatiques dans votre panier chez Terminal 3." },
    ],
  }),
  component: PromotionsPage,
});

function PromotionsPage() {
  const discounted = PRODUCTS.filter((p) => ACTIVE_PROMOTIONS.some((promo) => promotionApplies(promo, p)));

  return (
    <>
      <PageHero
        eyebrow="Offres"
        title="Promotions en cours"
        description="Les remises s'appliquent automatiquement dans votre panier."
        image={IMAGES.hero}
      />
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="py-4 pr-4 text-[11px] uppercase tracking-[0.25em] text-primary font-normal">Offre</th>
                  <th className="py-4 pr-4 text-[11px] uppercase tracking-[0.25em] text-primary font-normal">Détail</th>
                  <th className="py-4 pr-4 text-[11px] uppercase tracking-[0.25em] text-primary font-normal">Périmètre</th>
                  <th className="py-4 text-[11px] uppercase tracking-[0.25em] text-primary font-normal">Fin</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVE_PROMOTIONS.map((promo) => (
                  <tr key={promo.id} className="border-b border-border/40">
                    <td className="py-5 pr-4 font-display text-lg text-cream">{promo.name}</td>
                    <td className="py-5 pr-4 text-sm text-muted-foreground font-light">{promo.subtitle}</td>
                    <td className="py-5 pr-4 text-sm text-muted-foreground font-light">
                      {promo.productSlugs ? "Sélection de produits" : promo.category ? promo.category : promo.department}
                    </td>
                    <td className="py-5 text-sm text-muted-foreground font-light">
                      {new Date(promo.endsAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-20">
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-10">Produits remisés</h2>
            {discounted.length === 0 ? (
              <p className="text-muted-foreground">Aucune promotion active pour le moment.</p>
            ) : (
              <ProductGrid products={discounted} />
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
