import { useMemo, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProductGrid } from "./product-grid";
import type { Product } from "@/shared/types/product";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SortOption = "newest" | "price-asc" | "price-desc";

interface CatalogViewProps {
  products: Product[];
  categories: string[];
  showArrival?: boolean;
}

export function CatalogView({ products, categories, showArrival }: CatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [premiumOnly, setPremiumOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      list = list.filter((p) => p.price >= min && (Number.isNaN(max) || p.price <= max));
    }
    if (premiumOnly) {
      list = list.filter((p) => p.isPremium);
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return list;
  }, [products, selectedCategory, sort, priceRange, premiumOnly]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
        <div className="lg:w-64 space-y-8 shrink-0">
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-primary mb-4">Catégories</h4>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "text-left text-[10px] uppercase tracking-[0.2em] px-3 py-2 border transition-colors duration-300",
                  selectedCategory === null
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                )}
              >
                Tout
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={cn(
                    "text-left text-[10px] uppercase tracking-[0.2em] px-3 py-2 border transition-colors duration-300",
                    selectedCategory === cat
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-primary mb-4">Prix</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Tous", value: null },
                { label: "Moins de 100 ₪", value: "0-99" },
                { label: "100 — 250 ₪", value: "100-250" },
                { label: "250 — 500 ₪", value: "250-500" },
                { label: "Plus de 500 ₪", value: "500-" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setPriceRange(opt.value)}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.2em] px-3 py-2 border transition-colors duration-300",
                    priceRange === opt.value
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={premiumOnly}
              onChange={(e) => setPremiumOnly(e.target.checked)}
              className="w-4 h-4 accent-primary bg-transparent border border-input rounded-[2px]"
            />
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
              Premium seulement
            </span>
          </label>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {filtered.length} produit{filtered.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Trier
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-background border border-input text-foreground text-[11px] uppercase tracking-[0.15em] px-3 py-2 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="newest">Nouveautés</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucun produit ne correspond à ces filtres.</p>
          ) : (
            <ProductGrid products={filtered} showArrival={showArrival} />
          )}
        </div>
      </div>
    </div>
  );
}
