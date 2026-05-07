"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!hoverable.matches || reduce.matches) return;

    setEnabled(true);
    document.body.dataset.customCursor = "true";

    const move = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      delete document.body.dataset.customCursor;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed pointer-events-none z-[9999] rounded-full bg-rosso-base"
      style={{
        width: 8,
        height: 8,
        left: position.x - 4,
        top: position.y - 4,
        transform: clicking ? "scale(1.5)" : "scale(1)",
        transition:
          "transform 150ms ease-out, left 80ms ease-out, top 80ms ease-out",
      }}
    />
  );
}

export default CustomCursor;
