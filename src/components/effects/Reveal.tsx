"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Wrapper riusabile per first-entry fade-in + slide-up al primo ingresso in viewport.
 *  One-shot (non si re-attiva). Rispetta prefers-reduced-motion: salta animazione.
 *
 *  Hotfix 3 — threshold default 0.1 (aggressivo) + rootMargin "0px 0px -8% 0px"
 *  per attivare l'animazione appena la sezione spunta. Prop `delay` opzionale
 *  per coordinare con il preloader sipario (es. hero homepage). */
export type RevealDirection = "up" | "left" | "right";

export function Reveal({
  children,
  threshold = 0.1,
  rootMargin = "0px 0px -8% 0px",
  delay = 0,
  direction = "up",
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  /** Ritardo in ms prima di aggiungere la classe `revealed`. Default 0. */
  delay?: number;
  /** Direzione slide-in. "up" default (translateY +30 → 0),
   *  "left" (translateX -40 → 0), "right" (translateX +40 → 0). */
  direction?: RevealDirection;
  className?: string;
  as?: "div" | "section" | "article" | "ul" | "ol";
}) {
  const ref = useRef<HTMLElement | null>(null);
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

    const trigger = () => {
      if (delay > 0) {
        window.setTimeout(() => setRevealed(true), delay);
      } else {
        setRevealed(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trigger();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);

    // Fallback: se è già in viewport al mount, attiva subito (alcune pagine
    // hanno hero che è già intersecting prima che l'observer faccia il primo
    // ciclo, e l'observer non emette se isIntersecting al moment di observe()
    // in alcuni edge case di hydration).
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      trigger();
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  const directionClass =
    direction === "left"
      ? "reveal-left"
      : direction === "right"
        ? "reveal-right"
        : "";

  // Ref forzato: il Tag è un union (div/section/article/ul/ol) → TS non riesce
  // a derivare un singolo tipo Ref. Usiamo cast through unknown per evitare
  // l'errore TS2322 senza disabilitare strict mode.
  const refForTag = ref as unknown as React.LegacyRef<HTMLElement>;

  return (
    <Tag
      ref={refForTag as never}
      className={cn("reveal", directionClass, revealed && "revealed", className)}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
