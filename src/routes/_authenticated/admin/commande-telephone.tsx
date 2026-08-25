import { createFileRoute } from "@tanstack/react-router";
import { createPhoneOrder } from "@/backend/functions/admin.functions";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/admin/commande-telephone")({
  component: PhoneOrder,
});

function PhoneOrder() {
  const submit = useServerFn(createPhoneOrder);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    fulfillment: "pickup" as const,
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    requestedSlot: "",
    items: [{ slug: "", quantity: 1 }],
  });

  const submitOrder = async () => {
    await submit({ data: form });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display text-3xl text-cream">Commande par téléphone</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          placeholder="Nom client"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="bg-transparent border border-input text-cream px-4 py-3 rounded-[2px]"
        />
        <input
          placeholder="Téléphone"
          value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          className="bg-transparent border border-input text-cream px-4 py-3 rounded-[2px]"
        />
      </div>
      <button
        onClick={submitOrder}
        className="bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em]"
      >
        Créer la commande
      </button>
    </div>
  );
}
