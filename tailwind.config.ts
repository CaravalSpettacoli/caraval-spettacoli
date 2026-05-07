import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        nero: {
          DEFAULT: "var(--color-nero-base)",
          base: "var(--color-nero-base)",
          soft: "var(--color-nero-soft)",
          deep: "var(--color-nero-deep)",
        },
        rosso: {
          DEFAULT: "var(--color-rosso-base)",
          base: "var(--color-rosso-base)",
          hover: "var(--color-rosso-hover)",
          deep: "var(--color-rosso-deep)",
          muted: "var(--color-rosso-muted)",
        },
        crema: {
          DEFAULT: "var(--color-crema-base)",
          base: "var(--color-crema-base)",
          bright: "var(--color-crema-bright)",
          muted: "var(--color-crema-muted)",
          faint: "var(--color-crema-faint)",
        },
      },
      fontFamily: {
        // Sistema definitivo a 2 font: Cinzel Decorative per display, Inter per body/UI.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "serif"],
        // Stonehead riservato al solo logo Header
        stonehead: ["var(--font-stonehead)", "serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        // Mobile-first: la classe base è la versione mobile.
        // Per desktop usa varianti md: o lg: nelle pagine, oppure le utility .text-display-* mobile sono ribilanciate via @media in globals.css.
        "display-xl": ["96px", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "display-l": ["72px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-m": ["56px", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        h1: ["48px", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h2: ["36px", { lineHeight: "1.2", letterSpacing: "-0.005em" }],
        h3: ["28px", { lineHeight: "1.3", letterSpacing: "0" }],
        h4: ["22px", { lineHeight: "1.4", letterSpacing: "0" }],
        "body-l": ["18px", { lineHeight: "1.6", letterSpacing: "0" }],
        body: ["16px", { lineHeight: "1.6", letterSpacing: "0" }],
        "body-s": ["14px", { lineHeight: "1.5", letterSpacing: "0" }],
        caption: ["12px", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        label: ["12px", { lineHeight: "1.2", letterSpacing: "0.1em" }],
      },
      spacing: {
        "0.5": "2px",
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
        "32": "128px",
      },
      maxWidth: {
        "container-narrow": "720px",
        container: "1280px",
        "container-wide": "1440px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "24px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0,0,0,0.4)",
        md: "0 8px 24px rgba(0,0,0,0.5)",
        lg: "0 24px 64px rgba(0,0,0,0.6)",
        "glow-rosso": "0 0 32px rgba(168,23,74,0.3)",
        "glow-rosso-lg": "0 0 48px rgba(168,23,74,0.45)",
        poster:
          "0 32px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(168,23,74,0.2)",
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-overlay-rosso": "var(--gradient-overlay-rosso)",
        "gradient-overlay-nero": "var(--gradient-overlay-nero)",
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "100ms",
        base: "200ms",
        slow: "400ms",
        cinematic: "800ms",
        sipario: "1200ms",
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-rosso": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(168,23,74,0.4)" },
          "50%": { boxShadow: "0 0 0 16px rgba(168,23,74,0)" },
        },
        "sipario-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "sipario-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        spin: "spin 1s linear infinite",
        "fade-in": "fade-in 200ms ease-out",
        "fade-in-up": "fade-in-up 800ms ease-out both",
        "pulse-rosso": "pulse-rosso 2s ease-in-out 3",
        "sipario-left":
          "sipario-left 1200ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "sipario-right":
          "sipario-right 1200ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
