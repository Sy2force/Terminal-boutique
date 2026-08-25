import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { IMAGES } from "@/data/catalog";
import { SITE, whatsappHref } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProductGrid } from "@/components/ui/product-grid";
import { listProducts } from "@/lib/functions/public.functions";
import { listPromotions } from "@/lib/functions/public.functions";
import { listBanners } from "@/lib/functions/public.functions";
import { getPageContent } from "@/lib/functions/public.functions";
import { mapDbProduct, mapDbPromotion } from "@/lib/mappers";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [content, banners, products, promotions] = await Promise.all([
      getPageContent({ data: "index" }),
      listBanners(),
      listProducts(),
      listPromotions(),
    ]);
    return {
      content,
      banners: banners ?? [],
      products: (products ?? []).map(mapDbProduct),
      promotions: (promotions ?? []).map(mapDbPromotion),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.content?.seo_title ?? "TERMINAL 3" },
      { name: "description", content: loaderData?.content?.seo_description ?? "Luxury Wine & Fine Delicatessen à Jérusalem." },
      { property: "og:title", content: loaderData?.content?.seo_title ?? "TERMINAL 3" },
      { property: "og:description", content: loaderData?.content?.seo_description ?? "" },
    ],
  }),
  component: HomePage,
});

const universes = [
  { title: "Vins & Grands Crus", image: IMAGES.bottleRed, href: "/vins" },
  { title: "Sarfati — Saumon fumé", image: IMAGES.salmon, href: "/sarfati" },
  { title: "Charcuterie française", image: IMAGES.charcuterie, href: "/charcuterie" },
  { title: "Spiritueux", image: IMAGES.spirits, href: "/spiritueux" },
];

function HomePage() {
  const { content, banners, products, promotions } = Route.useLoaderData();
  const newest = products.filter((p) => p.isNew).slice(0, 8);
  const activePromotions = promotions.slice(0, 3);
  const homeBanners = banners.filter((b: any) => b.placement === "home_top" || b.placement === "home_mid");

  return (
    <>
      {homeBanners.length > 0 && (
        <section className="pt-[4.5rem] bg-background">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
            <div className="space-y-3">
              {homeBanners.map((b: any) => (
                <div
                  key={b.id}
                  className={`p-4 md:p-6 border rounded-[2px] flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                    b.theme === "bordeaux" ? "bg-bordeaux/15 border-bordeaux/30" : "bg-secondary/40 border-primary/15"
                  }`}
                >
                  <div>
                    <h3 className="font-display text-xl text-cream">{b.title}</h3>
                    {b.subtitle && <p className="text-gold-soft text-sm mt-1">{b.subtitle}</p>}
                  </div>
                  {b.cta_href && (
                    <Link to={b.cta_href} className="btn-gold btn-gold-hover px-6 py-2 text-[10px] uppercase tracking-[0.25em] text-center">
                      {b.cta_label ?? "Découvrir"}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img
          src={IMAGES.hero}
          alt="Sélection de bouteilles de vin et champagne sur pierre noire"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 grain-gold opacity-60" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 py-32">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow block mb-6"
          >
            {content.hero_eyebrow ?? "Luxury Wine & Fine Delicatessen · Jérusalem"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-cream tracking-[0.14em] uppercase leading-none mb-6 text-shadow-gold"
          >
            {content.hero_title ?? SITE.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-2xl md:text-3xl lg:text-4xl italic text-gold-gradient mb-8"
          >
            « {content.hero_subtitle ?? SITE.tagline} »
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed font-light mb-12"
          >
            {content.intro_html ?? "Découvrez notre sélection de vins, grands crus, spiritueux, saumons fumés, charcuteries françaises et nouveautés."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/nouveautes"
              className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
            >
              Découvrir les nouveautés
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/promotions"
              className="inline-flex items-center justify-center gap-3 border border-primary/50 text-primary px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Voir les promotions
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Vient d'arriver"
            title="Les dernières nouveautés"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-16">
            <ProductGrid products={newest} showArrival />
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-14 text-center">
            <Link
              to="/nouveautes"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors"
            >
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="py-24 md:py-32 bg-night">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Nos univers"
              title="Explorez nos collections"
              description="Quatre univers de goût, sélectionnés avec exigence pour sublimer vos repas et réceptions."
              align="center"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {universes.map((u) => (
                <Link
                  key={u.title}
                  to={u.href}
                  className="group relative h-[420px] md:h-[520px] overflow-hidden border border-primary/10 hover:border-primary/40 transition-colors"
                >
                  <img
                    src={u.image}
                    alt={u.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="font-display text-2xl md:text-3xl text-cream group-hover:text-gold transition-colors">
                      {u.title}
                    </h3>
                    <div className="mt-4 w-12 h-px bg-primary/50 group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Offres du moment"
            title="Promotions en cours"
            description="Les remises s'appliquent automatiquement dans votre panier."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePromotions.map((promo: any) => (
              <div
                key={promo.id}
                className="card-luxe p-8 rounded-[2px] hover:card-luxe-hover glow-gold"
              >
                <h3 className="font-display text-2xl text-cream mb-2">{promo.name}</h3>
                {promo.subtitle && <p className="text-gold text-sm mb-4">{promo.subtitle}</p>}
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                  Jusqu'au {new Date(promo.endsAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-12">
            <Link
              to="/promotions"
              className="inline-flex items-center gap-3 border border-primary/50 text-primary px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Voir toutes les promotions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="py-24 md:py-32 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 grain-gold opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-2xl">
            <span className="eyebrow block mb-5">Collection Prestige</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream mb-6">
              Grands crus, millésimes rares et coffrets d'exception.
            </h2>
            <p className="text-muted-foreground font-light mb-10 leading-relaxed">
              Une sélection confidentielle de bouteilles uniques, disponibles en quantités limitées.
            </p>
            <Link
              to="/prestige"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
            >
              Découvrir la collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Le magasin"
            title="Terminal 3 — Jérusalem"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
              <p>
                Notre cave et épicerie fine sont situées à Jérusalem. Nous proposons un choix rigoureux de vins, spiritueux, saumon fumé et charcuterie française, ainsi que des plateaux sur mesure pour vos réceptions.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full" /> Livraison à Jérusalem</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full" /> Retrait en magasin</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full" /> Conseil personnalisé</li>
              </ul>
            </div>
            <div className="p-8 md:p-10 border border-primary/10 bg-secondary/30">
              <h3 className="font-display text-2xl text-cream mb-4">Horaires</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed mb-8">
                Dimanche — Jeudi : 10h00 à 20h00<br />
                Vendredi : 9h00 à 14h00<br />
                Samedi : fermé
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
              >
                Nous écrire sur WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
