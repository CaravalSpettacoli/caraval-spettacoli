import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  sectionBgToTheme,
  themeStyles,
  type SectionTheme,
} from "@/lib/theme-system";

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

/** Stili inline derivati da theme + bgVariant. Usiamo inline (non Tailwind)
 *  perché i nuovi colori palette (Hotfix 1) non sono nella config Tailwind:
 *  light = #a8174a, accent = #8b0e3a. Più semplice tenere il single-source-of-truth
 *  in `themeStyles` e usare style inline che CSS classes ad hoc. */
function themeInlineStyle(
  theme: SectionTheme,
  bgVariant: BgVariant
): { backgroundColor: string; color: string } {
  const t = themeStyles[theme];
  return {
    backgroundColor: bgVariant === "soft" ? t.bgSoft : t.bg,
    color: t.text,
  };
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

  // Determina lo styling:
  // - Se passi `theme` esplicita → uso style inline da themeStyles (single source of truth)
  // - Se passi solo `background` (legacy) → uso classe Tailwind
  const useInlineTheme = !!theme;
  const inlineThemeStyle = useInlineTheme
    ? themeInlineStyle(resolvedTheme, bgVariant)
    : null;
  const bgClass =
    !useInlineTheme && background
      ? bgs[background]
      : !useInlineTheme
        ? bgs.nero
        : "";

  // data-theme: applicato sempre tranne quando background="transparent" senza theme esplicito
  const applyDataTheme = theme || (background && background !== "transparent");

  return (
    <Tag
      className={cn(bgClass, className)}
      style={{
        paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))",
        ...(inlineThemeStyle ?? {}),
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
