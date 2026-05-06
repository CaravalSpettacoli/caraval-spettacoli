import { Award } from "lucide-react";
import { cn } from "@/lib/cn";

export type PremioBadgeProps = {
  nome: string;
  anno: number | string;
  categoria?: string;
  className?: string;
};

export function PremioBadge({
  nome,
  anno,
  categoria,
  className,
}: PremioBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border border-rosso-base px-3 py-1 text-caption uppercase-tracked text-crema-base",
        className
      )}
    >
      <Award size={14} className="text-rosso-hover" aria-hidden="true" />
      <span className="font-semibold">{nome}</span>
      <span className="text-crema-muted">{anno}</span>
      {categoria && (
        <span className="text-crema-muted">— {categoria}</span>
      )}
    </span>
  );
}

export default PremioBadge;
