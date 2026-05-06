import { cn } from "@/lib/cn";
import { splitDisplay } from "@/lib/splitDisplay";

interface TitoloRitmicoPart {
  /** Parola in display Stonehead — SOLO A-Z e 0-9, niente punteggiatura. */
  text: string;
  size: "small" | "large";
}

interface TitoloRitmicoProps {
  parts: TitoloRitmicoPart[];
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function TitoloRitmico({
  parts,
  align = "left",
  className,
  as: Tag = "h2",
}: TitoloRitmicoProps) {
  return (
    <Tag
      className={cn(
        "font-display flex flex-wrap items-baseline gap-x-4 gap-y-1 leading-[0.9]",
        align === "center" ? "justify-center text-center" : "justify-start",
        className,
      )}
    >
      {parts.map((part, i) => (
        <span
          key={i}
          className={cn(
            part.size === "large"
              ? "text-display-m md:text-display-xl"
              : "text-h3 md:text-display-m text-crema-muted",
          )}
        >
          {splitDisplay(part.text)}
        </span>
      ))}
    </Tag>
  );
}
