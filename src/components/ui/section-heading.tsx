import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <span className="eyebrow block mb-5">{eyebrow}</span>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream tracking-wide leading-[1.1]">{title}</h2>
      <div className={cn("rule-gold mt-6 mb-6", align === "center" && "mx-auto")} />
      {description && <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">{description}</p>}
    </div>
  );
}
