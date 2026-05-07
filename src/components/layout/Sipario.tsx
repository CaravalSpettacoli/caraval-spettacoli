"use client";

import { useEffect, useRef, useState } from "react";

interface SiparioProps {
  /** Tempo minimo di permanenza del testo prima del fade (ms). */
  minDuration?: number;
  /** Failsafe: parte comunque dopo questo tempo (ms). */
  maxDuration?: number;
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

const TEXT_FADE_MS = 400;
const PANEL_OPEN_MS = 2500;

export function Sipario({
  minDuration = 1500,
  maxDuration = 3500,
  mode = "auto",
  withSound = false,
  onComplete,
}: SiparioProps) {
  const [isFading, setIsFading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const timers: number[] = [];

    if (reduced) {
      // Fallback: niente movimento tendaggi, solo fade-out 400ms del contenuto e via.
      setIsFading(true);
      timers.push(
        window.setTimeout(() => {
          setIsUnmounted(true);
          onComplete?.();
        }, TEXT_FADE_MS)
      );
      return () => timers.forEach(clearTimeout);
    }

    const startTime = Date.now();
    let started = false;

    const startSequence = () => {
      if (started) return;
      started = true;
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, minDuration - elapsed);

      // Step 1 — dopo `wait` ms (testo persiste 1500ms): fade testo (400ms)
      timers.push(
        window.setTimeout(() => {
          setIsFading(true);
          if (withSound && audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }, wait)
      );
      // Step 2 — dopo wait + 400ms: apertura tendaggi (2500ms)
      timers.push(
        window.setTimeout(() => setIsOpen(true), wait + TEXT_FADE_MS)
      );
      // Step 3 — dopo wait + 400 + 2500ms: smonta
      timers.push(
        window.setTimeout(() => {
          setIsUnmounted(true);
          onComplete?.();
        }, wait + TEXT_FADE_MS + PANEL_OPEN_MS)
      );
    };

    if (mode === "preview") {
      startSequence();
    } else if (document.readyState === "complete") {
      startSequence();
    } else {
      window.addEventListener("load", startSequence, { once: true });
    }

    timers.push(window.setTimeout(startSequence, maxDuration));

    return () => {
      window.removeEventListener("load", startSequence);
      timers.forEach(clearTimeout);
    };
  }, [minDuration, maxDuration, mode, withSound, onComplete]);

  if (isUnmounted) return null;

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
