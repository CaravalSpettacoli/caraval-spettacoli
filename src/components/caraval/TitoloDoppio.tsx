import { cn } from "@/lib/cn";
import { splitDisplay } from "@/lib/splitDisplay";

interface TitoloDoppioProps {
  /** Prima parola/riga in display Stonehead. SOLO A-Z e 0-9. */
  display: string;
  /** Seconda parola/riga in display Stonehead, sovrapposta. SOLO A-Z e 0-9. */
  display2: string;
  /** Sottotitolo in Inter italic. Può contenere punteggiatura. */
  body?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function TitoloDoppio({
  display,
  display2,
  body,
  align = "left",
  className,
  as: Tag = "h2",
}: TitoloDoppioProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <Tag
        className={cn(
          "leading-[0.9] tracking-tight",
          align === "center" ? "text-center" : "text-left",
        )}
      >
        <span className="block font-display text-display-l md:text-display-xl">
          {splitDisplay(display)}
        </span>
        <span
          className={cn(
            "block font-display text-display-l md:text-display-xl text-rosso-base -mt-4 md:-mt-6",
            align === "center"
              ? "translate-x-2 md:translate-x-4"
              : "translate-x-6 md:translate-x-12",
          )}
        >
          {splitDisplay(display2)}
        </span>
      </Tag>
      {body && (
        <p className="mt-4 font-sans italic text-body-l text-crema-muted">
          {body}
        </p>
      )}
    </div>
  );
}
