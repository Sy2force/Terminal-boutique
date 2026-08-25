import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui/page-hero";
import { CatalogView } from "@/components/ui/catalog-view";
import { Reveal } from "@/components/ui/reveal";
import { NEWEST, IMAGES } from "@/shared/data/catalog";

export const Route = createFileRoute("/nouveautes")({
  head: () => ({
    meta: [
      { title: "Nouveautés — TERMINAL 3" },
      { name: "description", content: "Les dernières nouveautés de la cave et de l'épicerie fine Terminal 3 à Jérusalem." },
      { property: "og:title", content: "Nouveautés — TERMINAL 3" },
      { property: "og:description", content: "Découvrez les dernières arrivées de vins, spiritueux, saumon et charcuterie à Jérusalem." },
    ],
  }),
  component: NouveautesPage,
});

function NouveautesPage() {
  return (
    <>
      <PageHero
        eyebrow="Vient d'arriver"
        title="Nouveautés"
        description="Les dernières références arrivées en cave et en épicerie fine."
        image={IMAGES.hero}
      />
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <CatalogView products={NEWEST} categories={["Vin rouge", "Vin blanc", "Whisky", "Fumé à froid", "Rosette", "Apéritif"]} showArrival />
        </Reveal>
      </section>
    </>
  );
}
