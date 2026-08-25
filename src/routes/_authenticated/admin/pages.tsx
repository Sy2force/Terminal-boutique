import { createFileRoute } from "@tanstack/react-router";
import { listAdminPageContent, updatePageContent } from "@/lib/functions/admin.functions";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

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
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display text-3xl text-cream">Pages</h1>
      <select
        value={editing.id}
        onChange={(e) => setEditing(pages.find((p) => p.id === e.target.value) ?? pages[0])}
        className="bg-background border border-input text-cream px-4 py-3 text-sm rounded-[2px] w-full"
      >
        {pages.map((p) => (
          <option key={p.id} value={p.id}>
            {p.page_key}
          </option>
        ))}
      </select>
      <div className="space-y-4">
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
              className="w-full bg-transparent border border-input text-cream px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-[2px]"
            />
          </div>
        ))}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Introduction</label>
          <textarea
            value={editing.intro_html ?? ""}
            onChange={(e) => setEditing({ ...editing, intro_html: e.target.value })}
            rows={4}
            className="w-full bg-transparent border border-input text-cream px-4 py-3 text-sm focus:outline-none focus:border-primary rounded-[2px]"
          />
        </div>
      </div>
      <button
        onClick={save}
        className="bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
      >
        Enregistrer
      </button>
    </div>
  );
}
