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
  /** Colore di sfondo principale della sezione. */
  bg: string;
  /** Variante più scura/morbida per alternanza intra-pagina. */
  bgSoft: string;
  /** Colore testo principale. */
  text: string;
  /** Colore accent (link, eyebrow, hover). */
  accent: string;
  /** Colore del dot del cursore (CONTRASTA con lo sfondo). */
  cursorColor: string;
  /** Colore del glow/trail del cursore (sincronizzato col dot, contrasta anche lui). */
  cursorGlow: string;
  /** Variante grafica dell'header (testo + logo chiaro/scuro). */
  headerVariant: HeaderVariant;
  /** Colore hover delle voci menu nell'header quando il tema è attivo.
   *  Hotfix 4: su light (rosso pieno) il rosso-hover di default si fondeva
   *  con lo sfondo → uso nero. Su dark resta rosso-hover. */
  headerHoverColor: string;
};

/**
 * Palette (Hotfix 1 — Polish Definitivo):
 * - dark: sito principale (nero pieno, accenti cremisi)
 * - light: SOLO /imaginarium (rosso pieno cremisi, accenti nero, palette inversa)
 *          NB: il nome "light" è semantico (palette inversa) non descrittivo del colore.
 * - accent: CTA finale rosso scuro (#8b0e3a, più scuro del light per dare distacco
 *           visivo quando una pagina light ha la sua CTA finale)
 */
export const themeStyles: Record<SectionTheme, ThemeStyle> = {
  dark: {
    bg: "#0a0a0a",
    bgSoft: "#161616",
    text: "#f5e6d3",
    accent: "#a8174a",
    cursorColor: "#f5e6d3", // crema, visibile su nero
    cursorGlow: "#a8174a", // cremisi, visibile su nero
    headerVariant: "dark",
    headerHoverColor: "#c01d56", // rosso-hover (default storico)
  },
  light: {
    // ROSSO PIENO (era crema). Palette inversa: rosso saturo, testi crema, accenti nero.
    bg: "#a8174a",
    bgSoft: "#8a1340",
    text: "#f5e6d3",
    accent: "#0a0a0a",
    cursorColor: "#f5e6d3", // crema, visibile su rosso
    cursorGlow: "#0a0a0a", // nero, visibile su rosso (il rosso si fonderebbe)
    headerVariant: "dark", // header dark anche su rosso: testo crema contrasta bene
    headerHoverColor: "#0a0a0a", // NERO (rosso-hover si fonderebbe col bg rosso)
  },
  accent: {
    // Rosso più scuro del light per dare distacco visivo su pagina rossa.
    bg: "#8b0e3a",
    bgSoft: "#7a0a32",
    text: "#f5e6d3",
    accent: "#f5e6d3",
    cursorColor: "#f5e6d3",
    cursorGlow: "#0a0a0a",
    headerVariant: "dark",
    headerHoverColor: "#0a0a0a", // anche qui: rosso scuro + nero hover = leggibile
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
