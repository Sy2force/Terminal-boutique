import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Search, ShoppingBag, User, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/shared/lib/cart";
import { SITE } from "@/shared/lib/site";
import { createBrowserSupabase } from "@/shared/lib/supabase";

const nav = [
  { label: "Accueil", to: "/" },
  { label: "Vins", to: "/vins" },
  { label: "Promotions", to: "/promotions" },
  { label: "Sarfati", to: "/sarfati" },
  { label: "Charcuterie", to: "/charcuterie" },
  { label: "Spiritueux", to: "/spiritueux" },
  { label: "Plateaux", to: "/plateaux" },
  { label: "Nouveautés", to: "/nouveautes" },
  { label: "Contact", to: "/contact" },
];

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const { count } = useCart();
  const { pathname } = useLocation();
  const supabase = createBrowserSupabase();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ email: data.user.email });
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ? { email: session.user.email ?? undefined } : null);
    });
    return () => listener?.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 24);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-80 h-[4.5rem] flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "bg-background/95 backdrop-blur-xl border-b border-neon-gold glow-gold" : "bg-transparent border-b border-primary/10"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden p-2 text-cream hover:text-primary transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="font-display text-gold-gradient text-lg md:text-xl tracking-[0.42em] uppercase leading-none">
              {SITE.name}
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => {
              const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                    active ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            {user ? (
              <Link
                to="/compte/favoris"
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Favoris"
              >
                <Heart className="w-[18px] h-[18px]" />
              </Link>
            ) : null}
            <Link
              to={user ? "/compte" : "/auth"}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label={user ? "Mon compte" : "Se connecter"}
            >
              <User className="w-[18px] h-[18px]" />
            </Link>
            <Link
              to="/panier"
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-medium px-1">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-background/98 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-[4.5rem]">
              <span className="font-display text-gold-gradient text-lg tracking-[0.42em] uppercase">{SITE.name}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 text-cream hover:text-primary transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col items-center justify-center gap-6 overflow-y-auto px-6 pb-8">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="font-display text-2xl md:text-3xl text-cream hover:text-gold transition-colors tracking-[0.12em] uppercase"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-8 flex items-center gap-8">
                {user ? (
                  <Link to="/compte/favoris" className="p-3 text-muted-foreground hover:text-gold transition-colors" aria-label="Favoris">
                    <Heart className="w-6 h-6" />
                  </Link>
                ) : null}
                <Link to={user ? "/compte" : "/auth"} className="p-3 text-muted-foreground hover:text-gold transition-colors" aria-label={user ? "Mon compte" : "Se connecter"}>
                  <User className="w-6 h-6" />
                </Link>
                <Link to="/panier" className="p-3 text-muted-foreground hover:text-gold transition-colors" aria-label="Panier">
                  <ShoppingBag className="w-6 h-6" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
