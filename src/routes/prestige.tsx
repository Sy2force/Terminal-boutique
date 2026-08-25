import { createFileRoute, Link } from "@tanstack/react-router";
import { PREMIUM, IMAGES } from "@/data/catalog";
import { Reveal } from "@/components/ui/reveal";

export const Route = createFileRoute("/prestige")({
  head: () => ({
    meta: [
      { title: "Collection Prestige — TERMINAL 3" },
      { name: "description", content: "Grands crus classés, millésimes rares et coffrets numérotés chez Terminal 3 à Jérusalem." },
      { property: "og:title", content: "Collection Prestige — TERMINAL 3" },
      { property: "og:description", content: "Vins premium, grands crus et coffrets d'exception à Jérusalem." },
    ],
  }),
  component: PrestigePage,
});

function PrestigePage() {
  const items = PREMIUM;

  return (
    <section className="min-h-screen pt-[4.5rem]">
      <div className="relative h-[70vh] flex items-end overflow-hidden">
        <img src={IMAGES.hero} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pb-20">
          <Reveal>
            <span className="eyebrow block mb-5">Prestige</span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-cream tracking-wide max-w-4xl leading-[1.05]">
              Grands crus, millésimes rares et coffrets numérotés.
            </h1>
            <p className="mt-6 text-muted-foreground max-w-2xl font-light leading-relaxed">
              Disponibilité limitée. Sélection confidentielle pour les amateurs exigeants.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((product, i) => (
            <Reveal key={product.slug} delay={i % 2 === 0 ? 0 : 0.1}>
              <Link
                to="/produit/$slug"
                params={{ slug: product.slug }}
                className={`group relative block overflow-hidden border border-primary/10 hover:border-primary/40 transition-colors ${
                  i % 3 === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/5]"
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-primary mb-2">{product.category} · {product.country}</p>
                  <h3 className="font-display text-2xl md:text-3xl text-cream group-hover:text-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 font-light">{product.brand}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
