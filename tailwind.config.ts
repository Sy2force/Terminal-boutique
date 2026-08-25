import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        gold: "var(--color-gold)",
        "gold-soft": "var(--color-gold-soft)",
        champagne: "var(--color-champagne)",
        bordeaux: "var(--color-bordeaux)",
        cream: "var(--color-cream)",
        charcoal: "var(--color-charcoal)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Times New Roman", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
      },
      boxShadow: {
        luxe: "0 30px 80px -30px rgba(0,0,0,0.8)",
        gold: "0 0 60px -20px rgba(194,162,92,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
