import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui/page-hero";
import { CatalogView } from "@/components/ui/catalog-view";
import { Reveal } from "@/components/ui/reveal";
import { byDepartment, IMAGES } from "@/data/catalog";
import { whatsappHref } from "@/lib/site";

const categories = ["Apéritif", "Mixte", "Prestige", "Dégustation"];
const steps = ["Choisir", "Personnaliser", "Retirer"];

export const Route = createFileRoute("/plateaux")({
  head: () => ({
    meta: [
      { title: "Plateaux & Coffrets — TERMINAL 3" },
      { name: "description", content: "Plateaux composés pour vos réceptions, préparés le jour même à Jérusalem." },
      { property: "og:title", content: "Plateaux & Coffrets — TERMINAL 3" },
      { property: "og:description", content: "Plateaux apéritif, mixte, prestige et dégustation à Jérusalem." },
    ],
  }),
  component: PlateauxPage,
});

function PlateauxPage() {
  const products = byDepartment("plateaux");

  return (
    <>
      <PageHero
        eyebrow="Sur commande"
        title="Plateaux & Coffrets"
        description="Plateaux composés pour vos réceptions, préparés le jour même."
        image={IMAGES.plateau}
      />
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <CatalogView products={products} categories={categories} />
        </Reveal>

        <div className="mt-24 md:mt-32 border border-primary/10 p-8 md:p-16 bg-night">
          <div className="max-w-3xl mx-auto text-center">
            <span className="eyebrow block mb-5">Commande sur mesure</span>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-10">Composez votre plateau en 3 étapes</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-12">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center gap-4 md:gap-6">
                  <span className="font-display text-4xl text-gold-gradient">0{i + 1}</span>
                  <span className="text-sm uppercase tracking-[0.2em] text-foreground">{step}</span>
                  {i < steps.length - 1 && <span className="hidden md:block w-12 h-px bg-primary/30" />}
                </div>
              ))}
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
            >
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
