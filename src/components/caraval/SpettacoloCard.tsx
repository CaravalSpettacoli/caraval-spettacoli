import Link from "next/link";
import { CategoriaBadge, type Categoria } from "./CategoriaBadge";
import { PremioBadge } from "./PremioBadge";
import { cn } from "@/lib/cn";
import { splitDisplay } from "@/lib/splitDisplay";

export type SpettacoloCardData = {
  slug: string;
  titolo: string;
  sottotitolo?: string;
  categoria: Categoria;
  anno?: number;
  coverUrl?: string;
  coverAlt?: string;
  premi?: { nome: string; anno: number | string; categoria?: string }[];
};

export type SpettacoloCardVariant = "card" | "manifesto";
export type SpettacoloCardSize = "sm" | "md" | "lg";

export type SpettacoloCardProps = {
  spettacolo: SpettacoloCardData;
  variant?: SpettacoloCardVariant;
  size?: SpettacoloCardSize;
  className?: string;
};

const placeholderTone: Record<Categoria, string> = {
  prosa: "bg-rosso-deep",
  strada: "bg-nero-soft",
  fuoco: "bg-rosso-base",
};

const CATEGORIA_LABEL: Record<Categoria, string> = {
  prosa: "PROSA",
  strada: "STRADA",
  fuoco: "FUOCO",
};

export function SpettacoloCard({
  spettacolo,
  variant = "card",
  size = "md",
  className,
}: SpettacoloCardProps) {
  const {
    slug,
    titolo,
    sottotitolo,
    categoria,
    anno,
    coverUrl,
    coverAlt,
    premi,
  } = spettacolo;
  const primoPremio = premi?.[0];

  if (variant === "manifesto") {
    return (
      <Link
        href={`/spettacoli/${slug}`}
        className={cn(
          "group relative block overflow-hidden bg-nero-soft rounded-sm transition-all duration-slow ease-cinema",
          "hover:shadow-poster hover:-rotate-1",
          size === "sm" && "max-w-[240px]",
          size === "md" && "max-w-[320px]",
          size === "lg" && "max-w-[420px]",
          className,
        )}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={coverAlt || titolo}
              className="w-full h-full object-cover transition-transform duration-slow ease-cinema group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center transition-transform duration-slow ease-cinema group-hover:scale-105",
                placeholderTone[categoria],
              )}
              aria-hidden="true"
            >
              <span className="font-display text-display-l text-crema-base/20">
                {titolo.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Categoria verticale lato sinistro */}
          <span
            className="absolute top-4 left-3 px-2 py-3 bg-rosso-base/90 text-crema-base text-[11px] font-semibold tracking-[0.2em]"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {CATEGORIA_LABEL[categoria]}
          </span>

          {/* Stamp premio rotondo */}
          {primoPremio && (
            <div
              className="absolute top-4 right-4 w-20 h-20 rounded-full bg-rosso-base text-crema-base flex flex-col items-center justify-center text-center shadow-md rotate-12 group-hover:rotate-6 transition-transform duration-slow ease-cinema"
              aria-hidden="true"
            >
              <span className="font-display text-[14px] leading-none tracking-wide">
                WINNER
              </span>
              <span className="font-display text-[18px] leading-none mt-1">
                {primoPremio.anno}
              </span>
            </div>
          )}

          {/* Gradient + titolo overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-overlay-nero pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-display-m leading-[0.9] text-crema-base">
              {splitDisplay(titolo)}
            </h3>
            {sottotitolo && (
              <p className="mt-2 font-sans italic text-body-s text-crema-muted line-clamp-2">
                {sottotitolo}
              </p>
            )}
            {anno && (
              <p className="mt-2 text-label uppercase-tracked text-rosso-hover">
                {anno}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/spettacoli/${slug}`}
      className={cn(
        "group block rounded-md overflow-hidden bg-nero-soft transition-all duration-base ease-cinema hover:shadow-glow-rosso hover:ring-1 hover:ring-rosso-base/40",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={coverAlt || titolo}
            className="w-full h-full object-cover transition-transform duration-slow ease-cinema group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center transition-transform duration-slow ease-cinema group-hover:scale-105",
              placeholderTone[categoria],
            )}
            aria-hidden="true"
          >
            <span className="font-display text-display-m text-crema-base/30">
              {titolo.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <CategoriaBadge categoria={categoria} size="sm" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-h4 text-crema-base group-hover:text-crema-bright transition-colors">
          {splitDisplay(titolo)}
        </h3>
        {sottotitolo && (
          <p className="mt-1 text-body-s text-crema-muted line-clamp-2">
            {sottotitolo}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-caption text-crema-muted">
          {anno && <span>{anno}</span>}
          {anno && primoPremio && <span aria-hidden="true">·</span>}
          {primoPremio && (
            <PremioBadge nome={primoPremio.nome} anno={primoPremio.anno} />
          )}
        </div>
      </div>
    </Link>
  );
}

export default SpettacoloCard;
