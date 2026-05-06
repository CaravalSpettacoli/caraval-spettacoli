import { cn } from "@/lib/cn";

interface FiammaProps {
  size?: number;
  className?: string;
  /** A=lineare vintage, B=geometrica art deco, C=mix (default) */
  style?: "A" | "B" | "C";
}

export function Fiamma({ size = 32, className, style = "C" }: FiammaProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("inline-block", className)}
    >
      {style === "A" && (
        <>
          {/* Fiamma lineare a curve morbide, niente fill */}
          <path d="M16 3 C18 9 20 12 20 17 C20 22 18 27 16 27 C14 27 12 22 12 17 C12 13 14 11 16 7 Z" />
          <path d="M16 11 C17 14 18 16 18 19 C18 22 17 25 16 25" strokeWidth="1" />
          <path d="M14 14 C13 16 13 18 14 20" strokeWidth="0.8" />
        </>
      )}
      {style === "B" && (
        <>
          {/* Fiamma geometrica a triangoli concentrici */}
          <polygon
            points="16,3 22,18 16,28 10,18"
            strokeWidth="1.5"
          />
          <polygon
            points="16,8 19,18 16,24 13,18"
            strokeWidth="1"
          />
          <polygon
            points="16,12 17.5,18 16,21 14.5,18"
            fill="currentColor"
            stroke="none"
          />
        </>
      )}
      {style === "C" && (
        <>
          <path d="M16 2 C16 8 22 11 22 18 C22 24 19 28 16 28 C13 28 10 24 10 18 C10 13 13 11 14 7 C14.5 9 15.5 10 16 12 Z" />
          <path
            d="M16 14 C16 17 18 18 18 21 C18 24 16.8 26 16 26 C15.2 26 14 24 14 21 C14 19 15 18 16 14 Z"
            fill="currentColor"
            stroke="none"
          />
        </>
      )}
    </svg>
  );
}
