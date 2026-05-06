import { cn } from "@/lib/cn";

interface OndaDecorativaProps {
  width?: number | string;
  variant?: "sottile" | "spessa";
  className?: string;
}

export function OndaDecorativa({
  width = 240,
  variant = "sottile",
  className,
}: OndaDecorativaProps) {
  const stroke = variant === "spessa" ? 2.5 : 1.25;
  return (
    <svg
      width={width}
      height={16}
      viewBox="0 0 240 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("inline-block", className)}
      preserveAspectRatio="none"
    >
      <path d="M0 8 Q 15 1 30 8 T 60 8 T 90 8 T 120 8 T 150 8 T 180 8 T 210 8 T 240 8" />
    </svg>
  );
}
