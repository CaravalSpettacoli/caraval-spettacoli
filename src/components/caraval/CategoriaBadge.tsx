import { cn } from "@/lib/cn";

export type Categoria = "prosa" | "strada" | "fuoco";

export type CategoriaBadgeProps = {
  categoria: Categoria;
  className?: string;
  size?: "sm" | "md";
};

const styles: Record<Categoria, string> = {
  prosa: "bg-rosso-base text-crema-base",
  strada: "bg-crema-base text-nero-base",
  fuoco: "bg-rosso-deep text-crema-base",
};

const labels: Record<Categoria, string> = {
  prosa: "Prosa",
  strada: "Strada",
  fuoco: "Fuoco",
};

export function CategoriaBadge({
  categoria,
  className,
  size = "md",
}: CategoriaBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm uppercase-tracked font-semibold",
        size === "sm"
          ? "px-2 py-1 text-[10px]"
          : "px-3 py-1 text-label",
        styles[categoria],
        className
      )}
    >
      {labels[categoria]}
    </span>
  );
}

export default CategoriaBadge;
