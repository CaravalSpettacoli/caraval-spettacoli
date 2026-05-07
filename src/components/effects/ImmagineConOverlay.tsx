import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ImmagineConOverlayProps {
  children: ReactNode;
  className?: string;
  /** Intensità overlay al hover. */
  variant?: "rosso" | "nero";
}

export function ImmagineConOverlay({
  children,
  className,
  variant = "rosso",
}: ImmagineConOverlayProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md",
        className,
      )}
    >
      {children}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-slow ease-cinema group-hover:opacity-100",
          variant === "rosso"
            ? "bg-gradient-overlay-rosso"
            : "bg-gradient-overlay-nero",
        )}
      />
    </div>
  );
}

export default ImmagineConOverlay;
