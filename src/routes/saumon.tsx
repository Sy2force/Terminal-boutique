import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/routes/category-page";
import { IMAGES } from "@/data/catalog";
import { listProducts } from "@/lib/functions/public.functions";
import { getPageContent } from "@/lib/functions/public.functions";
import { mapDbProduct } from "@/lib/mappers";

export const Route = createFileRoute("/saumon")({
  loader: async () => {
    const [content, products] = await Promise.all([getPageContent({ data: "contact" }), listProducts()]);
    return {
      content,
      products: (products ?? []).map(mapDbProduct).filter((p) => p.department === "saumon"),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "Saumon fumé Sarfati — TERMINAL 3" },
      { name: "description", content: "Saumon fumé Sarfati à Jérusalem. Fumage lent et tranchage à la main." },
      { property: "og:title", content: "Saumon fumé Sarfati — TERMINAL 3" },
      { property: "og:description", content: "Saumon fumé Sarfati à Jérusalem." },
    ],
  }),
  component: () => {
    const { content, products } = Route.useLoaderData();
    return (
      <CategoryPage
        eyebrow={content.hero_eyebrow ?? "Signature"}
        title={content.hero_title ?? "Saumon fumé Sarfati"}
        description={content.hero_subtitle ?? "Le saumon fumé Sarfati, fumage lent et tranchage à la main."}
        department="saumon"
        categories={["Saumon fumé", "Gravlax", "Foie gras", "Caviar"]}
        image={IMAGES.salmon}
        products={products}
      />
    );
  },
});
