import { Theater, Drama, Sparkles, Music, Flame } from "lucide-react";
import { cn } from "@/lib/cn";

type GlifoTipo = "theater" | "drama" | "sparkles" | "music" | "flame";

const ICONS = {
  theater: Theater,
  drama: Drama,
  sparkles: Sparkles,
  music: Music,
  flame: Flame,
};

/** Glifo decorativo riusabile da posizionare sopra l'eyebrow di una sezione.
 *
 *  Icona lucide-react, opacity 0.6, colore corrente (eredita dal contesto theme).
 *  Centra orizzontalmente di default; passare `align="left"` per allineamento sx. */
export function GlifoDecorativo({
  tipo = "sparkles",
  size = 28,
  align = "center",
  className,
}: {
  tipo?: GlifoTipo;
  size?: number;
  align?: "center" | "left";
  className?: string;
}) {
  const Icon = ICONS[tipo];
  return (
    <span
      aria-hidden
      className={cn(
        "glifo-decorativo block text-rosso-base/60 mb-3",
        align === "center" ? "mx-auto" : "ml-0",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Icon
        width={size}
        height={size}
        strokeWidth={1.5}
        className="block"
      />
    </span>
  );
}

export default GlifoDecorativo;
