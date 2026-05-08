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
 * Sequenza preloader (definitiva, 2.2s totali):
 *  0–1000ms     text-visible      — scritta + tendaggi chiusi
 *  1000–2200ms  curtains-opening  — tendaggi 1200ms, scritta fade-out 300ms
 *  2200ms       done              — sipario unmounted
 *
 * Easing tendaggi: cubic-bezier(0.4, 0, 0.2, 1) (definito in globals.css).
 * Fallback prefers-reduced-motion: niente movimento tendaggi, solo fade-out
 * 400ms del contenuto e via.
 */

const TEXT_VISIBLE_MS = 1000;
const CURTAINS_MS = 1200;

type Phase = "text-visible" | "curtains-opening" | "done";

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
      // Niente movimento tendaggi: fade-out 400ms del contenuto e via.
      setPhase("curtains-opening");
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
      timers.push(
        window.setTimeout(() => {
          setPhase("curtains-opening");
          if (withSound && audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }, TEXT_VISIBLE_MS)
      );
      timers.push(
        window.setTimeout(() => {
          setPhase("done");
          onComplete?.();
        }, TEXT_VISIBLE_MS + CURTAINS_MS)
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

  const isOpen = phase === "curtains-opening";
  // La scritta entra in fade-out simultaneamente all'apertura tendaggi.
  const isFading = phase === "curtains-opening";

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
