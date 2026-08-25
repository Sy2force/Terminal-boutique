import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/routes/category-page";
import { IMAGES } from "@/data/catalog";
import { listProducts } from "@/lib/functions/public.functions";
import { getPageContent } from "@/lib/functions/public.functions";
import { mapDbProduct } from "@/lib/mappers";

export const Route = createFileRoute("/vins")({
  loader: async () => {
    const [content, products] = await Promise.all([getPageContent({ data: "vins" }), listProducts()]);
    return {
      content,
      products: (products ?? []).map(mapDbProduct).filter((p) => p.department === "vins"),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.content?.seo_title ?? "Vins & Grands Crus — TERMINAL 3" },
      { name: "description", content: loaderData?.content?.seo_description ?? "Sélection de vins à Jérusalem." },
      { property: "og:title", content: loaderData?.content?.seo_title ?? "Vins & Grands Crus — TERMINAL 3" },
      { property: "og:description", content: loaderData?.content?.seo_description ?? "" },
    ],
  }),
  component: () => {
    const { content, products } = Route.useLoaderData();
    return (
      <CategoryPage
        eyebrow={content.hero_eyebrow ?? "La cave"}
        title={content.hero_title ?? "Vins & Grands Crus"}
        description={content.hero_subtitle ?? "Une sélection resserrée, dégustée bouteille par bouteille."}
        department="vins"
        categories={["Vin rouge", "Vin blanc", "Rosé", "Champagne", "Prosecco", "Vin italien", "Vin espagnol", "Vin français", "Vin premium", "Grands crus", "Vin israélien"]}
        image={IMAGES.bottleRed}
        products={products}
      />
    );
  },
});
