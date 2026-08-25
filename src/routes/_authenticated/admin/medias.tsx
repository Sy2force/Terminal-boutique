import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "@/shared/lib/supabase";

export const Route = createFileRoute("/_authenticated/admin/medias")({
  component: AdminMedias,
});

function AdminMedias() {
  const supabase = createBrowserSupabase();
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.storage.from("media").list("", { limit: 100 });
    if (error) {
      setError(error.message);
      return;
    }
    setFiles((data ?? []).map((f) => f.name));
  };

  useEffect(() => {
    load();
  }, [supabase]);

  const upload = async (fileList: FileList | null) => {
    if (!supabase || !fileList) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(fileList)) {
      const { error } = await supabase.storage.from("media").upload(file.name, file, { upsert: true });
      if (error) setError(error.message);
    }
    setUploading(false);
    load();
  };

  const remove = async (name: string) => {
    if (!supabase || !confirm(`Supprimer ${name} ?`)) return;
    const { error } = await supabase.storage.from("media").remove([name]);
    if (error) setError(error.message);
    load();
  };

  const publicUrl = (name: string) => {
    if (!supabase) return "";
    const { data } = supabase.storage.from("media").getPublicUrl(name);
    return data.publicUrl;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-cream text-shadow-gold">Médiathèque</h1>
        <p className="text-muted-foreground text-sm mt-2 font-light">
          Bucket Supabase Storage "media". Copiez l'URL d'une image pour l'utiliser sur un produit ou une banderole.
        </p>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-primary/20 rounded-[2px] p-16 text-center cursor-pointer hover:border-primary/50 transition-colors"
      >
        <p className="text-muted-foreground text-sm">
          {uploading ? "Envoi en cours..." : "Cliquez ou glissez-déposez vos images ici"}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.map((name) => (
          <div key={name} className="card-luxe p-3 rounded-[2px] space-y-3">
            <div className="aspect-square overflow-hidden bg-secondary">
              <img src={publicUrl(name)} alt={name} className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground truncate" title={name}>{name}</p>
              <input readOnly value={publicUrl(name)} className="w-full text-[10px] bg-transparent border border-primary/10 text-muted-foreground px-2 py-1 rounded-[2px]" />
              <button onClick={() => remove(name)} className="text-xs text-destructive hover:text-cream uppercase tracking-wider">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
