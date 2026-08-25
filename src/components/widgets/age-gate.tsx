import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SITE } from "@/lib/site";

const STORAGE_KEY = "t3-age-ok";

export function AgeGate() {
  const [visible, setVisible] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    try {
      const ok = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
      if (!ok) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-6 text-center"
        >
          <span className="font-display text-cream text-2xl tracking-[0.42em] uppercase mb-8">{SITE.name}</span>
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">Avez-vous 18 ans ou plus ?</h2>
          <p className="text-muted-foreground max-w-md mb-10 font-light">
            Ce site présente des boissons alcoolisées. L'accès est réservé aux personnes majeures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={accept}
              className="bg-primary text-primary-foreground px-10 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
            >
              J'ai 18 ans ou plus
            </button>
            <button
              type="button"
              onClick={() => setDenied(true)}
              className="border border-primary/50 text-primary px-10 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Non
            </button>
          </div>
          {denied && (
            <p className="mt-6 text-destructive text-sm">
              Désolé, vous devez être majeur pour accéder à ce site.
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
