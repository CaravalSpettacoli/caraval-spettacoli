import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

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
  ...rest
}: SectionProps) {
  return (
    <Tag
      className={cn("py-12 md:py-20 lg:py-24", bgs[background], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Section;
