import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/routes/category-page";
import { IMAGES } from "@/data/catalog";
import { listProducts } from "@/lib/functions/public.functions";
import { getPageContent } from "@/lib/functions/public.functions";
import { mapDbProduct } from "@/lib/mappers";

export const Route = createFileRoute("/charcuterie")({
  loader: async () => {
    const [content, products] = await Promise.all([getPageContent({ data: "charcuterie" }), listProducts()]);
    return {
      content,
      products: (products ?? []).map(mapDbProduct).filter((p) => p.department === "charcuterie"),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.content?.seo_title ?? "Charcuterie française — TERMINAL 3" },
      { name: "description", content: loaderData?.content?.seo_description ?? "Charcuterie française à Jérusalem." },
      { property: "og:title", content: loaderData?.content?.seo_title ?? "Charcuterie française — TERMINAL 3" },
      { property: "og:description", content: loaderData?.content?.seo_description ?? "" },
    ],
  }),
  component: () => {
    const { content, products } = Route.useLoaderData();
    return (
      <CategoryPage
        eyebrow={content.hero_eyebrow ?? "L'épicerie"}
        title={content.hero_title ?? "Charcuterie française"}
        description={content.hero_subtitle ?? "Rosettes, saucissons secs, jambons et terrines de maisons françaises."}
        department="charcuterie"
        categories={["Rosette", "Saucisson", "Jambon sec", "Chorizo", "Coppa", "Terrine"]}
        image={IMAGES.charcuterie}
        products={products}
      />
    );
  },
});
