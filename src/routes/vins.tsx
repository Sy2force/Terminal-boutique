import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/routes/category-page";
import { IMAGES } from "@/data/catalog";

export const Route = createFileRoute("/vins")({
  head: () => ({
    meta: [
      { title: "Vins & Grands Crus — TERMINAL 3" },
      { name: "description", content: "Sélection de vins israéliens, français, italiens et espagnols. Vins rouges, blancs, rosés, champagnes et grands crus à Jérusalem." },
      { property: "og:title", content: "Vins & Grands Crus — TERMINAL 3" },
      { property: "og:description", content: "Vins israéliens, crus français, italiens et espagnols à Jérusalem." },
    ],
  }),
  component: () => (
    <CategoryPage
      eyebrow="La cave"
      title="Vins & Grands Crus"
      description="Une sélection resserrée, dégustée bouteille par bouteille : vins israéliens, crus français, italiens et espagnols."
      department="vins"
      categories={["Vin rouge", "Vin blanc", "Rosé", "Champagne", "Prosecco", "Vin italien", "Vin espagnol", "Vin français", "Vin premium", "Grands crus", "Vin israélien"]}
      image={IMAGES.bottleRed}
    />
  ),
});
