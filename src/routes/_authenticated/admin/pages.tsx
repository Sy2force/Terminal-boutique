import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listAdminPageContent, updatePageContent } from "@/lib/functions/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  loader: async () => listAdminPageContent(),
  component: AdminPages,
});

function AdminPages() {
  const pages = Route.useLoaderData();
  const mutate = useServerFn(updatePageContent);
  const [editing, setEditing] = useState(pages[0]);

  const save = async () => {
    if (!editing) return;
    await mutate({ data: { id: editing.id, content: editing } });
  };

  if (!editing) return null;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Pages</h1>
        <p className="text-muted-foreground text-sm mt-2 font-light">Modifiez les contenus publics de chaque page.</p>
      </div>
      <div className="card-luxe p-6 md:p-8 rounded-[2px] space-y-6">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Page</label>
          <select
            value={editing.id}
            onChange={(e) => setEditing(pages.find((p) => p.id === e.target.value) ?? pages[0])}
            className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
          >
            {pages.map((p) => (
              <option key={p.id} value={p.id}>{p.page_key}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ["hero_eyebrow", "Eyebrow"],
            ["hero_title", "Titre héros"],
            ["hero_subtitle", "Sous-titre"],
            ["hero_image_url", "Image héros URL"],
            ["seo_title", "SEO title"],
            ["seo_description", "SEO description"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">{label}</label>
              <input
                value={String((editing as any)[key] ?? "")}
                onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Introduction</label>
          <textarea
            value={editing.intro_html ?? ""}
            onChange={(e) => setEditing({ ...editing, intro_html: e.target.value })}
            rows={5}
            className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
          />
        </div>
        <button
          onClick={save}
          className="btn-gold btn-gold-hover px-10 py-4 text-[11px] uppercase tracking-[0.3em]"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
