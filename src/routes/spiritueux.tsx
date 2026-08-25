import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/routes/category-page";
import { IMAGES } from "@/data/catalog";
import { listProducts } from "@/lib/functions/public.functions";
import { getPageContent } from "@/lib/functions/public.functions";
import { mapDbProduct } from "@/lib/mappers";

export const Route = createFileRoute("/spiritueux")({
  loader: async () => {
    const [content, products] = await Promise.all([getPageContent({ data: "spiritueux" }), listProducts()]);
    return {
      content,
      products: (products ?? []).map(mapDbProduct).filter((p) => p.department === "spiritueux"),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.content?.seo_title ?? "Spiritueux & Liqueurs — TERMINAL 3" },
      { name: "description", content: loaderData?.content?.seo_description ?? "Spiritueux à Jérusalem." },
      { property: "og:title", content: loaderData?.content?.seo_title ?? "Spiritueux & Liqueurs — TERMINAL 3" },
      { property: "og:description", content: loaderData?.content?.seo_description ?? "" },
    ],
  }),
  component: () => {
    const { content, products } = Route.useLoaderData();
    return (
      <CategoryPage
        eyebrow={content.hero_eyebrow ?? "Le bar"}
        title={content.hero_title ?? "Spiritueux & Liqueurs"}
        description={content.hero_subtitle ?? "Whiskies, vodkas, gins, araks et liqueurs sélectionnés pour leur caractère."}
        department="spiritueux"
        categories={["Whisky", "Vodka", "Gin", "Arak", "Liqueur", "Cognac"]}
        image={IMAGES.spirits}
        products={products}
      />
    );
  },
});
