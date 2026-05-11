/**
 * Adaptive theming system (Mini-blocco 2.5a).
 *
 * Ogni <section> del sito dichiara il proprio tema via `data-theme`.
 * Cursore custom e Header osservano via IntersectionObserver quale sezione
 * è "sotto di loro" e si adattano (colore cursore, variante header).
 */

export type SectionTheme = "dark" | "light" | "accent";

export type HeaderVariant = "dark" | "light";

export type ThemeStyle = {
  /** Colore del dot del cursore (deve CONTRASTARE con lo sfondo della sezione). */
  cursorColor: string;
  /** Colore del trail/glow del cursore. */
  trailColor: string;
  /** Variante grafica dell'header (testo + logo bianchi vs neri). */
  headerVariant: HeaderVariant;
};

export const themeStyles: Record<SectionTheme, ThemeStyle> = {
  dark: {
    cursorColor: "#f5e6d3", // crema, visibile su nero
    trailColor: "#a8174a", // rosso brand
    headerVariant: "dark",
  },
  light: {
    cursorColor: "#5c0d2a", // rosso scuro, visibile su crema
    trailColor: "#a8174a", // rosso brand
    headerVariant: "light",
  },
  accent: {
    cursorColor: "#f5e6d3", // crema, visibile su rosso pieno
    trailColor: "#0a0a0a", // nero (il rosso si fonderebbe con lo sfondo rosso)
    headerVariant: "dark",
  },
};

/** Map dalla prop `palette` esistente su alcuni componenti al tema sezione. */
export const paletteToTheme = {
  default: "dark",
  imaginarium: "light",
  rosso: "accent",
} as const satisfies Record<string, SectionTheme>;

export type PaletteKey = keyof typeof paletteToTheme;

/** Map dal prop `background` di <Section> al tema. transparent → niente attributo. */
export const sectionBgToTheme: Record<
  "nero" | "nero-soft" | "crema" | "transparent",
  SectionTheme | undefined
> = {
  nero: "dark",
  "nero-soft": "dark",
  crema: "light",
  transparent: undefined,
};

/** Map dalla prop `variant` di CtaFinale al tema sezione. */
export const ctaVariantToTheme = {
  dark: "dark",
  accent: "accent",
} as const satisfies Record<string, SectionTheme>;
