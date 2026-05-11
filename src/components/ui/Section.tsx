import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { sectionBgToTheme, type SectionTheme } from "@/lib/theme-system";

type Background = "nero" | "nero-soft" | "crema" | "transparent";
type BgVariant = "base" | "soft";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Legacy: applica solo la classe Tailwind di sfondo. Usa `theme` + `bgVariant` per il sistema adattivo. */
  background?: Background;
  /** Override esplicito del tema sezione. Se non passato, deriva da `background`. */
  theme?: SectionTheme;
  /** Alternanza intra-pagina del background nel theme. Solo per dark/light. */
  bgVariant?: BgVariant;
  children?: ReactNode;
  as?: "section" | "div" | "article";
};

const bgs: Record<Background, string> = {
  nero: "bg-nero-base text-crema-base",
  "nero-soft": "bg-nero-soft text-crema-base",
  crema: "bg-crema-base text-nero-base",
  transparent: "bg-transparent",
};

/** Background class derivata da theme + bgVariant. */
function themeBgClass(theme: SectionTheme, bgVariant: BgVariant): string {
  if (theme === "accent") return "bg-rosso-base text-crema-base";
  if (theme === "light") {
    return bgVariant === "soft"
      ? "bg-[#ebd9c0] text-nero-base"
      : "bg-crema-base text-nero-base";
  }
  // dark
  return bgVariant === "soft"
    ? "bg-nero-soft text-crema-base"
    : "bg-nero-base text-crema-base";
}

export function Section({
  background,
  theme,
  bgVariant = "base",
  as: Tag = "section",
  className,
  children,
  style,
  ...rest
}: SectionProps) {
  // Determina il tema finale:
  // 1. theme prop esplicita ha priorità
  // 2. fallback su sectionBgToTheme[background]
  // 3. fallback dark se nessuna delle due
  const resolvedTheme: SectionTheme =
    theme ?? (background ? sectionBgToTheme[background] ?? "dark" : "dark");

  // Determina la classe di background:
  // - Se passi `theme` esplicita → uso themeBgClass(theme, bgVariant)
  // - Se passi solo `background` (legacy) → uso bgs[background]
  // - Se entrambi → priorità a theme
  const bgClass = theme
    ? themeBgClass(theme, bgVariant)
    : background
      ? bgs[background]
      : themeBgClass("dark", "base");

  // data-theme: applicato sempre tranne quando background="transparent" senza theme esplicito
  const applyDataTheme = theme || (background && background !== "transparent");

  return (
    <Tag
      className={cn(bgClass, className)}
      style={{
        paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))",
        ...style,
      }}
      {...(applyDataTheme ? { "data-theme": resolvedTheme } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Section;
