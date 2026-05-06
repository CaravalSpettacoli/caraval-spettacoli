"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface RevealSiparioProps {
  children: ReactNode;
  /** Ritardo prima dell'apertura del sipario. */
  delay?: number;
  className?: string;
  /** Se true, ricomincia ogni volta che cambia. */
  replayKey?: number | string;
}

export function RevealSipario({
  children,
  delay = 200,
  className,
  replayKey,
}: RevealSiparioProps) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(false);
    const t = setTimeout(() => setOpened(true), delay);
    return () => clearTimeout(t);
  }, [delay, replayKey]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-1/2 bg-nero-deep transition-transform duration-sipario ease-cinema z-30",
          opened ? "-translate-x-full" : "translate-x-0",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 right-0 w-1/2 bg-nero-deep transition-transform duration-sipario ease-cinema z-30",
          opened ? "translate-x-full" : "translate-x-0",
        )}
      />
    </div>
  );
}

export default RevealSipario;
