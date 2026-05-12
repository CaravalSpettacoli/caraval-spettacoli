"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Foto sfondo hero con parallax leggero su scroll desktop + subtle-zoom CSS
 *  20s infinite alternate per dinamicità (Hotfix 4).
 *  - speed 0.3 → traslazione sottile (300px su scroll 1000px)
 *  - Disabilitato su mobile (≤768px) e prefers-reduced-motion
 *  - Usa requestAnimationFrame + scroll listener passive throttled
 *  - objectPosition prop opzionale (default "center") per gestire foto verticali
 *    o ritratti che vanno tagliati sui volti (es. /chi-siamo: "center 30%"). */
export function HeroParallaxFoto({
  src,
  alt,
  className,
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    setEnabled(true);

    const node = ref.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      // Calcola offset relativo alla sezione (top-relative scroll)
      const offset = -rect.top * 0.3;
      node.style.transform = `translate3d(0, ${offset}px, 0)`;
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        willChange: enabled ? "transform" : undefined,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className={cn("object-cover hero-foto-sfondo")}
        style={{ objectPosition }}
      />
    </div>
  );
}

export default HeroParallaxFoto;
