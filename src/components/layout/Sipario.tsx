"use client";

import { useEffect, useState } from "react";
import { splitDisplay } from "@/lib/splitDisplay";

interface SiparioProps {
  /** Tempo minimo prima di iniziare l'apertura (ms). */
  minDuration?: number;
  /** Failsafe: apre comunque dopo questo tempo (ms). */
  maxDuration?: number;
  /**
   * Modalità preview: parte subito, niente attesa load.
   * Usato nello showcase per testare l'animazione.
   */
  mode?: "auto" | "preview";
  /** Callback quando il componente si smonta */
  onComplete?: () => void;
}

export function Sipario({
  minDuration = 800,
  maxDuration = 3000,
  mode = "auto",
  onComplete,
}: SiparioProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Skip totale per chi ha richiesto reduced motion (ridondante con CSS, ma evita layer DOM)
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsUnmounted(true);
      onComplete?.();
      return;
    }

    const startTime = Date.now();
    let opened = false;
    const timers: number[] = [];

    const openCurtain = () => {
      if (opened) return;
      opened = true;
      const elapsed = Date.now() - startTime;
      const remainingMin = Math.max(0, minDuration - elapsed);

      const t1 = window.setTimeout(() => setIsOpen(true), remainingMin);
      const t2 = window.setTimeout(() => {
        setIsUnmounted(true);
        onComplete?.();
      }, remainingMin + 1500);
      timers.push(t1, t2);
    };

    if (mode === "preview") {
      openCurtain();
    } else if (document.readyState === "complete") {
      openCurtain();
    } else {
      window.addEventListener("load", openCurtain, { once: true });
    }

    const failsafe = window.setTimeout(openCurtain, maxDuration);
    timers.push(failsafe);

    return () => {
      window.removeEventListener("load", openCurtain);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [minDuration, maxDuration, mode, onComplete]);

  if (isUnmounted) return null;

  return (
    <div
      className={`sipario-container${isOpen ? " is-open" : ""}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="sipario-panel sipario-panel--left" />
      <div className="sipario-panel sipario-panel--right" />
      <div className="sipario-content">
        <h1 className="sipario-title">
          {splitDisplay("Pronti a entrare in scena?")}
        </h1>
        <svg
          className="sipario-divider"
          width="180"
          height="14"
          viewBox="0 0 180 14"
          fill="none"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="7"
            x2="78"
            y2="7"
            stroke="currentColor"
            strokeWidth="1"
          />
          <polygon
            points="90,1 94,7 90,13 86,7"
            fill="currentColor"
            opacity="0.85"
          />
          <line
            x1="102"
            y1="7"
            x2="180"
            y2="7"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        <p className="sipario-label">Caraval Spettacoli — Soncino</p>
      </div>
    </div>
  );
}

export default Sipario;
