"use client";

import { useEffect, useRef, useState } from "react";
import { themeStyles, type SectionTheme } from "@/lib/theme-system";

/**
 * Cursore decorativo adattivo (Mini-blocco 2.5a):
 *  - Punto + trail che inseguono il mouse via rAF.
 *  - Colore di entrambi è derivato dal tema della sezione "centrale" del
 *    viewport, osservata via IntersectionObserver su `section[data-theme]`.
 *  - Si disattiva su touch / prefers-reduced-motion.
 *  - Nasconde il cursore di sistema via CSS in globals.css.
 *
 *  Anti-regressione:
 *  - Niente React state per il click → no re-render → React non sovrascrive
 *    mai la `transform` applicata da rAF.
 *  - Posizione + scale combinate in UN'UNICA stringa `transform`.
 *  - Il `data-custom-cursor` non viene rimosso al cleanup: stabilità durante
 *    HMR / React Strict Mode in dev.
 *  - Transition CSS solo su `background-color` (no transform).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<SectionTheme>("dark");

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

    // IntersectionObserver: osserva solo il 20% centrale del viewport.
    // Solo una sezione alla volta tocca questa fascia → nessun flicker.
    const observer = new IntersectionObserver(
      (entries) => {
        // Trova la sezione con intersectionRatio più alto fra quelle visibili.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const mostVisible = visible.reduce((max, cur) =>
          cur.intersectionRatio > max.intersectionRatio ? cur : max
        );
        const theme = mostVisible.target.getAttribute(
          "data-theme"
        ) as SectionTheme | null;
        if (theme && (theme === "dark" || theme === "light" || theme === "accent")) {
          setCurrentTheme(theme);
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const sections = document.querySelectorAll<HTMLElement>("section[data-theme]");
    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  if (!enabled) return null;

  const { cursorColor, trailColor } = themeStyles[currentTheme];

  return (
    <>
      {/* Trail morbido: glow sfocato che segue il dot con lerp 0.18 */}
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
      {/* Dot principale: transform via rAF; backgroundColor da stato. */}
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
