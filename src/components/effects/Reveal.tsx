"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Wrapper riusabile per first-entry fade-in + slide-up al primo ingresso in viewport.
 *  One-shot (non si re-attiva). Rispetta prefers-reduced-motion: salta animazione.
 *
 *  Strategia robusta (Fix_Reveal_Mobile):
 *  1. Check geometrico al mount: copre elementi già in viewport (above-the-fold).
 *  2. IntersectionObserver primario: performance ottima quando funziona.
 *  3. Fallback scroll rAF-throttled: copre i casi (iOS Safari, elementi alti)
 *     in cui l'IO non triggera affidabilmente.
 *  4. Fallback resize/orientationchange: copre tablet che ruota da portrait
 *     a landscape mentre elementi sono ancora pending.
 *
 *  Prop `delay` opzionale per coordinare con il preloader sipario. */
export type RevealDirection = "up" | "left" | "right";

export function Reveal({
  children,
  threshold = 0.1,
  rootMargin = "0px 0px -10% 0px",
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

    let triggered = false;
    const cleanupFns: Array<() => void> = [];

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      if (delay > 0) {
        const t = window.setTimeout(() => setRevealed(true), delay);
        cleanupFns.push(() => window.clearTimeout(t));
      } else {
        setRevealed(true);
      }
      // Disconnect everything una volta scattato (one-shot)
      runCleanup();
    };

    const runCleanup = () => {
      while (cleanupFns.length) {
        const fn = cleanupFns.pop();
        try {
          fn?.();
        } catch {
          /* noop */
        }
      }
    };

    // Helper geometrico: l'elemento è almeno parzialmente in viewport.
    // Margine -10% bottom per coerenza con rootMargin: l'elemento "conta"
    // quando il suo top supera il 90% dell'altezza viewport.
    const isInViewport = () => {
      const rect = node.getBoundingClientRect();
      const winH = window.innerHeight || document.documentElement.clientHeight;
      const margin = winH * 0.1;
      return rect.top < winH - margin && rect.bottom > 0;
    };

    // 1) Check immediato al mount
    if (isInViewport()) {
      trigger();
      return runCleanup;
    }

    // 2) IntersectionObserver primario
    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            trigger();
          }
        },
        { threshold, rootMargin }
      );
      observer.observe(node);
      cleanupFns.push(() => observer.disconnect());
    }

    // 3) Scroll fallback rAF-throttled
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = window.requestAnimationFrame(() => {
        raf = null;
        if (isInViewport()) trigger();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanupFns.push(() => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    });

    // 4) Resize + orientationchange fallback (tablet rotation)
    const onResize = () => {
      if (isInViewport()) trigger();
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    cleanupFns.push(() => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    });

    return runCleanup;
  }, [threshold, rootMargin, delay]);

  const directionClass =
    direction === "left"
      ? "reveal-left"
      : direction === "right"
        ? "reveal-right"
        : "";

  // Ref forzato: il Tag è un union (div/section/article/ul/ol) → TS non riesce
  // a derivare un singolo tipo Ref. Cast through unknown per evitare TS2322.
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
