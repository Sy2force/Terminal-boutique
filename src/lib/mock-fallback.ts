import { PRODUCTS, PROMOTIONS, IMAGES } from "@/data/catalog";

export function fallbackProducts() {
  return PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    department: p.department,
    category: p.category,
    country: p.country,
    region: p.region ?? null,
    grape: p.grape ?? null,
    year: p.year ?? null,
    volume: p.volume ?? null,
    weight: p.weight ?? null,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    stock: p.stock,
    sku: p.sku,
    image_url: p.image,
    gallery: p.gallery ?? [],
    description: p.description,
    tasting: p.tasting ?? null,
    serving: p.serving ?? null,
    pairing: p.pairing ?? null,
    style: p.style ?? null,
    is_new: p.isNew,
    is_featured: p.isFeatured,
    is_premium: p.isPremium,
    is_alcohol: p.isAlcohol,
    is_published: true,
    sort_order: 0,
  }));
}

export function fallbackPromotions() {
  return PROMOTIONS.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    type: p.type,
    value: p.value,
    quantity: p.quantity ?? null,
    department: p.department ?? null,
    category: p.category ?? null,
    product_slugs: p.productSlugs ?? [],
    starts_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    active: true,
    members_only: p.membersOnly,
  }));
}

export function fallbackBanners() {
  return [
    {
      id: "banner-1",
      placement: "home_top",
      title: "Nouveautés de la cave",
      subtitle: "Découvrez les dernières arrivées",
      body: "Vins, champagnes et épicerie fine sélectionnés à Jérusalem.",
      image_url: IMAGES.hero,
      cta_label: "Découvrir",
      cta_href: "/nouveautes",
      theme: "gold",
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      active: true,
      sort_order: 1,
    },
    {
      id: "banner-2",
      placement: "home_mid",
      title: "Collection Prestige",
      subtitle: "Grands crus & millésimes rares",
      body: "Disponibilité limitée, conseil personnalisé.",
      image_url: IMAGES.plateau,
      cta_label: "Voir la collection",
      cta_href: "/prestige",
      theme: "bordeaux",
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 60 * 86400000).toISOString(),
      active: true,
      sort_order: 2,
    },
  ];
}

export function fallbackPageContent(pageKey: string) {
  const map: Record<string, { page_key: string; hero_title: string; hero_eyebrow: string; hero_subtitle: string; intro_html: string | null; seo_title: string; seo_description: string }> = {
    index: {
      page_key: "index",
      hero_title: "TERMINAL 3",
      hero_eyebrow: "Luxury Wine & Fine Delicatessen · Jérusalem",
      hero_subtitle: "L'art du bon goût.",
      intro_html: "Découvrez notre sélection de vins, grands crus, spiritueux, saumons fumés et charcuteries françaises.",
      seo_title: "TERMINAL 3 — Cave à vin & épicerie fine à Jérusalem",
      seo_description: "Luxury Wine & Fine Delicatessen à Jérusalem.",
    },
    vins: {
      page_key: "vins",
      hero_title: "Vins & Grands Crus",
      hero_eyebrow: "La cave",
      hero_subtitle: "Une sélection resserrée, dégustée bouteille par bouteille.",
      intro_html: null,
      seo_title: "Vins & Grands Crus — TERMINAL 3",
      seo_description: "Sélection de vins à Jérusalem.",
    },
    spiritueux: {
      page_key: "spiritueux",
      hero_title: "Spiritueux & Liqueurs",
      hero_eyebrow: "Le bar",
      hero_subtitle: "Whiskies, vodkas, gins, araks et liqueurs sélectionnés.",
      intro_html: null,
      seo_title: "Spiritueux & Liqueurs — TERMINAL 3",
      seo_description: "Spiritueux à Jérusalem.",
    },
    sarfati: {
      page_key: "sarfati",
      hero_title: "Sarfati — Saumon fumé",
      hero_eyebrow: "Signature",
      hero_subtitle: "Le saumon fumé Sarfati, fumage lent et tranchage à la main.",
      intro_html: null,
      seo_title: "Sarfati — Saumon fumé — TERMINAL 3",
      seo_description: "Saumon fumé à Jérusalem.",
    },
    charcuterie: {
      page_key: "charcuterie",
      hero_title: "Charcuterie française",
      hero_eyebrow: "L'épicerie",
      hero_subtitle: "Rosettes, saucissons secs, jambons et terrines de maisons françaises.",
      intro_html: null,
      seo_title: "Charcuterie française — TERMINAL 3",
      seo_description: "Charcuterie française à Jérusalem.",
    },
    plateaux: {
      page_key: "plateaux",
      hero_title: "Plateaux & Coffrets",
      hero_eyebrow: "Sur commande",
      hero_subtitle: "Plateaux composés pour vos réceptions, préparés le jour même.",
      intro_html: null,
      seo_title: "Plateaux & Coffrets — TERMINAL 3",
      seo_description: "Plateaux et coffrets à Jérusalem.",
    },
    prestige: {
      page_key: "prestige",
      hero_title: "Collection Prestige",
      hero_eyebrow: "Prestige",
      hero_subtitle: "Grands crus, millésimes rares et coffrets numérotés.",
      intro_html: null,
      seo_title: "Collection Prestige — TERMINAL 3",
      seo_description: "Vins premium à Jérusalem.",
    },
    promotions: {
      page_key: "promotions",
      hero_title: "Promotions en cours",
      hero_eyebrow: "Offres",
      hero_subtitle: "Les remises s'appliquent automatiquement dans votre panier.",
      intro_html: null,
      seo_title: "Promotions en cours — TERMINAL 3",
      seo_description: "Promotions Terminal 3.",
    },
    nouveautes: {
      page_key: "nouveautes",
      hero_title: "Nouveautés",
      hero_eyebrow: "Vient d'arriver",
      hero_subtitle: "Les dernières références arrivées en cave.",
      intro_html: null,
      seo_title: "Nouveautés — TERMINAL 3",
      seo_description: "Nouveautés Terminal 3.",
    },
    bonnes_affaires: {
      page_key: "bonnes-affaires",
      hero_title: "Bonnes affaires",
      hero_eyebrow: "Bons plans",
      hero_subtitle: "Nos meilleures opportunités.",
      intro_html: null,
      seo_title: "Bonnes affaires — TERMINAL 3",
      seo_description: "Bonnes affaires Terminal 3.",
    },
  };
  return map[pageKey] ?? map.index;
}

export function fallbackDeliveryZones() {
  return [
    {
      id: "zone-1",
      name: "Jérusalem centre",
      city: "Jérusalem",
      radius_km: 5,
      postal_codes: ["94100", "94101", "94200"],
      min_order: 150,
      fee: 25,
      active: true,
    },
  ];
}
