import { getPublicSupabase } from "@/backend/supabase-server";
import type { ProductRow, PromotionRow } from "@/shared/types/database";

interface CartItemInput {
  slug: string;
  quantity: number;
}

function promotionApplies(promo: PromotionRow, product: ProductRow) {
  if (promo.product_slugs && promo.product_slugs.length > 0) {
    return promo.product_slugs.includes(product.slug);
  }
  if (promo.category && product.category === promo.category) return true;
  if (promo.department && product.department === promo.department) return true;
  return false;
}

function discountFor(promo: PromotionRow, product: ProductRow, quantity: number) {
  const unitPrice = Number(product.price);
  switch (promo.type) {
    case "percent":
      return unitPrice * (promo.value / 100) * quantity;
    case "fixed":
      return Math.min(promo.value * quantity, unitPrice * quantity);
    case "special_price":
      return Math.max(0, (unitPrice - promo.value) * quantity);
    case "x_for_y": {
      if (!promo.quantity || promo.quantity <= 0 || quantity < promo.quantity) return 0;
      const sets = Math.floor(quantity / promo.quantity);
      const normalSets = sets * promo.quantity;
      return normalSets * unitPrice - sets * promo.value;
    }
    case "bundle": {
      const bundleSize = promo.quantity || 2;
      if (quantity < bundleSize) return 0;
      const sets = Math.floor(quantity / bundleSize);
      return sets * promo.value;
    }
    default:
      return 0;
  }
}

function bestPromotionFor(promos: PromotionRow[], product: ProductRow, quantity: number) {
  const applicable = promos.filter((p) => promotionApplies(p, product));
  if (applicable.length === 0) return null;
  return applicable.reduce((best, current) => {
    const bestDiscount = discountFor(best, product, quantity);
    const currentDiscount = discountFor(current, product, quantity);
    return currentDiscount > bestDiscount ? current : best;
  });
}

export async function calculateTotals(items: CartItemInput[], products: ProductRow[]) {
  const supabase = getPublicSupabase();
  const now = new Date().toISOString();
  const { data: promos } = await supabase
    .from("promotions")
    .select("*")
    .eq("active", true)
    .lte("starts_at", now)
    .gte("ends_at", now);

  const activePromos = (promos ?? []) as PromotionRow[];
  let subtotal = 0;
  let discount = 0;
  const promoNames: string[] = [];
  const lookup = new Map(products.map((p) => [p.slug, p]));

  for (const item of items) {
    const product = lookup.get(item.slug);
    if (!product) continue;
    subtotal += Number(product.price) * item.quantity;

    const promo = bestPromotionFor(activePromos, product, item.quantity);
    if (promo) {
      discount += discountFor(promo, product, item.quantity);
      if (!promoNames.includes(promo.name)) promoNames.push(promo.name);
    }
  }

  discount = Math.round(discount);
  const total = Math.max(0, Math.round(subtotal - discount));

  return {
    subtotal: Math.round(subtotal),
    discount,
    total,
    promotionLabel: promoNames.join(" + ") || null,
  };
}
