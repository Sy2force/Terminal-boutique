import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
}

export function MediaPicker({ value, onChange }: MediaPickerProps) {
  const supabase = createBrowserSupabase();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open || !supabase) return;
    supabase.storage.from("media").list("", { limit: 100 }).then(({ data, error }) => {
      if (!error) setFiles((data ?? []).map((f) => f.name));
    });
  }, [open, supabase]);

  const publicUrl = (name: string) => {
    if (!supabase) return "";
    const { data } = supabase.storage.from("media").getPublicUrl(name);
    return data.publicUrl;
  };

  const upload = async (list: FileList | null) => {
    if (!supabase || !list) return;
    setUploading(true);
    for (const file of Array.from(list)) {
      await supabase.storage.from("media").upload(file.name, file, { upsert: true });
    }
    setUploading(false);
    supabase.storage.from("media").list("", { limit: 100 }).then(({ data }) => {
      setFiles((data ?? []).map((f) => f.name));
    });
  };

  return (
    <div className="space-y-3">
      <label className="block text-[11px] uppercase tracking-[0.25em] text-primary">Image</label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL de l'image"
          className="flex-1 input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="border border-primary/30 text-muted-foreground px-4 py-3 text-[11px] uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-colors rounded-[2px]"
        >
          {open ? "Fermer" : "Choisir"}
        </button>
      </div>
      {value && (
        <div className="w-24 h-24 overflow-hidden border border-primary/10 rounded-[2px] bg-secondary">
          <img src={value} alt="Aperçu" className="w-full h-full object-cover opacity-80" />
        </div>
      )}

      {open && (
        <div className="card-luxe p-4 rounded-[2px] space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              upload(e.dataTransfer.files);
            }}
            className="border border-dashed border-primary/20 rounded-[2px] p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <label className="text-muted-foreground text-sm cursor-pointer">
              {uploading ? "Envoi..." : "Glissez une image ou cliquez pour parcourir"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
            </label>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-60 overflow-y-auto">
            {files.map((name) => {
              const url = publicUrl(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(url);
                    setOpen(false);
                  }}
                  className={`aspect-square overflow-hidden border rounded-[2px] ${value === url ? "border-gold" : "border-primary/10"}`}
                >
                  <img src={url} alt={name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
