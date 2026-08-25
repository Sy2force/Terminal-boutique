import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/auth-middleware";
import { getAdminSupabase } from "@/lib/supabase-server";
import { calculateTotals } from "@/lib/order-calculator";
import type { ProductRow, PromotionRow, BannerRow, PageContentRow, DeliveryZoneRow, OrderStatus, PaymentMethod } from "@/types/database";

type ProductInsert = Omit<ProductRow, "id" | "created_at" | "updated_at"> & { id?: string };
type ProductUpdate = Partial<Omit<ProductRow, "id" | "created_at" | "updated_at">>;
type PromotionInsert = Omit<PromotionRow, "id"> & { id?: string };
type PromotionUpdate = Partial<Omit<PromotionRow, "id">>;
type BannerInsert = Omit<BannerRow, "id"> & { id?: string };
type BannerUpdate = Partial<Omit<BannerRow, "id">>;
type PageContentUpdate = Partial<Omit<PageContentRow, "id" | "updated_at">>;
type DeliveryZoneInsert = Omit<DeliveryZoneRow, "id"> & { id?: string };
type DeliveryZoneUpdate = Partial<Omit<DeliveryZoneRow, "id">>;

const adminFn = (method: "GET" | "POST") =>
  createServerFn({ method }).middleware([requireAdmin]);

// Dashboard
export const getDashboardStats = adminFn("GET").handler(async () => {
  const admin = getAdminSupabase();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [{ count: ordersToday }, { count: pendingOrders }, { count: unpaidOrders }, { count: lowStock }] = await Promise.all([
    admin.from("orders").select("*", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
    admin.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "unpaid").neq("status", "cancelled"),
    admin.from("products").select("*", { count: "exact", head: true }).lte("stock", 5).eq("is_published", true),
  ]);

  const { data: recentOrders } = await admin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: topProducts } = await admin
    .from("order_items")
    .select("product_name, product_id, quantity, line_total")
    .order("line_total", { ascending: false })
    .limit(10);

  return {
    ordersToday: ordersToday ?? 0,
    pendingOrders: pendingOrders ?? 0,
    unpaidOrders: unpaidOrders ?? 0,
    lowStock: lowStock ?? 0,
    recentOrders: recentOrders ?? [],
    topProducts: topProducts ?? [],
  };
});

// Products
export const listAdminProducts = adminFn("GET").handler(async () => {
  const admin = getAdminSupabase();
  const { data, error } = await admin.from("products").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const upsertProduct = adminFn("POST")
  .validator((payload: { id?: string; product: ProductInsert | ProductUpdate }) => payload)
  .handler(async ({ data }) => {
    const admin = getAdminSupabase();
    if (data.id) {
      const { data: updated, error } = await admin
        .from("products")
        .update(data.product)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    }
    const { data: inserted, error } = await admin.from("products").insert(data.product).select().single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteProduct = adminFn("POST")
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const admin = getAdminSupabase();
    const { error } = await admin.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const bulkUpdatePrices = adminFn("POST")
  .validator((payload: { ids: string[]; percent: number }) => payload)
  .handler(async ({ data }) => {
    const admin = getAdminSupabase();
    const factor = 1 + data.percent / 100;
    const { data: products, error } = await admin
      .from("products")
      .select("id, price")
      .in("id", data.ids);
    if (error) throw new Error(error.message);

    const updates = (products ?? []).map((p) => ({
      id: p.id,
      price: Math.round(Number(p.price) * factor * 100) / 100,
    }));

    for (const u of updates) {
      const { error: upErr } = await admin.from("products").update({ price: u.price }).eq("id", u.id);
      if (upErr) throw new Error(upErr.message);
    }

    return { ok: true };
  });

// Promotions
export const listAdminPromotions = adminFn("GET").handler(async () => {
  const admin = getAdminSupabase();
  const { data, error } = await admin.from("promotions").select("*").order("starts_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const upsertPromotion = adminFn("POST")
  .validator((payload: { id?: string; promotion: PromotionInsert | PromotionUpdate }) => payload)
  .handler(async ({ data }) => {
    const admin = getAdminSupabase();
    if (data.id) {
      const { data: updated, error } = await admin
        .from("promotions")
        .update(data.promotion)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    }
    const { data: inserted, error } = await admin.from("promotions").insert(data.promotion).select().single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deletePromotion = adminFn("POST")
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const admin = getAdminSupabase();
    const { error } = await admin.from("promotions").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Banners
export const listAdminBanners = adminFn("GET").handler(async () => {
  const admin = getAdminSupabase();
  const { data, error } = await admin.from("banners").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const upsertBanner = adminFn("POST")
  .validator((payload: { id?: string; banner: BannerInsert | BannerUpdate }) => payload)
  .handler(async ({ data }) => {
    const admin = getAdminSupabase();
    if (data.id) {
      const { data: updated, error } = await admin
        .from("banners")
        .update(data.banner)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    }
    const { data: inserted, error } = await admin.from("banners").insert(data.banner).select().single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteBanner = adminFn("POST")
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const admin = getAdminSupabase();
    const { error } = await admin.from("banners").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Page content
export const listAdminPageContent = adminFn("GET").handler(async () => {
  const admin = getAdminSupabase();
  const { data, error } = await admin.from("page_content").select("*").order("page_key", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const updatePageContent = adminFn("POST")
  .validator((payload: { id: string; content: PageContentUpdate }) => payload)
  .handler(async ({ data }) => {
    const admin = getAdminSupabase();
    const { data: updated, error } = await admin
      .from("page_content")
      .update(data.content)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });

// Media upload
export const uploadMedia = adminFn("POST")
  .validator(
    (payload: { fileBase64: string; fileName: string; contentType: string; alt: string }) => payload
  )
  .handler(async ({ data }) => {
    const admin = getAdminSupabase();
    const bucket = "media";
    const cleaned = data.fileBase64.replace(/^data:.*;base64,/, "");
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const path = `${Date.now()}-${data.fileName}`;

    const { data: upload, error } = await admin.storage.from(bucket).upload(path, bytes, {
      contentType: data.contentType,
      upsert: false,
    });

    if (error) throw new Error(error.message);

    const { data: publicUrl } = admin.storage.from(bucket).getPublicUrl(upload.path);
    return { url: publicUrl.publicUrl, alt: data.alt };
  });

// Orders
export const listAdminOrders = adminFn("GET")
  .validator((filters: { status?: string; channel?: string; search?: string }) => filters)
  .handler(async ({ data }) => {
    const admin = getAdminSupabase();
    let query = admin.from("orders").select("*").order("created_at", { ascending: false });
    if (data.status) query = query.eq("status", data.status);
    if (data.channel) query = query.eq("channel", data.channel);
    if (data.search) {
      query = query.or(
        `order_number.ilike.%${data.search}%,customer_name.ilike.%${data.search}%,customer_phone.ilike.%${data.search}%`
      );
    }
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getAdminOrder = adminFn("GET")
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const admin = getAdminSupabase();
    const { data, error } = await admin
      .from("orders")
      .select("*, items:order_items(*), events:order_events(*)")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

export const updateOrderStatus = adminFn("POST")
  .validator((payload: { id: string; status: OrderStatus; comment?: string }) => payload)
  .handler(async ({ context, data }) => {
    const { user } = context as { user: { id: string } };
    const admin = getAdminSupabase();

    const { data: order, error: fetchError } = await admin.from("orders").select("*").eq("id", data.id).single();
    if (fetchError || !order) throw new Error("Commande introuvable");

    const { error } = await admin
      .from("orders")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    await admin.from("order_events").insert({
      order_id: data.id,
      actor_id: user.id,
      from_status: order.status,
      to_status: data.status,
      comment: data.comment ?? null,
    });

    return { ok: true };
  });

export const confirmIdChecked = adminFn("POST")
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const { user } = context as { user: { id: string } };
    const admin = getAdminSupabase();
    const { error } = await admin
      .from("orders")
      .update({ id_checked: true, id_checked_by: user.id, id_checked_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const markOrderPaid = adminFn("POST")
  .validator(
    (payload: { id: string; method: PaymentMethod }) => payload
  )
  .handler(async ({ context, data }) => {
    const { user } = context as { user: { id: string } };
    const admin = getAdminSupabase();
    const { error } = await admin
      .from("orders")
      .update({
        payment_status: "paid",
        payment_method: data.method,
        paid_at: new Date().toISOString(),
        validated_by: user.id,
        validated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createPhoneOrder = adminFn("POST")
  .validator(
    (payload: {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      fulfillment: "pickup" | "delivery";
      address?: string;
      city?: string;
      postalCode?: string;
      notes?: string;
      requestedSlot?: string;
      items: { slug: string; quantity: number }[];
    }) => payload
  )
  .handler(async ({ data }) => {
    const admin = getAdminSupabase();

    const slugs = data.items.map((i) => i.slug);
    const { data: products, error: productsError } = await admin
      .from("products")
      .select("*")
      .in("slug", slugs);
    if (productsError || !products) throw new Error("Impossible de charger les produits");

    const lookup = new Map(products.map((p: any) => [p.slug, p]));
    const containsAlcohol = products.some((p: any) => p.is_alcohol);
    const totals = await calculateTotals(data.items, products as any);

    const orderNumber = `T3-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${String(
      Date.now() % 1000
    ).padStart(3, "0")}`;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: null,
        channel: "phone",
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail ?? null,
        fulfillment: data.fulfillment,
        address: data.address ?? null,
        city: data.city ?? null,
        postal_code: data.postalCode ?? null,
        notes: data.notes ?? null,
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        contains_alcohol: containsAlcohol,
        requested_slot: data.requestedSlot ?? null,
      })
      .select("id")
      .single();

    if (orderError || !order) throw new Error(orderError?.message ?? "Échec");

    const orderItems = data.items.map((item) => {
      const product = lookup.get(item.slug)!;
      return {
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: item.quantity,
        line_total: Number(product.price) * item.quantity,
      };
    });
    await admin.from("order_items").insert(orderItems);
    return { orderId: order.id, orderNumber };
  });

// Delivery zones
export const listAdminDeliveryZones = adminFn("GET").handler(async () => {
  const admin = getAdminSupabase();
  const { data, error } = await admin.from("delivery_zones").select("*").order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const upsertDeliveryZone = adminFn("POST")
  .validator((payload: { id?: string; zone: DeliveryZoneInsert | DeliveryZoneUpdate }) => payload)
  .handler(async ({ data }) => {
    const admin = getAdminSupabase();
    if (data.id) {
      const { data: updated, error } = await admin
        .from("delivery_zones")
        .update(data.zone)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    }
    const { data: inserted, error } = await admin.from("delivery_zones").insert(data.zone).select().single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteDeliveryZone = adminFn("POST")
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const admin = getAdminSupabase();
    const { error } = await admin.from("delivery_zones").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Clients
export const listAdminClients = adminFn("GET").handler(async () => {
  const admin = getAdminSupabase();
  const { data, error } = await admin
    .from("profiles")
    .select("*, orders:orders(id, total), favorites(id)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});
