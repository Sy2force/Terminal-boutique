export const SITE = {
  name: "TERMINAL 3",
  tagline: "L'art du bon goût.",
  positioning: "Luxury Wine & Fine Delicatessen",
  city: "Jérusalem",
  address: "Terminal 3 — Jérusalem, Israël",
  email: "contact@terminal3.co.il",
  whatsappNumber: "972500000000",
  whatsappMessage: "Bonjour Terminal 3, je voudrais avoir des informations concernant vos produits.",
  legalAge: 18,
} as const;

export const whatsappHref = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

export function orderWhatsAppHref(lines: string[], total: number) {
  const header = "Bonjour Terminal 3, je souhaite passer commande :";
  const body = lines.map((l) => `• ${l}`).join("\n");
  const footer = `Total estimé : ${Math.round(total)} ₪\nMerci de me confirmer la disponibilité.`;
  const text = `${header}\n\n${body}\n\n${footer}`;
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
