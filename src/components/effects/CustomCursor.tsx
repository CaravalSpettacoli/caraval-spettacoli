"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursore decorativo:
 *  - Punto rosso 8px ø che insegue il mouse 1:1 (transform via rAF)
 *  - Trail più grande con lerp (effetto scia morbida)
 *  - Scale 1.5 al click, smoothato anche lui via lerp dentro la stessa transform
 *  - Si disattiva su touch / prefers-reduced-motion
 *  - Nasconde il cursore di sistema via CSS in globals.css
 *
 *  Note implementative (anti-regressione):
 *  - Niente React state per il click → no re-render → React non sovrascrive
 *    mai la `transform` applicata da rAF.
 *  - Posizione + scale combinate in UN'UNICA stringa `transform` aggiornata
 *    solo dentro il tick rAF. Niente `style.scale` separato.
 *  - Il `data-custom-cursor` non viene rimosso al cleanup: serve a tenere
 *    `cursor: none` stabile anche durante eventuali re-mount in dev
 *    (React Strict Mode) o HMR.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

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
      // Scale: lerp morbido verso il target.
      scaleCurrent += (scaleTarget - scaleCurrent) * 0.25;

      const dot = dotRef.current;
      if (dot) {
        // Posizione + scale in una singola transform: nessun altro stile
        // CSS può destabilizzarla durante mousedown/mouseup.
        dot.style.transform = `translate3d(${target.x - 4}px, ${target.y - 4}px, 0) scale(${scaleCurrent})`;
      }

      // Trail: lerp 0.18 verso il target → effetto scia morbida.
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

    return () => {
      // Volutamente NON rimuoviamo `data-custom-cursor`: vogliamo che
      // `cursor: none` resti applicato anche durante eventuali unmount/
      // remount transitori (React Strict Mode in dev, HMR), per evitare
      // che il cursore di sistema riappaia e Chrome lo "appenda" sui link.
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Trail morbido: glow rosso sfocato, segue il dot con lerp 0.18 */}
      <div
        ref={trailRef}
        aria-hidden="true"
        className="fixed pointer-events-none top-0 left-0 z-[9998] rounded-full bg-rosso-base"
        style={{
          width: 24,
          height: 24,
          opacity: 0.22,
          filter: "blur(5px)",
          transform: "translate3d(-9999px, -9999px, 0)",
          willChange: "transform",
        }}
      />
      {/* Dot principale: transform (translate + scale) gestita interamente da rAF */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed pointer-events-none top-0 left-0 z-[9999] rounded-full bg-rosso-base"
        style={{
          width: 8,
          height: 8,
          transform: "translate3d(-9999px, -9999px, 0) scale(1)",
          willChange: "transform",
        }}
      />
    </>
  );
}

export default CustomCursor;
