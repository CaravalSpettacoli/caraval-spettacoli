import { cn } from "@/lib/cn";

interface DividerProps {
  width?: number | string;
  className?: string;
}

export function Divider({ width = 280, className }: DividerProps) {
  return (
    <svg
      width={width}
      height={16}
      viewBox="0 0 280 16"
      fill="none"
      aria-hidden="true"
      className={cn("inline-block", className)}
      preserveAspectRatio="none"
    >
      {/* Linea sinistra */}
      <line
        x1="0"
        y1="8"
        x2="120"
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Stella centrale */}
      <path
        d="M140 2 L142.5 6.7 L147.7 7 L143.7 10.3 L145.1 15.5 L140 12.5 L134.9 15.5 L136.3 10.3 L132.3 7 L137.5 6.7 Z"
        fill="currentColor"
      />
      {/* Linea destra */}
      <line
        x1="160"
        y1="8"
        x2="280"
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
