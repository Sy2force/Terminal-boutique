import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/shared/lib/cart";
import { formatPrice } from "@/shared/lib/format";
import { createOrder } from "@/backend/functions/client.functions";
import { listProducts, listPromotions, listDeliveryZones } from "@/backend/functions/public.functions";
import { createBrowserSupabase } from "@/shared/lib/supabase";
import { useServerFn } from "@tanstack/react-start";
import { whatsappHref } from "@/shared/lib/site";
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finaliser la commande — TERMINAL 3" },
      { name: "description", content: "Finalisez votre commande Terminal 3. Aucun paiement en ligne." },
      { property: "og:title", content: "Finaliser la commande — TERMINAL 3" },
      { property: "og:description", content: "Commande par WhatsApp, retrait en magasin ou livraison à Jérusalem." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, clear } = useCart();
  const supabase = createBrowserSupabase();
  const submit = useServerFn(createOrder);

  const [products, setProducts] = useState<any[] | null>(null);
  const [promotions, setPromotions] = useState<any[] | null>(null);
  const [zones, setZones] = useState<any[] | null>(null);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [confirmed, setConfirmed] = useState<{ orderNumber: string; total: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    mode: "pickup" as "pickup" | "delivery",
    address: "",
    city: "",
    postalCode: "",
    slot: "",
    note: "",
    legalAgeConfirmed: false,
  });

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ email: data.user.email ?? undefined });
    });
    Promise.all([listProducts(), listPromotions(), listDeliveryZones()]).then(([p, pr, z]) => {
      setProducts(p);
      setPromotions(pr);
      setZones(z);
    });
  }, [supabase]);

  const enriched = useMemo(() => {
    if (!products) return [];
    return items
      .map((item) => ({ item, product: products.find((p: any) => p.slug === item.slug) }))
      .filter((d) => d.product) as { item: typeof items[0]; product: any }[];
  }, [items, products]);

  const containsAlcohol = useMemo(() => enriched.some(({ product }) => product.is_alcohol), [enriched]);

  const totals = useMemo(() => {
    const subtotal = enriched.reduce((sum, { item, product }) => sum + Number(product.price) * item.qty, 0);
    let discount = 0;
    for (const promo of promotions ?? []) {
      if (!promo.active) continue;
      if (promo.type === "percent") {
        discount += subtotal * (Number(promo.value) / 100);
      }
      if (promo.type === "fixed") {
        discount += Math.min(Number(promo.value), subtotal);
      }
      if (promo.type === "special_price") {
        const eligible = enriched
          .filter(({ product }) => !promo.department || product.department === promo.department)
          .filter(({ product }) => !promo.category || product.category === promo.category);
        const eligibleTotal = eligible.reduce((sum, { item, product }) => sum + Number(product.price) * item.qty, 0);
        if (eligible.length > 0 && eligibleTotal > Number(promo.value)) {
          discount += eligibleTotal - Number(promo.value);
        }
      }
    }
    return { subtotal, discount, total: Math.max(0, subtotal - discount) };
  }, [enriched, promotions]);

  const deliveryOk = useMemo(() => {
    if (form.mode !== "delivery" || !zones || !form.postalCode) return true;
    return zones.some((z: any) => z.postal_codes?.includes(form.postalCode));
  }, [form.mode, zones, form.postalCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (containsAlcohol && !form.legalAgeConfirmed) {
      setError("Vous devez certifier être majeur pour commander de l'alcool.");
      return;
    }
    if (form.mode === "delivery" && !deliveryOk) {
      setError("Cette adresse n'est pas dans nos zones de livraison.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await submit({
        data: {
          items: items.map((i) => ({ slug: i.slug, quantity: i.qty })),
          fulfillment: form.mode,
          address: form.mode === "delivery" ? form.address : undefined,
          city: form.mode === "delivery" ? form.city : undefined,
          postalCode: form.mode === "delivery" ? form.postalCode : undefined,
          notes: form.note,
          requestedSlot: form.slot,
          legalAgeConfirmed: form.legalAgeConfirmed,
        },
      });
      setConfirmed({ orderNumber: res.orderNumber, total: totals.total });
      clear();
    } catch (err: any) {
      setError(err?.message ?? "Échec de la commande");
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-[6rem] min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-3xl text-cream mb-6">Connexion requise</h1>
        <p className="text-muted-foreground font-light mb-8 max-w-md">
          Connectez-vous pour finaliser votre commande et bénéficier du suivi.
        </p>
        <Link to="/auth" className="btn-gold btn-gold-hover px-8 py-4 text-[11px] uppercase tracking-[0.3em]">
          Se connecter / Créer un compte
        </Link>
      </div>
    );
  }

  if (confirmed) {
    const message = `Bonjour TERMINAL 3, j'ai passé la commande ${confirmed.orderNumber} pour un total de ${formatPrice(confirmed.total)}. Merci !`;
    const waLink = `${whatsappHref}&text=${encodeURIComponent(message)}`;
    return (
      <div className="pt-[6rem] min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <CheckCircle className="w-16 h-16 text-gold mb-6" />
        <p className="eyebrow mb-4">Commande enregistrée</p>
        <h1 className="font-display text-3xl md:text-4xl text-cream mb-4">{confirmed.orderNumber}</h1>
        <p className="text-muted-foreground font-light mb-2">Total à payer sur place : <span className="text-primary">{formatPrice(confirmed.total)}</span></p>
        <p className="text-muted-foreground font-light mb-8 max-w-md">Nous vous confirmons par WhatsApp. Le paiement se fait au retrait ou à la livraison.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href={waLink} target="_blank" rel="noreferrer" className="btn-gold btn-gold-hover inline-flex items-center justify-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.3em]">
            <MessageCircle className="w-4 h-4" /> Confirmer par WhatsApp
          </a>
          <Link to="/compte/commandes" className="inline-flex items-center justify-center gap-3 border border-primary/50 text-primary px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-colors">
            Voir mes commandes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-[6rem] min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-3xl md:text-4xl text-cream mb-4">Votre panier est vide.</h1>
        <Link to="/vins" className="btn-gold btn-gold-hover px-8 py-4 text-[11px] uppercase tracking-[0.3em]">
          Découvrir la cave
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[4.5rem] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
        <h1 className="font-display text-3xl md:text-5xl text-cream text-shadow-gold mb-12">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Nom</label>
                <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Téléphone</label>
                <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">E-mail</label>
              <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-3">Mode de réception</span>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="mode" value="pickup" checked={form.mode === "pickup"} onChange={() => setForm({ ...form, mode: "pickup" })} className="accent-primary w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Retrait en magasin</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="mode" value="delivery" checked={form.mode === "delivery"} onChange={() => setForm({ ...form, mode: "delivery" })} className="accent-primary w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Livraison</span>
                </label>
              </div>
            </div>

            {form.mode === "delivery" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Adresse</label>
                  <textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required={form.mode === "delivery"} rows={3} className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Ville</label>
                    <input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Code postal</label>
                    <input id="postalCode" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
                  </div>
                </div>
                {form.postalCode && !deliveryOk && (
                  <p className="text-destructive text-sm">Nous ne livrons pas encore cette adresse, le retrait en magasin reste possible.</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="slot" className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Créneau souhaité</label>
              <input id="slot" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })} placeholder="ex. Jeudi 14h" className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
            </div>

            <div>
              <label htmlFor="note" className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Note</label>
              <textarea id="note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3} className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
            </div>

            {containsAlcohol && (
              <div className="bg-bordeaux/10 border border-bordeaux/30 p-4 rounded-[2px] space-y-3">
                <p className="text-cream text-sm">
                  Votre panier contient des produits alcoolisés. La Teoudat Zeout (pièce d'identité) est obligatoire au retrait ou à la livraison.
                </p>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-muted-foreground">
                  <input type="checkbox" checked={form.legalAgeConfirmed} onChange={(e) => setForm({ ...form, legalAgeConfirmed: e.target.checked })} className="accent-primary w-4 h-4" />
                  Je certifie avoir 18 ans ou plus
                </label>
              </div>
            )}

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button
              type="submit"
              disabled={busy || (form.mode === "delivery" && !deliveryOk)}
              className="inline-flex items-center justify-center gap-3 btn-gold btn-gold-hover px-8 py-4 text-[11px] uppercase tracking-[0.3em] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? "Envoi..." : "Confirmer ma commande"}
            </button>
            <p className="text-xs text-muted-foreground font-light">
              Aucun paiement en ligne : le règlement se fait sur place au retrait ou à la livraison.
            </p>
          </form>

          <aside className="lg:sticky lg:top-24 h-fit p-6 md:p-8 card-luxe glow-gold rounded-[2px]">
            <h2 className="font-display text-2xl text-cream mb-6">Récapitulatif</h2>
            <div className="space-y-4">
              {enriched.map(({ item, product }) => (
                <div key={product.slug} className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-light">{product.name} × {item.qty}</span>
                  <span className="text-foreground">{formatPrice(Number(product.price) * item.qty)}</span>
                </div>
              ))}
              <div className="h-px bg-primary/20" />
              <div className="flex justify-between text-sm text-muted-foreground font-light">
                <span>Sous-total</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-sm text-primary font-medium">
                  <span>Promotions</span>
                  <span>− {formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="h-px bg-primary/20" />
              <div className="flex justify-between text-lg text-cream font-display">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totals.total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
