interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}

export function PageHero({ eyebrow, title, description, image }: PageHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[420px] flex items-end pb-16 md:pb-24 overflow-hidden">
      <img
        src={image}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      <div className="absolute inset-0 grain-gold opacity-60" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8">
        <span className="eyebrow block mb-4">{eyebrow}</span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream tracking-wide leading-[1.05] max-w-4xl">
          {title}
        </h1>
        <div className="rule-gold mt-6 max-w-md" />
        <p className="mt-6 text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl font-light">
          {description}
        </p>
      </div>
    </section>
  );
}
