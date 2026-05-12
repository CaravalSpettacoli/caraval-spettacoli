"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { paletteToTheme } from "@/lib/theme-system";

export type CounterItem = { valore: string; etichetta: string };

export interface CounterStripProps {
  eyebrow?: string;
  numeri: CounterItem[];
  palette?: "default" | "imaginarium" | "rosso";
}

/**
 * Anima un numero da 0 al valore target quando entra in viewport.
 * Gestisce stringhe come "2.500+", "100", "3" preservando suffisso (+/-).
 * One-shot: si attiva solo la prima volta che entra in vista.
 */
function CounterNumber({
  target,
  duration = 1500,
  className,
  style,
}: {
  target: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Estrai numero e suffisso dal target (es. "2.500+" → 2500 + "+")
  const targetNum = parseInt(String(target).replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = String(target).match(/[^0-9.\s]+$/)?.[0] ?? "";

  const ref = useRef<HTMLSpanElement | null>(null);
  const animatedRef = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      // Niente animazione: salta direttamente al valore finale.
      setValue(targetNum);
      animatedRef.current = true;
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing: ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(targetNum * eased));
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setValue(targetNum);
            }
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [targetNum, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {value.toLocaleString("it-IT")}
      {suffix}
    </span>
  );
}

export function CounterStrip({
  eyebrow,
  numeri,
  palette = "default",
}: CounterStripProps) {
  if (!numeri || numeri.length === 0) return null;

  const config = (() => {
    switch (palette) {
      case "imaginarium":
        // Hotfix 1: palette light = rosso pieno (era crema invertita).
        return {
          bg: "text-crema-base",
          inlineBg: "#a8174a",
          eyebrowCol: "text-crema-base/80",
          valoreCol: "text-crema-bright",
          etichettaCol: "text-crema-base/85",
          sepCol: "bg-crema-base/30",
        };
      case "rosso":
        return {
          bg: "bg-rosso-base text-crema-base",
          inlineBg: undefined,
          eyebrowCol: "text-crema-base/80",
          valoreCol: "text-crema-bright",
          etichettaCol: "text-crema-base/85",
          sepCol: "bg-crema-base/30",
        };
      default:
        return {
          bg: "bg-nero-base text-crema-base",
          inlineBg: undefined,
          eyebrowCol: "text-rosso-base/90",
          valoreCol: "text-rosso-hover",
          etichettaCol: "text-crema-base/80",
          sepCol: "bg-crema-faint/30",
        };
    }
  })();
  const { bg, inlineBg, eyebrowCol, valoreCol, etichettaCol, sepCol } = config;

  return (
    <section
      data-theme={paletteToTheme[palette]}
      className={`relative ${bg}`}
      style={{
        paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))",
        ...(inlineBg ? { backgroundColor: inlineBg } : {}),
      }}
    >
      <Container>
        {eyebrow && (
          <p
            className={`text-center uppercase-tracked text-caption mb-12 ${eyebrowCol}`}
          >
            {eyebrow}
          </p>
        )}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0 relative"
          role="list"
        >
          {numeri.map((n, i) => (
            <li key={`${n.etichetta}-${i}`} className="text-center relative">
              <CounterNumber
                target={n.valore}
                className={`block font-display leading-none ${valoreCol}`}
                style={{
                  fontSize: "clamp(3rem, 7vw, 5rem)",
                  letterSpacing: "0.01em",
                }}
              />
              <span
                className={`mt-3 block text-caption uppercase-tracked ${etichettaCol}`}
              >
                {n.etichetta}
              </span>
              {i < numeri.length - 1 && (
                <span
                  aria-hidden
                  className={`hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 ${sepCol}`}
                />
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default CounterStrip;
