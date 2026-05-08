"use client";

import { useEffect, useRef, useState } from "react";

interface SiparioProps {
  /**
   * Modalità preview: parte subito, niente attesa load.
   * Usato nello showcase per testare l'animazione.
   */
  mode?: "auto" | "preview";
  /** Predisposizione audio (file non incluso). */
  withSound?: boolean;
  /** Callback al termine dell'animazione. */
  onComplete?: () => void;
}

/**
 * Sequenza narrativa "entrata in scena":
 *  0–1000ms   text-visible    — scritta + tendaggi chiusi
 *  1000–2000  curtains-opening — i tendaggi si aprono (1000ms), scritta resta
 *  2000–2800  zoom-in         — fade-out scritta + zoom contenuto sotto (800ms)
 *  2800       done            — sipario unmounted
 *
 * Lo zoom del contenuto sottostante viene applicato aggiungendo la classe
 * `preloader-zoomed-out` su <html>: la regola CSS in globals.css scala
 * `.preloader-zoom-target` da 1.15 a 1.0.
 */

const TEXT_VISIBLE_MS = 1000;
const CURTAINS_MS = 1000;
const ZOOM_MS = 800;

type Phase = "text-visible" | "curtains-opening" | "zoom-in" | "done";

export function Sipario({
  mode = "auto",
  withSound = false,
  onComplete,
}: SiparioProps) {
  const [phase, setPhase] = useState<Phase>("text-visible");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      // Niente movimento tendaggi né zoom: il contenuto sotto viene
      // smascherato subito (zoom target a scale 1) e il sipario sparisce
      // con un breve fade.
      document.documentElement.classList.add("preloader-zoomed-out");
      const t = window.setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, 400);
      return () => {
        window.clearTimeout(t);
      };
    }

    const timers: number[] = [];

    const startSequence = () => {
      // Step 1 — apertura tendaggi
      timers.push(
        window.setTimeout(() => {
          setPhase("curtains-opening");
          if (withSound && audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }, TEXT_VISIBLE_MS)
      );
      // Step 2 — fade scritta + zoom-in del contenuto sottostante
      timers.push(
        window.setTimeout(() => {
          setPhase("zoom-in");
          document.documentElement.classList.add("preloader-zoomed-out");
        }, TEXT_VISIBLE_MS + CURTAINS_MS)
      );
      // Step 3 — smonta
      timers.push(
        window.setTimeout(() => {
          setPhase("done");
          onComplete?.();
        }, TEXT_VISIBLE_MS + CURTAINS_MS + ZOOM_MS)
      );
    };

    if (mode === "preview" || document.readyState === "complete") {
      startSequence();
    } else {
      window.addEventListener("load", startSequence, { once: true });
    }

    return () => {
      window.removeEventListener("load", startSequence);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [mode, withSound, onComplete]);

  if (phase === "done") return null;

  const isOpen = phase === "curtains-opening" || phase === "zoom-in";
  const isFading = phase === "zoom-in";

  return (
    <div
      className={`sipario-container${isOpen ? " is-open" : ""}${isFading ? " is-fading" : ""}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="sipario-panel sipario-panel--left">
        <div className="sipario-velvet" aria-hidden="true" />
      </div>
      <div className="sipario-panel sipario-panel--right">
        <div className="sipario-velvet" aria-hidden="true" />
      </div>

      <div className="sipario-content">
        <h1 className="sipario-title">Pronti a entrare in scena?</h1>
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

      {withSound && (
        <audio
          ref={audioRef}
          src="/sounds/curtain.mp3"
          preload="auto"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default Sipario;
