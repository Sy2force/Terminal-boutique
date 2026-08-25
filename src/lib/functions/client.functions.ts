import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/lib/auth-middleware";
import { getAdminSupabase } from "@/lib/supabase-server";
import { calculateTotals } from "@/lib/order-calculator";
export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { user, supabase } = context as any;
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error) throw new Error(error.message);
    return data;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((payload: { full_name?: string; phone?: string }) => payload)
  .handler(async ({ context, data }) => {
    const { user, supabase } = context as { user: { id: string }; supabase: any };
    const { error } = await supabase.from("profiles").update(data).eq("id", user.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyFavorites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { user, supabase } = context as { user: { id: string }; supabase: any };
    const { data, error } = await supabase
      .from("favorites")
      .select("*, product:products(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((productId: string) => productId)
  .handler(async ({ context, data: productId }) => {
    const { user, supabase } = context as { user: { id: string }; supabase: any };
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
      if (error) throw new Error(error.message);
      return { favorited: false };
    }

    const { error } = await supabase.from("favorites").insert({ user_id: user.id, product_id: productId });
    if (error) throw new Error(error.message);
    return { favorited: true };
  });

export const listMyWishlist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { user, supabase } = context as { user: { id: string }; supabase: any };
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*, product:products(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const addToWishlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((payload: { productId: string; note?: string }) => payload)
  .handler(async ({ context, data }) => {
    const { user, supabase } = context as { user: { id: string }; supabase: any };
    const { error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: user.id, product_id: data.productId, note: data.note });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeWishlistItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const { user, supabase } = context as { user: { id: string }; supabase: any };
    const { error } = await supabase.from("wishlist_items").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

interface OrderItemInput {
  slug: string;
  quantity: number;
}

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (payload: {
      items: OrderItemInput[];
      fulfillment: "pickup" | "delivery";
      address?: string;
      city?: string;
      postalCode?: string;
      notes?: string;
      requestedSlot?: string;
      legalAgeConfirmed?: boolean;
    }) => payload
  )
  .handler(async ({ context, data }) => {
    const { user, supabase } = context as { user: { id: string }; supabase: any };

    if (!data.items.length) throw new Error("Panier vide");

    const slugs = data.items.map((i) => i.slug);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .in("slug", slugs);
    if (productsError || !products) throw new Error("Impossible de charger les produits");

    const typedProducts = products as any[];
    const lookup = new Map(typedProducts.map((p: any) => [p.slug, p]));
    const containsAlcohol = typedProducts.some((p: any) => p.is_alcohol);

    if (containsAlcohol && !data.legalAgeConfirmed) {
      throw new Error("Vous devez certifier être majeur pour commander de l''alcool");
    }

    const admin = getAdminSupabase();
    const totals = await calculateTotals(data.items, products);

    const orderNumber = `T3-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${String(
      Date.now() % 1000
    ).padStart(3, "0")}`;

    const profile = await supabase.from("profiles").select("full_name, phone, email").eq("id", user.id).single();

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        channel: "web",
        customer_name: profile.data?.full_name ?? "",
        customer_phone: profile.data?.phone ?? "",
        customer_email: profile.data?.email ?? "",
        fulfillment: data.fulfillment,
        address: data.address ?? null,
        city: data.city ?? null,
        postal_code: data.postalCode ?? null,
        notes: data.notes ?? null,
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        promotion_label: totals.promotionLabel,
        contains_alcohol: containsAlcohol,
        requested_slot: data.requestedSlot ?? null,
      })
      .select("id")
      .single();

    if (orderError || !order) throw new Error(orderError?.message ?? "Échec de création de commande");

    const orderItems = data.items.map((item) => {
      const product = lookup.get(item.slug) as any;
      if (!product) throw new Error("Produit introuvable");
      if (product.stock < item.quantity) throw new Error(`Stock insuffisant pour ${product.name}`);
      return {
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: item.quantity,
        line_total: Number(product.price) * item.quantity,
      };
    });

    const { error: itemsError } = await admin.from("order_items").insert(orderItems);
    if (itemsError) throw new Error(itemsError.message);

    // decrement stock
    for (const item of data.items) {
      const product = lookup.get(item.slug) as any;
      const { error: stockError } = await admin
        .from("products")
        .update({ stock: product.stock - item.quantity })
        .eq("id", product.id);
      if (stockError) throw new Error(stockError.message);
    }

    return { orderId: order.id, orderNumber };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { user, supabase } = context as { user: { id: string }; supabase: any };
    const { data, error } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const { user, supabase } = context as { user: { id: string }; supabase: any };
    const { data, error } = await supabase
      .from("orders")
      .select("*, items:order_items(*), events:order_events(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  });
