import { cn } from "@/lib/cn";

interface OndaDecorativaProps {
  width?: number | string;
  variant?: "sottile" | "spessa";
  className?: string;
  /** A=onda morbida, B=zigzag art deco, C=onda sinusoidale (default) */
  style?: "A" | "B" | "C";
}

export function OndaDecorativa({
  width = 240,
  variant = "sottile",
  className,
  style = "C",
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
      strokeLinejoin={style === "B" ? "miter" : "round"}
      aria-hidden="true"
      className={cn("inline-block", className)}
      preserveAspectRatio="none"
    >
      {style === "A" && (
        <path d="M0 8 C 12 4, 24 4, 36 8 S 60 12, 72 8 S 96 4, 108 8 S 132 12, 144 8 S 168 4, 180 8 S 204 12, 216 8 S 232 6, 240 8" />
      )}
      {style === "B" && (
        <polyline points="0,8 15,2 30,14 45,2 60,14 75,2 90,14 105,2 120,14 135,2 150,14 165,2 180,14 195,2 210,14 225,2 240,8" />
      )}
      {style === "C" && (
        <path d="M0 8 Q 15 1 30 8 T 60 8 T 90 8 T 120 8 T 150 8 T 180 8 T 210 8 T 240 8" />
      )}
    </svg>
  );
}
