"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursore decorativo:
 *  - Punto rosso 8px ø che insegue il mouse (1:1, no transition su position)
 *  - Trail più grande che segue con lerp (effetto scia morbida)
 *  - Scale 1.5 al click (transition solo su transform)
 *  - Si disattiva su touch / prefers-reduced-motion
 *  - Nasconde il cursore di sistema via CSS in globals.css
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!hoverable.matches || reduce.matches) return;

    setEnabled(true);
    document.body.dataset.customCursor = "true";

    // Posizione corrente del mouse (aggiornata 1:1) e posizione del trail
    // (interpolata via lerp ad ogni frame per dare l'effetto scia).
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { x: target.x, y: target.y };
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const tick = () => {
      // Dot: posizione esatta, niente smoothing (per non laggare).
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${target.x - 4}px, ${target.y - 4}px, 0)`;
      }
      // Trail: lerp 0.18 verso il target → effetto scia morbida.
      trail.x += (target.x - trail.x) * 0.18;
      trail.y += (target.y - trail.y) * 0.18;
      const t = trailRef.current;
      if (t) {
        t.style.transform = `translate3d(${trail.x - 16}px, ${trail.y - 16}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    frame = requestAnimationFrame(tick);

    return () => {
      delete document.body.dataset.customCursor;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Trail morbido: cerchio più grande, opacità bassa, segue con lerp */}
      <div
        ref={trailRef}
        aria-hidden="true"
        className="fixed pointer-events-none top-0 left-0 z-[9998] rounded-full border border-rosso-base/50"
        style={{
          width: 32,
          height: 32,
          transform: "translate3d(-9999px, -9999px, 0)",
          willChange: "transform",
        }}
      />
      {/* Dot principale: insegue il mouse 1:1, scale 1.5 al click */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed pointer-events-none top-0 left-0 z-[9999] rounded-full bg-rosso-base"
        style={{
          width: 8,
          height: 8,
          transform: "translate3d(-9999px, -9999px, 0)",
          willChange: "transform",
          // L'intera trasformazione è gestita da JS, ma applichiamo
          // uno scale extra via CSS per l'animazione click.
          scale: clicking ? "1.5" : "1",
          transition: "scale 150ms ease-out",
        }}
      />
    </>
  );
}

export default CustomCursor;
