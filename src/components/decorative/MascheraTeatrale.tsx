import { cn } from "@/lib/cn";

interface MascheraTeatraleProps {
  tipo?: "commedia" | "tragedia";
  size?: number;
  className?: string;
}

export function MascheraTeatrale({
  tipo = "commedia",
  size = 48,
  className,
}: MascheraTeatraleProps) {
  const isCommedia = tipo === "commedia";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("inline-block", className)}
    >
      {/* Contorno volto */}
      <path d="M32 6 C18 6 12 18 12 32 C12 46 22 58 32 58 C42 58 52 46 52 32 C52 18 46 6 32 6 Z" />
      {/* Sopracciglia stilizzate */}
      <path d="M18 22 C20 19 24 19 26 21" />
      <path d="M38 21 C40 19 44 19 46 22" />
      {/* Occhi */}
      <ellipse cx="22" cy="28" rx="2.4" ry="1.6" fill="currentColor" />
      <ellipse cx="42" cy="28" rx="2.4" ry="1.6" fill="currentColor" />
      {/* Bocca: sorriso o smorfia */}
      {isCommedia ? (
        <path d="M22 42 C26 48 38 48 42 42" />
      ) : (
        <path d="M22 46 C26 40 38 40 42 46" />
      )}
      {/* Decoro fronte */}
      <path d="M28 12 L32 9 L36 12" />
    </svg>
  );
}
