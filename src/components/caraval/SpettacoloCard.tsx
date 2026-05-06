import Link from "next/link";
import { CategoriaBadge, type Categoria } from "./CategoriaBadge";
import { PremioBadge } from "./PremioBadge";
import { cn } from "@/lib/cn";

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

export type SpettacoloCardProps = {
  spettacolo: SpettacoloCardData;
  className?: string;
};

const placeholderTone: Record<Categoria, string> = {
  prosa: "bg-rosso-deep",
  strada: "bg-nero-soft",
  fuoco: "bg-rosso-base",
};

export function SpettacoloCard({ spettacolo, className }: SpettacoloCardProps) {
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

  return (
    <Link
      href={`/spettacoli/${slug}`}
      className={cn(
        "group block rounded-md overflow-hidden bg-nero-soft transition-all duration-base ease-cinema hover:shadow-glow-rosso hover:ring-1 hover:ring-rosso-base/40",
        className
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
              placeholderTone[categoria]
            )}
            aria-hidden="true"
          >
            <span className="font-display text-display-m text-crema-base/30">
              {titolo.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <CategoriaBadge categoria={categoria} size="sm" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-h4 text-crema-base group-hover:text-crema-bright transition-colors">
          {titolo}
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
            <PremioBadge
              nome={primoPremio.nome}
              anno={primoPremio.anno}
            />
          )}
        </div>
      </div>
    </Link>
  );
}

export default SpettacoloCard;
