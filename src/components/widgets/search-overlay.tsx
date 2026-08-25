import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { PRODUCTS } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-background/98 backdrop-blur-xl flex flex-col items-center pt-24 md:pt-32 px-6"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Fermer la recherche"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un vin, une marque, une catégorie…"
                className="w-full bg-transparent border-b border-primary/30 focus:border-primary text-cream text-lg md:text-xl py-4 pl-12 pr-4 placeholder:text-muted-foreground/60 focus:outline-none font-display"
              />
            </div>
            <div className="mt-8 space-y-3">
              {results.length === 0 && query.trim().length >= 2 && (
                <p className="text-muted-foreground text-sm font-light">Aucun résultat.</p>
              )}
              {results.map((product) => (
                <Link
                  key={product.slug}
                  to="/produit/$slug"
                  params={{ slug: product.slug }}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 border border-border hover:border-primary/50 transition-colors group"
                >
                  <img src={product.image} alt={product.name} className="w-14 h-14 object-cover opacity-80" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {product.brand} · {product.category}
                    </p>
                  </div>
                  <span className="text-sm text-primary font-display">{formatPrice(product.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
