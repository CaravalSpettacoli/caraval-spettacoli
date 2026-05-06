import { cn } from "@/lib/cn";

interface Stella5PunteProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}

export function Stella5Punte({
  size = 24,
  className,
  "aria-hidden": ariaHidden = true,
}: Stella5PunteProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={ariaHidden}
      className={cn("inline-block", className)}
    >
      {/* Stella leggermente irregolare — punte di lunghezza non identica per dare carattere */}
      <path d="M12 1.4 L14.5 8.7 L22.3 9.0 L16.0 13.7 L18.2 21.4 L12 16.9 L5.7 21.2 L8.1 13.6 L1.7 9.1 L9.5 8.6 Z" />
    </svg>
  );
}
