import type { Product, Promotion } from "@/types/product";

export function promotionApplies(promo: Promotion, product: Product) {
  if (!promo.active) return false;
  const now = Date.now();
  if (new Date(promo.startsAt).getTime() > now) return false;
  if (new Date(promo.endsAt).getTime() < now) return false;
  if (promo.membersOnly) return false;

  if (promo.productSlugs && promo.productSlugs.length > 0) {
    return promo.productSlugs.includes(product.slug);
  }
  if (promo.category && product.category === promo.category) return true;
  if (promo.department && product.department === promo.department) return true;
  return false;
}

export function activePromotions(promos: Promotion[]) {
  const now = Date.now();
  return promos.filter((p) => {
    if (!p.active || p.membersOnly) return false;
    return new Date(p.startsAt).getTime() <= now && new Date(p.endsAt).getTime() >= now;
  });
}

export function discountFor(promo: Promotion, product: Product, quantity = 1) {
  const unitPrice = product.price;
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

export function bestPromotionFor(promo: Promotion[], product: Product, quantity = 1) {
  const applicable = activePromotions(promo).filter((p) => promotionApplies(p, product));
  if (applicable.length === 0) return null;

  return applicable.reduce((best, current) => {
    const bestDiscount = discountFor(best, product, quantity);
    const currentDiscount = discountFor(current, product, quantity);
    return currentDiscount > bestDiscount ? current : best;
  });
}

export interface CartItem {
  slug: string;
  qty: number;
}

export interface CartTotals {
  subtotal: number;
  discounts: { name: string; amount: number }[];
  total: number;
}

export function cartTotals(items: CartItem[], products: Product[], promos: Promotion[]): CartTotals {
  let subtotal = 0;
  const discounts: { name: string; amount: number }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.slug === item.slug);
    if (!product) continue;
    const lineSubtotal = product.price * item.qty;
    subtotal += lineSubtotal;

    const promo = bestPromotionFor(promos, product, item.qty);
    if (promo) {
      const amount = discountFor(promo, product, item.qty);
      if (amount > 0) {
        discounts.push({ name: promo.name, amount });
      }
    }
  }

  const totalDiscount = discounts.reduce((sum, d) => sum + d.amount, 0);
  return {
    subtotal,
    discounts,
    total: Math.max(0, subtotal - totalDiscount),
  };
}
