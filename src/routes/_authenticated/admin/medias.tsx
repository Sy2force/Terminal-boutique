import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/medias")({
  component: AdminMedias,
});

function AdminMedias() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-cream">Médiathèque</h1>
      <p className="text-muted-foreground font-light">
        Glissez-déposez vos images ici. Chaque fichier doit avoir un texte alternatif.
      </p>
      <div className="border-2 border-dashed border-primary/20 rounded-[2px] p-16 text-center">
        <p className="text-muted-foreground text-sm">Zone de dépôt à implémenter avec Supabase Storage.</p>
      </div>
    </div>
  );
}
