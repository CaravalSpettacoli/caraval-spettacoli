import { cn } from "@/lib/cn";

interface FiammaProps {
  size?: number;
  className?: string;
}

export function Fiamma({ size = 32, className }: FiammaProps) {
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
      {/* Fiamma stilizzata: contorno esterno + lingua interna */}
      <path d="M16 2 C16 8 22 11 22 18 C22 24 19 28 16 28 C13 28 10 24 10 18 C10 13 13 11 14 7 C14.5 9 15.5 10 16 12 Z" />
      <path d="M16 14 C16 17 18 18 18 21 C18 24 16.8 26 16 26 C15.2 26 14 24 14 21 C14 19 15 18 16 14 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
