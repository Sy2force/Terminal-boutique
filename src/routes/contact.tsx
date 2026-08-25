import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE, whatsappHref } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TERMINAL 3" },
      { name: "description", content: "Contactez TERMINAL 3 à Jérusalem. Cave à vin, épicerie fine, livraison et retrait en magasin." },
      { property: "og:title", content: "Contact — TERMINAL 3" },
      { property: "og:description", content: "Cave à vin et épicerie fine à Jérusalem." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="pt-[4.5rem]">
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="Le magasin" title="Contactez-nous" />
        </Reveal>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Reveal delay={0.1}>
            <div className="space-y-10">
              <p className="text-muted-foreground font-light leading-relaxed">
                Notre cave et épicerie fine sont situées à Jérusalem. Nous sommes à votre disposition pour vous conseiller, préparer un plateau sur mesure ou répondre à vos commandes.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-cream text-sm">Adresse</p>
                    <p className="text-muted-foreground font-light text-sm">{SITE.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-cream text-sm">WhatsApp</p>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-muted-foreground font-light text-sm hover:text-gold transition-colors">
                      +{SITE.whatsappNumber}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-cream text-sm">E-mail</p>
                    <a href={`mailto:${SITE.email}`} className="text-muted-foreground font-light text-sm hover:text-gold transition-colors">
                      {SITE.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-cream text-sm">Horaires</p>
                    <p className="text-muted-foreground font-light text-sm">
                      Dimanche — Jeudi : 10h00 à 20h00<br />
                      Vendredi : 9h00 à 14h00<br />
                      Samedi : fermé
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <form className="card-luxe p-8 md:p-10 rounded-[2px] space-y-6" onSubmit={(e) => e.preventDefault()}>
              <h2 className="font-display text-2xl text-cream">Envoyer un message</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Nom</label>
                  <input className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Téléphone</label>
                  <input className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">E-mail</label>
                <input type="email" className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Message</label>
                <textarea rows={5} className="w-full input-luxe px-4 py-3 text-sm rounded-[2px] focus:outline-none input-luxe-focus" />
              </div>
              <button type="submit" className="btn-gold btn-gold-hover px-10 py-4 text-[11px] uppercase tracking-[0.3em]">
                Envoyer
              </button>
              <p className="text-xs text-muted-foreground font-light">
                Le formulaire ouvre WhatsApp. Aucun message n'est stocké automatiquement.
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
