import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { sectionBgToTheme } from "@/lib/theme-system";

type Background = "nero" | "nero-soft" | "crema" | "transparent";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  background?: Background;
  children?: ReactNode;
  as?: "section" | "div" | "article";
};

const bgs: Record<Background, string> = {
  nero: "bg-nero-base text-crema-base",
  "nero-soft": "bg-nero-soft text-crema-base",
  crema: "bg-crema-base text-nero-base",
  transparent: "bg-transparent",
};

export function Section({
  background = "nero",
  as: Tag = "section",
  className,
  children,
  style,
  ...rest
}: SectionProps) {
  const dataTheme = sectionBgToTheme[background];
  return (
    <Tag
      className={cn(bgs[background], className)}
      style={{
        paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))",
        ...style,
      }}
      {...(dataTheme ? { "data-theme": dataTheme } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Section;
