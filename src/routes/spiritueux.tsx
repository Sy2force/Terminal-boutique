import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/routes/category-page";
import { IMAGES } from "@/data/catalog";

export const Route = createFileRoute("/spiritueux")({
  head: () => ({
    meta: [
      { title: "Spiritueux & Liqueurs — TERMINAL 3" },
      { name: "description", content: "Whiskies, vodkas, gins, araks et liqueurs sélectionnés pour leur caractère, à Jérusalem." },
      { property: "og:title", content: "Spiritueux & Liqueurs — TERMINAL 3" },
      { property: "og:description", content: "Whiskies, vodkas, gins, araks et liqueurs à Jérusalem." },
    ],
  }),
  component: () => (
    <CategoryPage
      eyebrow="Le bar"
      title="Spiritueux & Liqueurs"
      description="Whiskies, vodkas, gins, araks et liqueurs sélectionnés pour leur caractère."
      department="spiritueux"
      categories={["Whisky", "Vodka", "Gin", "Arak", "Liqueur", "Cognac"]}
      image={IMAGES.spirits}
    />
  ),
});
