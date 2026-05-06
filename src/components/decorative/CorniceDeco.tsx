import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CorniceDecoProps {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  className?: string;
  /** A=floreale vintage, B=geometrico art deco puro, C=mix (default) */
  style?: "A" | "B" | "C";
}

const PADDING_MAP = {
  sm: "p-6",
  md: "p-10",
  lg: "p-16",
};

function AngoloFloral({ className }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      className={cn("absolute", className)}
    >
      <path d="M0 0 L36 0" strokeLinecap="round" />
      <path d="M0 0 L0 36" strokeLinecap="round" />
      <path d="M4 4 C 12 6, 18 12, 20 20" />
      <path d="M4 4 C 6 12, 12 18, 20 20" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
      <circle cx="10" cy="10" r="1.2" fill="currentColor" />
    </svg>
  );
}

function AngoloDeco({ className }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      className={cn("absolute", className)}
    >
      <path d="M0 0 L40 0" strokeLinecap="round" />
      <path d="M0 0 L0 40" strokeLinecap="round" />
      <path d="M4 4 L28 4" strokeLinecap="round" />
      <path d="M4 4 L4 28" strokeLinecap="round" />
      <path d="M8 8 L20 8" strokeLinecap="round" />
      <path d="M8 8 L8 20" strokeLinecap="round" />
      {/* Ventaglio */}
      <line x1="14" y1="14" x2="26" y2="6" />
      <line x1="14" y1="14" x2="22" y2="2" />
      <line x1="14" y1="14" x2="6" y2="26" />
      <line x1="14" y1="14" x2="2" y2="22" />
    </svg>
  );
}

function AngoloMix({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      className={cn("absolute", className)}
    >
      <path d="M0 0 L40 0" strokeLinecap="round" />
      <path d="M0 0 L0 40" strokeLinecap="round" />
      <path d="M6 6 L26 6" strokeLinecap="round" />
      <path d="M6 6 L6 26" strokeLinecap="round" />
      <path d="M12 12 L18 6 L24 12 L18 18 Z" />
    </svg>
  );
}

export function CorniceDeco({
  children,
  padding = "md",
  className,
  style = "C",
}: CorniceDecoProps) {
  const Angolo =
    style === "A" ? AngoloFloral : style === "B" ? AngoloDeco : AngoloMix;
  return (
    <div
      className={cn(
        "relative text-rosso-base",
        PADDING_MAP[padding],
        className,
      )}
    >
      <Angolo className="top-0 left-0" />
      <Angolo className="top-0 right-0 rotate-90" />
      <Angolo className="bottom-0 right-0 rotate-180" />
      <Angolo className="bottom-0 left-0 -rotate-90" />
      {/* Linee laterali */}
      <div
        className={cn(
          "pointer-events-none absolute top-10 bottom-10 left-0 w-px bg-current",
          style === "B" ? "opacity-60" : "opacity-40",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute top-10 bottom-10 right-0 w-px bg-current",
          style === "B" ? "opacity-60" : "opacity-40",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute left-10 right-10 top-0 h-px bg-current",
          style === "B" ? "opacity-60" : "opacity-40",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute left-10 right-10 bottom-0 h-px bg-current",
          style === "B" ? "opacity-60" : "opacity-40",
        )}
      />
      {style === "B" && (
        <>
          {/* Doppia linea esterna art deco */}
          <div className="pointer-events-none absolute top-2 bottom-2 left-2 w-px bg-current opacity-30" />
          <div className="pointer-events-none absolute top-2 bottom-2 right-2 w-px bg-current opacity-30" />
          <div className="pointer-events-none absolute left-2 right-2 top-2 h-px bg-current opacity-30" />
          <div className="pointer-events-none absolute left-2 right-2 bottom-2 h-px bg-current opacity-30" />
        </>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
