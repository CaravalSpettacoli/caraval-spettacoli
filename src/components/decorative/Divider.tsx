import { cn } from "@/lib/cn";

interface DividerProps {
  width?: number | string;
  className?: string;
  /** A=floral vintage, B=chevron art deco, C=stella (default) */
  style?: "A" | "B" | "C";
}

export function Divider({ width = 280, className, style = "C" }: DividerProps) {
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
      {/* Linee laterali */}
      <line
        x1="0"
        y1="8"
        x2="120"
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="160"
        y1="8"
        x2="280"
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {style === "A" && (
        <>
          {/* Ornamento floreale */}
          <circle cx="140" cy="8" r="2" fill="currentColor" />
          <circle cx="132" cy="8" r="1.2" fill="currentColor" />
          <circle cx="148" cy="8" r="1.2" fill="currentColor" />
          <path
            d="M140 2 C 138 4, 138 6, 140 8 C 142 6, 142 4, 140 2 Z"
            fill="currentColor"
          />
          <path
            d="M140 14 C 138 12, 138 10, 140 8 C 142 10, 142 12, 140 14 Z"
            fill="currentColor"
          />
        </>
      )}

      {style === "B" && (
        <>
          {/* Chevron geometrico */}
          <polyline
            points="128,4 138,8 128,12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            fill="none"
          />
          <polyline
            points="138,4 148,8 138,12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            fill="none"
          />
          <polyline
            points="148,4 158,8 148,12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}

      {style === "C" && (
        <path
          d="M140 2 L142.5 6.7 L147.7 7 L143.7 10.3 L145.1 15.5 L140 12.5 L134.9 15.5 L136.3 10.3 L132.3 7 L137.5 6.7 Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}
