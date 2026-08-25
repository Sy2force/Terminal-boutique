import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui/page-hero";
import { CatalogView } from "@/components/ui/catalog-view";
import { Reveal } from "@/components/ui/reveal";
import { byDepartment, IMAGES } from "@/shared/data/catalog";
import { whatsappHref } from "@/shared/lib/site";

const categories = ["Fumé à froid", "Gravlax", "Pavé", "Coffret"];

export const Route = createFileRoute("/sarfati")({
  head: () => ({
    meta: [
      { title: "Sarfati — Saumon fumé — TERMINAL 3" },
      { name: "description", content: "Le saumon fumé Sarfati à Jérusalem : fumage lent et tranchage à la main." },
      { property: "og:title", content: "Sarfati — Saumon fumé — TERMINAL 3" },
      { property: "og:description", content: "Saumon fumé à froid, gravlax, pavés et coffrets Sarfati à Jérusalem." },
    ],
  }),
  component: SarfatiPage,
});

function SarfatiPage() {
  const products = byDepartment("saumon");

  return (
    <>
      <PageHero
        eyebrow="Signature"
        title="Sarfati — Saumon fumé"
        description="Le saumon fumé Sarfati, fumage lent et tranchage à la main."
        image={IMAGES.salmon}
      />
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <CatalogView products={products} categories={categories} />
        </Reveal>

        <div className="mt-24 md:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="card-luxe p-8 md:p-12 rounded-[2px]">
              <span className="eyebrow block mb-5">La marque</span>
              <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">Sarfati</h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-8">
                Depuis plusieurs générations, Sarfati perpétue l'art du fumage à froid. Saumon de qualité supérieure, salage délicat et tranchage manuel pour conserver toute la texture et la fraîcheur.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="mt-1 w-8 h-px bg-primary shrink-0" />
                  <p className="text-sm text-foreground font-light"><strong className="text-primary">Fumage au bois</strong> — lent et maîtrisé pour des arômes subtils.</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 w-8 h-px bg-primary shrink-0" />
                  <p className="text-sm text-foreground font-light"><strong className="text-primary">Tranché main</strong> — épaisseur parfaite, texture fondante.</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 w-8 h-px bg-primary shrink-0" />
                  <p className="text-sm text-foreground font-light"><strong className="text-primary">Kasher</strong> — certification recherchée pour vos réceptions.</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative h-[420px] md:h-[520px] overflow-hidden border border-primary/10">
              <img src={IMAGES.salmon} alt="Saumon fumé Sarfati" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <h3 className="font-display text-2xl text-cream mb-4">Commande sur mesure</h3>
                <p className="text-sm text-muted-foreground font-light mb-6">Plateaux et coffrets pour Shabbat, fêtes et événements.</p>
                <a href={whatsappHref} className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity">
                  Nous contacter
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
