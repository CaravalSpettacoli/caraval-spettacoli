"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useFadeInOnScroll } from "@/lib/hooks/useFadeInOnScroll";

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Ritardo in ms prima del fade-in. */
  delay?: number;
  as?: "div" | "section" | "article";
}

export function FadeInOnScroll({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: FadeInOnScrollProps) {
  const { ref, visible } = useFadeInOnScroll<HTMLDivElement>();
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "fade-in-on-scroll",
        visible && "is-visible",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default FadeInOnScroll;
