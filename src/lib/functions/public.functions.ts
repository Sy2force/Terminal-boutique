import { createServerFn } from "@tanstack/react-start";
import { getPublicSupabase } from "@/lib/supabase-server";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

export const listPromotions = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicSupabase();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("active", true)
    .lte("starts_at", now)
    .gte("ends_at", now)
    .order("starts_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listBanners = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicSupabase();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("active", true)
    .lte("starts_at", now)
    .gte("ends_at", now)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPageContent = createServerFn({ method: "GET" })
  .validator((pageKey: string) => pageKey)
  .handler(async ({ data: pageKey }) => {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase.from("page_content").select("*").eq("page_key", pageKey).single();
    if (error) throw new Error(error.message);
    return data;
  });

export const listDeliveryZones = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase.from("delivery_zones").select("*").eq("active", true);
  if (error) throw new Error(error.message);
  return data ?? [];
});
