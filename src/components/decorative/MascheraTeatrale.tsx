import { cn } from "@/lib/cn";

interface MascheraTeatraleProps {
  tipo?: "commedia" | "tragedia";
  size?: number;
  className?: string;
  /** A=lineare vintage, B=geometrica art deco, C=mix (default) */
  style?: "A" | "B" | "C";
}

export function MascheraTeatrale({
  tipo = "commedia",
  size = 48,
  className,
  style = "C",
}: MascheraTeatraleProps) {
  const isCommedia = tipo === "commedia";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={style === "B" ? 1 : 1.5}
      strokeLinecap="round"
      strokeLinejoin={style === "B" ? "miter" : "round"}
      aria-hidden="true"
      className={cn("inline-block", className)}
    >
      {style === "A" && (
        <>
          <path d="M32 8 C20 8 14 20 14 32 C14 44 22 56 32 56 C42 56 50 44 50 32 C50 20 44 8 32 8 Z" />
          <path d="M20 24 C22 22 26 22 28 24" strokeWidth="1" />
          <path d="M36 24 C38 22 42 22 44 24" strokeWidth="1" />
          <path d="M22 30 Q24 33 26 30" strokeWidth="1" />
          <path d="M38 30 Q40 33 42 30" strokeWidth="1" />
          {isCommedia ? (
            <path d="M24 44 Q32 50 40 44" strokeWidth="1" />
          ) : (
            <path d="M24 48 Q32 42 40 48" strokeWidth="1" />
          )}
        </>
      )}
      {style === "B" && (
        <>
          {/* Forma diamante geometrica */}
          <polygon points="32,6 52,32 32,58 12,32" />
          <line x1="20" y1="22" x2="28" y2="26" />
          <line x1="44" y1="22" x2="36" y2="26" />
          <polygon points="22,28 24,30 22,32 20,30" fill="currentColor" stroke="none" />
          <polygon points="42,28 44,30 42,32 40,30" fill="currentColor" stroke="none" />
          {isCommedia ? (
            <polyline points="22,42 26,46 38,46 42,42" />
          ) : (
            <polyline points="22,46 26,42 38,42 42,46" />
          )}
          <line x1="32" y1="10" x2="32" y2="18" />
        </>
      )}
      {style === "C" && (
        <>
          <path d="M32 6 C18 6 12 18 12 32 C12 46 22 58 32 58 C42 58 52 46 52 32 C52 18 46 6 32 6 Z" />
          <path d="M18 22 C20 19 24 19 26 21" />
          <path d="M38 21 C40 19 44 19 46 22" />
          <ellipse cx="22" cy="28" rx="2.4" ry="1.6" fill="currentColor" />
          <ellipse cx="42" cy="28" rx="2.4" ry="1.6" fill="currentColor" />
          {isCommedia ? (
            <path d="M22 42 C26 48 38 48 42 42" />
          ) : (
            <path d="M22 46 C26 40 38 40 42 46" />
          )}
          <path d="M28 12 L32 9 L36 12" />
        </>
      )}
    </svg>
  );
}
