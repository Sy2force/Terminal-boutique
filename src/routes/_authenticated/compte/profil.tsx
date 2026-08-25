import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getProfile, updateProfile } from "@/backend/functions/client.functions";

export const Route = createFileRoute("/_authenticated/compte/profil")({
  loader: async () => getProfile(),
  component: ProfilePage,
});

function ProfilePage() {
  const profile = Route.useLoaderData();
  const mutate = useServerFn(updateProfile);
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
  });
  const [saved, setSaved] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutate({ data: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Mon profil</h1>
        <p className="text-muted-foreground text-sm mt-2 font-light">{profile?.email}</p>
      </div>
      <form onSubmit={submit} className="card-luxe p-8 rounded-[2px] space-y-6">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Nom complet</label>
          <input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Téléphone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
          />
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-gold btn-gold-hover px-8 py-3 text-[11px] uppercase tracking-[0.3em]">
            Enregistrer
          </button>
          {saved && <span className="text-gold-soft text-sm">Profil mis à jour.</span>}
        </div>
      </form>
    </div>
  );
}
