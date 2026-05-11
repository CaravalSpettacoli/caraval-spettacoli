"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { themeStyles, type SectionTheme } from "@/lib/theme-system";

/**
 * Cursore decorativo adattivo:
 *  - Punto + trail che inseguono il mouse via rAF.
 *  - Colore derivato dal tema della sezione che contiene il centro del viewport.
 *  - Si disattiva su touch / prefers-reduced-motion.
 *  - Nasconde il cursore di sistema via CSS in globals.css.
 *  - Re-init a ogni cambio pathname (App Router client-side nav).
 *  - Nasconde dot/trail su hover iframe (YouTube embed).
 *
 *  Strategia anti-race:
 *  - `recomputeNow()` sincrono basato su getBoundingClientRect → primo paint
 *    sempre corretto, non dipende dal primo callback IntersectionObserver.
 *  - Observer + scroll listener entrambi attivi: ridondanza intenzionale.
 *  - `lastThemeRef` previene setState ridondanti che causano re-render inutili.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);
  const lastThemeRef = useRef<SectionTheme>("dark");
  const [enabled, setEnabled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<SectionTheme>("dark");
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!hoverable.matches || reduce.matches) return;

    setEnabled(true);
    document.body.dataset.customCursor = "true";
    document.documentElement.dataset.customCursor = "true";

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { x: target.x, y: target.y };
    let scaleTarget = 1;
    let scaleCurrent = 1;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onDown = () => {
      scaleTarget = 1.5;
    };
    const onUp = () => {
      scaleTarget = 1;
    };

    const tick = () => {
      scaleCurrent += (scaleTarget - scaleCurrent) * 0.25;
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${target.x - 4}px, ${target.y - 4}px, 0) scale(${scaleCurrent})`;
      }
      trail.x += (target.x - trail.x) * 0.18;
      trail.y += (target.y - trail.y) * 0.18;
      const t = trailRef.current;
      if (t) {
        t.style.transform = `translate3d(${trail.x - 12}px, ${trail.y - 12}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    frame = requestAnimationFrame(tick);

    /** Recompute sincrono: cerca la sezione che contiene il centro del viewport. */
    const recomputeNow = () => {
      const sections = document.querySelectorAll<HTMLElement>(
        "section[data-theme]"
      );
      const center = window.innerHeight / 2;
      let active: SectionTheme = "dark";
      for (let i = 0; i < sections.length; i++) {
        const r = sections[i].getBoundingClientRect();
        if (r.top <= center && r.bottom >= center) {
          const t = sections[i].getAttribute("data-theme") as SectionTheme | null;
          if (t === "dark" || t === "light" || t === "accent") {
            active = t;
          }
          break;
        }
      }
      if (active !== lastThemeRef.current) {
        lastThemeRef.current = active;
        setCurrentTheme(active);
      }
    };

    let observer: IntersectionObserver | null = null;
    const iframeBindings: Array<{
      el: HTMLIFrameElement;
      enter: () => void;
      leave: () => void;
    }> = [];

    // Setup dopo un piccolo delay: al cambio pathname il DOM può non essere
    // ancora montato quando l'useEffect ri-runna.
    const setupTimer = window.setTimeout(() => {
      // Recompute sincrono immediato come primo paint deterministico.
      recomputeNow();

      observer = new IntersectionObserver(() => recomputeNow(), {
        rootMargin: "0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      });

      const sections = document.querySelectorAll<HTMLElement>(
        "section[data-theme]"
      );
      sections.forEach((s) => observer!.observe(s));

      // Iframe leak fix: cursor:none non si propaga ai documenti iframe.
      const iframes = document.querySelectorAll<HTMLIFrameElement>("iframe");
      iframes.forEach((iframe) => {
        const enter = () => {
          if (dotRef.current) dotRef.current.style.opacity = "0";
          if (trailRef.current) trailRef.current.style.opacity = "0";
        };
        const leave = () => {
          if (dotRef.current) dotRef.current.style.opacity = "1";
          if (trailRef.current) trailRef.current.style.opacity = "0.22";
        };
        iframe.addEventListener("mouseenter", enter);
        iframe.addEventListener("mouseleave", leave);
        iframeBindings.push({ el: iframe, enter, leave });
      });
    }, 50);

    // Scroll fallback: recompute sincrono su ogni scroll. Throttled via rAF.
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        recomputeNow();
        scrollRaf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(setupTimer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (observer) observer.disconnect();
      iframeBindings.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [pathname]);

  if (!enabled) return null;

  const { cursorColor, trailColor } = themeStyles[currentTheme];

  return (
    <>
      <div
        ref={trailRef}
        aria-hidden="true"
        className="fixed pointer-events-none top-0 left-0 z-[9998] rounded-full"
        style={{
          width: 24,
          height: 24,
          opacity: 0.22,
          filter: "blur(5px)",
          transform: "translate3d(-9999px, -9999px, 0)",
          willChange: "transform",
          backgroundColor: trailColor,
          transition: "background-color 220ms ease-out",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed pointer-events-none top-0 left-0 z-[9999] rounded-full"
        style={{
          width: 8,
          height: 8,
          transform: "translate3d(-9999px, -9999px, 0) scale(1)",
          willChange: "transform",
          backgroundColor: cursorColor,
          transition: "background-color 220ms ease-out",
        }}
      />
    </>
  );
}

export default CustomCursor;
