import { cn } from "@/lib/cn";

interface Stella5PunteProps {
  size?: number;
  className?: string;
  /** A=outline floreale, B=geometrica art deco, C=stella piena (default) */
  style?: "A" | "B" | "C";
  "aria-hidden"?: boolean;
}

export function Stella5Punte({
  size = 24,
  className,
  style = "C",
  "aria-hidden": ariaHidden = true,
}: Stella5PunteProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden={ariaHidden}
      className={cn("inline-block", className)}
    >
      {style === "A" && (
        <>
          {/* Stella outline + petali interni floreali */}
          <path
            d="M12 1.4 L14.5 8.7 L22.3 9.0 L16.0 13.7 L18.2 21.4 L12 16.9 L5.7 21.2 L8.1 13.6 L1.7 9.1 L9.5 8.6 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        </>
      )}
      {style === "B" && (
        <>
          {/* Stella geometrica con linee a raggiera */}
          <polygon
            points="12,2 13.6,9 21,9.5 15.4,14 17,21 12,17 7,21 8.6,14 3,9.5 10.4,9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
          <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="0.6" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="0.6" />
        </>
      )}
      {style === "C" && (
        <path
          d="M12 1.4 L14.5 8.7 L22.3 9.0 L16.0 13.7 L18.2 21.4 L12 16.9 L5.7 21.2 L8.1 13.6 L1.7 9.1 L9.5 8.6 Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}
