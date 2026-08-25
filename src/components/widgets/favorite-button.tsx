import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createBrowserSupabase } from "@/shared/lib/supabase";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

export function FavoriteButton({ productId, className = "" }: FavoriteButtonProps) {
  const supabase = createBrowserSupabase();
  const [isFav, setIsFav] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return setReady(true);
      supabase
        .from("favorites")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          setIsFav(!!data);
          setReady(true);
        });
    });
  }, [supabase, productId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    if (isFav) {
      await supabase.from("favorites").delete().eq("product_id", productId).eq("user_id", user.id);
      setIsFav(false);
    } else {
      await supabase.from("favorites").insert({ product_id: productId, user_id: user.id });
      setIsFav(true);
    }
  };

  if (!ready || !supabase) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`p-2 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-[2px] ${className}`}
    >
      <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
    </button>
  );
}
