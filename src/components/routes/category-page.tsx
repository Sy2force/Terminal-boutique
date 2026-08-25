import { PageHero } from "@/components/ui/page-hero";
import { CatalogView } from "@/components/ui/catalog-view";
import { Reveal } from "@/components/ui/reveal";
import type { Department } from "@/types/product";
import { byDepartment, IMAGES } from "@/data/catalog";

interface CategoryPageProps {
  eyebrow: string;
  title: string;
  description: string;
  department: Department;
  categories: string[];
  image?: string;
}

export function CategoryPage({ eyebrow, title, description, department, categories, image }: CategoryPageProps) {
  const products = byDepartment(department);
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} image={image ?? IMAGES.hero} />
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <CatalogView products={products} categories={categories} />
        </Reveal>
      </section>
    </>
  );
}
