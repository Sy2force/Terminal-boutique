import type { Product } from "@/shared/types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  showArrival?: boolean;
}

export function ProductGrid({ products, showArrival }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} showArrival={showArrival} />
      ))}
    </div>
  );
}
