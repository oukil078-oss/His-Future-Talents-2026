import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        "his-deep":    "#003876",
        "his-blue":    "#0060C1",
        "his-electric":"#58B9FF",
        "his-orange":  "#F05A22",
        "his-yellow":  "#FFBD0E",
        "his-cream":   "#FBF9F6",
        "his-gold":    "#D4AF37",
        "his-ink":     "#0E1B2C",
        // Utility
        "his-border":  "rgba(0,56,118,0.08)",
      },
      fontFamily: {
        sans:    ["var(--font-sans)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        arabic:  ["var(--font-arabic)", "sans-serif"],
      },
      boxShadow: {
        card:      "0 4px 24px -4px rgba(0,56,118,0.07)",
        "card-lg": "0 16px 48px -12px rgba(0,56,118,0.12)",
        "blue-glow":"0 0 40px 0 rgba(88,185,255,0.18)",
        "gold-glow":"0 0 40px 0 rgba(212,175,55,0.25)",
        orange:    "0 8px 24px -4px rgba(240,81,35,0.30)",
      },
      keyframes: {
        shimmer: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        marqueeLeft: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeRight: {
          "0%":   { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        lineGrow: {
          "0%":   { scaleX: "0" },
          "100%": { scaleX: "1" },
        },
        pulseRing: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%":      { transform: "scale(1.15)", opacity: "0" },
        },
      },
      animation: {
        shimmer:      "shimmer 2.4s linear infinite",
        "marquee-ltr":"marqueeLeft  30s linear infinite",
        "marquee-rtl":"marqueeRight 30s linear infinite",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in":   "scaleIn  0.5s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-ring":  "pulseRing 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
