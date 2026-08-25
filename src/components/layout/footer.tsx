import { Link } from "@tanstack/react-router";
import { SITE, whatsappHref } from "@/lib/site";

const nav = [
  { label: "Accueil", to: "/" },
  { label: "Vins", to: "/vins" },
  { label: "Promotions", to: "/promotions" },
  { label: "Sarfati", to: "/sarfati" },
  { label: "Charcuterie", to: "/charcuterie" },
  { label: "Nouveautés", to: "/nouveautes" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-5">
            <Link to="/" className="font-display text-cream text-xl tracking-[0.42em] uppercase block">
              {SITE.name}
            </Link>
            <div className="rule-gold max-w-[120px]" />
            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              Luxury Wine & Fine Delicatessen. Vins, grands crus, spiritueux, saumon fumé et charcuterie française à Jérusalem.
            </p>
          </div>

          <div>
            <h4 className="eyebrow mb-5">Navigation</h4>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-5">Magasin</h4>
            <address className="not-italic space-y-3 text-sm text-muted-foreground font-light">
              <p>{SITE.address}</p>
              <p>
                <a href={whatsappHref} className="hover:text-primary transition-colors">
                  WhatsApp
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="hover:text-primary transition-colors">
                  {SITE.email}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h4 className="eyebrow mb-5">Informations</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-light">
              <li>Livraison à Jérusalem</li>
              <li>Retrait en magasin</li>
              <li className="text-xs opacity-80">
                L'abus d'alcool est dangereux pour la santé. Vente interdite aux moins de 18 ans.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            © {year} {SITE.name}. Tous droits réservés.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {SITE.positioning}
          </p>
        </div>
      </div>
    </footer>
  );
}
