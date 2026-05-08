import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { CategoriaBadge } from "@/components/caraval/CategoriaBadge";
import type { ItemEvento } from "@/lib/calendario-utils";

const GIORNI_SETT = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
const MESI_BREVI = [
  "gen", "feb", "mar", "apr", "mag", "giu",
  "lug", "ago", "set", "ott", "nov", "dic",
];

function formatOra(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function EventoCard({ item, className }: { item: ItemEvento; className?: string }) {
  const { data, titolo, slug, categoria, luogo, modalitaAccesso, urlBiglietti, note } = item;

  const luogoLabel = [luogo?.nome, luogo?.citta].filter(Boolean).join(" · ");
  const detailHref = `/spettacoli/${slug}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col md:flex-row gap-4 md:gap-8 items-start p-5 md:p-6 rounded-md bg-nero-soft border border-transparent hover:border-rosso-base/30 transition-all duration-base hover:-translate-y-1",
        className
      )}
    >
      {/* Data sx (80px desktop) */}
      <div className="flex md:flex-col items-baseline md:items-center gap-3 md:gap-1 shrink-0 md:w-20 md:py-2 md:text-center">
        <span className="font-display text-display-m leading-none text-crema-base">
          {data.getDate()}
        </span>
        <div className="flex md:flex-col gap-2 md:gap-0">
          <span className="text-label uppercase-tracked text-rosso-hover">
            {MESI_BREVI[data.getMonth()]}
          </span>
          <span className="text-caption text-crema-muted">
            {GIORNI_SETT[data.getDay()]} · {formatOra(data)}
          </span>
        </div>
      </div>

      {/* Contenuto dx */}
      <div className="flex-1 min-w-0 w-full">
        {categoria && (
          <CategoriaBadge categoria={categoria} size="sm" className="mb-3" />
        )}
        <h3 className="font-display text-h4 text-crema-base leading-tight">
          <Link
            href={detailHref}
            className="hover:text-rosso-hover transition-colors stretched-link-target"
          >
            <span className="absolute inset-0" aria-hidden="true" />
            {titolo}
          </Link>
        </h3>
        {luogoLabel && (
          <p className="mt-2 text-body-s text-crema-muted">{luogoLabel}</p>
        )}
        {note && (
          <p className="mt-2 text-body-s italic text-crema-muted/80">{note}</p>
        )}

        {/* CTA dinamica — z-index per sopra alla stretched-link */}
        <div className="relative z-10 mt-4">
          {modalitaAccesso === "linkEsterno" && urlBiglietti && (
            <a
              href={urlBiglietti}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-rosso-base text-crema-base text-body-s font-semibold hover:bg-rosso-hover transition-colors"
            >
              Vai ai biglietti
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          {modalitaAccesso === "prenotazione" && (
            <a
              href={`mailto:caravalspettacoli@gmail.com?subject=${encodeURIComponent(`Prenotazione ${titolo}`)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-rosso-base text-crema-base text-body-s font-semibold hover:bg-rosso-hover transition-colors"
            >
              Prenota
            </a>
          )}
          {modalitaAccesso === "ingressoLibero" && (
            <span className="inline-block px-3 py-1.5 rounded-sm border border-amber-400/60 text-amber-300 text-caption uppercase-tracked">
              Ingresso libero
            </span>
          )}
          {modalitaAccesso === "botteghino" && (
            <span className="inline-block px-3 py-1.5 rounded-sm border border-crema-faint text-crema-muted text-caption uppercase-tracked">
              Biglietto al teatro
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default EventoCard;
