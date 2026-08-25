export type AppRole = "admin" | "staff" | "client";

export type PromotionType = "percent" | "fixed" | "special_price" | "x_for_y" | "bundle";
export type BannerPlacement = "home_top" | "home_mid" | "category" | "global_ribbon";
export type BannerTheme = "gold" | "bordeaux" | "dark";
export type PageKey =
  | "index"
  | "vins"
  | "spiritueux"
  | "sarfati"
  | "charcuterie"
  | "plateaux"
  | "prestige"
  | "promotions"
  | "nouveautes"
  | "bonnes-affaires"
  | "contact";
export type OrderChannel = "web" | "phone";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";
export type PaymentStatus = "unpaid" | "paid";
export type PaymentMethod = "cash" | "card_in_store" | "card_on_delivery" | "bank_transfer";
export type Fulfillment = "pickup" | "delivery";
export type ProductStyle = "Sec" | "Fruité" | "Boisé" | "Doux";

export interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface ProfileInsert {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface ProfileUpdate {
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface UserRoleRow {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  department: string;
  category: string;
  country: string;
  region: string | null;
  grape: string | null;
  year: number | null;
  volume: string | null;
  weight: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  sku: string;
  image_url: string | null;
  gallery: string[] | null;
  description: string | null;
  summary: string | null;
  tasting: string | null;
  serving: string | null;
  pairing: string | null;
  style: ProductStyle | null;
  is_new: boolean;
  is_featured: boolean;
  is_premium: boolean;
  is_alcohol: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductInsert extends Omit<ProductRow, "id" | "created_at" | "updated_at"> {
  id?: string;
}

export interface ProductUpdate extends Partial<Omit<ProductRow, "id" | "created_at" | "updated_at" | "slug">> {}

export interface PromotionRow {
  id: string;
  name: string;
  subtitle: string | null;
  type: PromotionType;
  value: number;
  quantity: number | null;
  department: string | null;
  category: string | null;
  product_slugs: string[] | null;
  starts_at: string;
  ends_at: string;
  active: boolean;
  members_only: boolean;
}

export interface PromotionInsert extends Omit<PromotionRow, "id"> {
  id?: string;
}

export interface PromotionUpdate extends Partial<Omit<PromotionRow, "id">> {}

export interface BannerRow {
  id: string;
  placement: BannerPlacement;
  title: string;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  theme: BannerTheme;
  starts_at: string;
  ends_at: string;
  active: boolean;
  sort_order: number;
}

export interface BannerInsert extends Omit<BannerRow, "id"> {
  id?: string;
}

export interface BannerUpdate extends Partial<Omit<BannerRow, "id">> {}

export interface PageContentRow {
  id: string;
  page_key: PageKey;
  hero_title: string | null;
  hero_eyebrow: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  intro_html: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
}

export interface PageContentInsert extends Omit<PageContentRow, "id" | "updated_at"> {
  id?: string;
}

export interface PageContentUpdate extends Partial<Omit<PageContentRow, "id" | "updated_at" | "page_key">> {}

export interface FavoriteRow {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface WishlistItemRow {
  id: string;
  user_id: string;
  product_id: string;
  note: string | null;
  created_at: string;
}

export interface DeliveryZoneRow {
  id: string;
  name: string;
  city: string;
  radius_km: number | null;
  postal_codes: string[] | null;
  min_order: number;
  fee: number;
  active: boolean;
}

export interface OrderRow {
  id: string;
  order_number: string;
  user_id: string | null;
  channel: OrderChannel;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  fulfillment: Fulfillment;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  notes: string | null;
  subtotal: number;
  discount: number;
  total: number;
  promotion_label: string | null;
  status: OrderStatus;
  contains_alcohol: boolean;
  id_checked: boolean;
  id_checked_by: string | null;
  id_checked_at: string | null;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  paid_at: string | null;
  validated_by: string | null;
  validated_at: string | null;
  requested_slot: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface OrderEventRow {
  id: string;
  order_id: string;
  actor_id: string | null;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  comment: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      user_roles: {
        Row: UserRoleRow;
        Insert: Omit<UserRoleRow, "id"> & { id?: string };
        Update: Partial<Omit<UserRoleRow, "id">>;
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      promotions: {
        Row: PromotionRow;
        Insert: PromotionInsert;
        Update: PromotionUpdate;
      };
      banners: {
        Row: BannerRow;
        Insert: BannerInsert;
        Update: BannerUpdate;
      };
      page_content: {
        Row: PageContentRow;
        Insert: PageContentInsert;
        Update: PageContentUpdate;
      };
      favorites: {
        Row: FavoriteRow;
        Insert: Omit<FavoriteRow, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<FavoriteRow, "id" | "created_at">>;
      };
      wishlist_items: {
        Row: WishlistItemRow;
        Insert: Omit<WishlistItemRow, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<WishlistItemRow, "id" | "created_at">>;
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Omit<OrderRow, "id" | "created_at" | "updated_at">>;
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Omit<OrderItemRow, "id"> & { id?: string };
        Update: Partial<Omit<OrderItemRow, "id">>;
      };
      order_events: {
        Row: OrderEventRow;
        Insert: Omit<OrderEventRow, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<OrderEventRow, "id" | "created_at">>;
      };
      delivery_zones: {
        Row: DeliveryZoneRow;
        Insert: Omit<DeliveryZoneRow, "id"> & { id?: string };
        Update: Partial<Omit<DeliveryZoneRow, "id">>;
      };
    };
    Enums: {
      app_role: AppRole;
      promotion_type: PromotionType;
      banner_placement: BannerPlacement;
      banner_theme: BannerTheme;
      page_key: PageKey;
      order_channel: OrderChannel;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      payment_method: PaymentMethod;
      fulfillment: Fulfillment;
      product_style: ProductStyle;
    };
  };
}
