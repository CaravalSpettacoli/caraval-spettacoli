"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Wrapper riusabile per first-entry fade-in + slide-up al primo ingresso in viewport.
 *  One-shot (non si re-attiva). Rispetta prefers-reduced-motion: salta animazione.
 *  Niente shift di layout: il contenuto occupa già il suo spazio, cambia solo
 *  opacità + transform. */
export function Reveal({
  children,
  threshold = 0.15,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  threshold?: number;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn("reveal", revealed && "revealed", className)}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
