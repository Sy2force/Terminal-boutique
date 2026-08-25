export type Department = "vins" | "spiritueux" | "saumon" | "charcuterie" | "plateaux";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  department: Department;
  category: string;
  country: string;
  region?: string;
  grape?: string;
  year?: number;
  volume?: string;
  weight?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  image: string;
  gallery?: string[];
  description: string;
  tasting?: string;
  serving?: string;
  pairing?: string;
  style?: "Sec" | "Fruité" | "Boisé" | "Doux";
  isNew?: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  isAlcohol: boolean;
  createdAt: string;
  createdDaysAgo?: number;
}

export type PromotionType = "percent" | "fixed" | "special_price" | "x_for_y" | "bundle";

export interface Promotion {
  id: string;
  name: string;
  subtitle?: string;
  type: PromotionType;
  value: number;
  quantity?: number;
  department?: Department;
  category?: string;
  productSlugs?: string[];
  startsAt: string;
  endsAt: string;
  active: boolean;
  membersOnly?: boolean;
}
