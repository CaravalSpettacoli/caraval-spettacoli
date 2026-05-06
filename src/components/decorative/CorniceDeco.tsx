import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CorniceDecoProps {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  className?: string;
}

const PADDING_MAP = {
  sm: "p-6",
  md: "p-10",
  lg: "p-16",
};

function Angolo({ className }: { className?: string }) {
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
      {/* Angolo art déco: due linee + diamante interno */}
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
}: CorniceDecoProps) {
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
      {/* Linee laterali sottili */}
      <div className="pointer-events-none absolute top-10 bottom-10 left-0 w-px bg-current opacity-40" />
      <div className="pointer-events-none absolute top-10 bottom-10 right-0 w-px bg-current opacity-40" />
      <div className="pointer-events-none absolute left-10 right-10 top-0 h-px bg-current opacity-40" />
      <div className="pointer-events-none absolute left-10 right-10 bottom-0 h-px bg-current opacity-40" />
      <div className="relative">{children}</div>
    </div>
  );
}
