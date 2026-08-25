import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/routes/category-page";
import { IMAGES } from "@/data/catalog";

export const Route = createFileRoute("/charcuterie")({
  head: () => ({
    meta: [
      { title: "Charcuterie française — TERMINAL 3" },
      { name: "description", content: "Rosettes, saucissons secs, jambons et terrines de maisons françaises à Jérusalem." },
      { property: "og:title", content: "Charcuterie française — TERMINAL 3" },
      { property: "og:description", content: "Charcuterie française : rosette, saucisson, jambon sec, terrines à Jérusalem." },
    ],
  }),
  component: () => (
    <CategoryPage
      eyebrow="L'épicerie"
      title="Charcuterie française"
      description="Rosettes, saucissons secs, jambons et terrines de maisons françaises."
      department="charcuterie"
      categories={["Rosette", "Saucisson", "Jambon sec", "Chorizo", "Coppa", "Terrine"]}
      image={IMAGES.charcuterie}
    />
  ),
});
