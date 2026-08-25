import type { Product, Promotion } from "@/types/product";

export function mapDbProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    department: p.department,
    category: p.category,
    country: p.country,
    region: p.region ?? undefined,
    grape: p.grape ?? undefined,
    year: p.year ?? undefined,
    volume: p.volume ?? undefined,
    weight: p.weight ?? undefined,
    price: Number(p.price),
    compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
    stock: p.stock,
    sku: p.sku,
    image: p.image_url ?? "",
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    description: p.description ?? "",
    tasting: p.tasting ?? undefined,
    serving: p.serving ?? undefined,
    pairing: p.pairing ?? undefined,
    style: p.style ?? undefined,
    isNew: p.is_new,
    isFeatured: p.is_featured,
    isPremium: p.is_premium,
    isAlcohol: p.is_alcohol,
    createdAt: p.created_at,
  };
}

export function mapDbPromotion(p: any): Promotion {
  return {
    id: p.id,
    name: p.name,
    subtitle: p.subtitle ?? undefined,
    type: p.type,
    value: Number(p.value),
    quantity: p.quantity ?? undefined,
    department: p.department ?? undefined,
    category: p.category ?? undefined,
    productSlugs: Array.isArray(p.product_slugs) ? p.product_slugs : undefined,
    startsAt: p.starts_at,
    endsAt: p.ends_at,
    active: p.active,
    membersOnly: p.members_only,
  };
}
