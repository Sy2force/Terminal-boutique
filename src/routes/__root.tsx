import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/widgets/whatsapp-button";
import { AgeGate } from "@/components/widgets/age-gate";
import { SearchOverlay } from "@/components/widgets/search-overlay";
import { Toaster } from "sonner";
import { SITE } from "@/lib/site";
import { useState } from "react";
import "@/styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TERMINAL 3 — Cave à vin & épicerie fine à Jérusalem" },
      { name: "description", content: "Découvrez TERMINAL 3 à Jérusalem : vins, grands crus, spiritueux, saumon fumé Sarfati et charcuterie française. Luxury Wine & Fine Delicatessen." },
      { property: "og:site_name", content: SITE.name },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "TERMINAL 3 — Cave à vin & épicerie fine à Jérusalem" },
      { property: "og:description", content: "Vins, grands crus, spiritueux, saumon fumé et charcuterie française à Jérusalem." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#141210" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  const [searchOpen, setSearchOpen] = useState(false);

  const localBusinessJson = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    description: "Cave à vin et épicerie fine de luxe à Jérusalem. Vins, spiritueux, saumon fumé et charcuterie française.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jérusalem",
      addressCountry: "IL",
    },
    priceRange: "₪₪₪",
  };

  return (
    <html lang="fr" className="dark">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJson) }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-widest"
        >
          Aller au contenu
        </a>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <Header onOpenSearch={() => setSearchOpen(true)} />
            <main id="main-content" className="min-h-screen" tabIndex={-1}>
              <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
            <AgeGate />
            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            <Toaster position="bottom-center" richColors />
            <Scripts />
          </CartProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="font-display text-[8rem] md:text-[12rem] leading-none text-gold-gradient opacity-60">404</span>
      <h1 className="font-display text-3xl md:text-4xl text-cream mt-8 mb-4">Page not found</h1>
      <p className="text-muted-foreground mb-10 max-w-md font-light">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <a
        href="/"
        className="bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
      >
        Go home
      </a>
    </div>
  );
}
