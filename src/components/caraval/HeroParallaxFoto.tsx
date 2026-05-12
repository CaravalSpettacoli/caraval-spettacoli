"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Foto sfondo hero con parallax leggero su scroll desktop.
 *  - speed 0.3 → traslazione sottile (300px su scroll 1000px)
 *  - Disabilitato su mobile (≤768px) e prefers-reduced-motion
 *  - Usa requestAnimationFrame + scroll listener passive throttled */
export function HeroParallaxFoto({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
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
        className="object-cover"
      />
    </div>
  );
}

export default HeroParallaxFoto;
