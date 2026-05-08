import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { splitDisplay } from "@/lib/splitDisplay";

export type EventoCardSimpleData = {
  data: string; // ISO date
  titolo: string;
  citta?: string;
  struttura?: string;
  modalitaAccesso?: string;
  tipoEvento?: string;
  ticketUrl?: string;
  detailUrl?: string;
};

export type EventoCardSimpleProps = {
  evento: EventoCardSimpleData;
  className?: string;
};

const MESI_BREVI = [
  "GEN", "FEB", "MAR", "APR", "MAG", "GIU",
  "LUG", "AGO", "SET", "OTT", "NOV", "DIC",
];

function parseData(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    giorno: d.getDate(),
    mese: MESI_BREVI[d.getMonth()],
    anno: d.getFullYear(),
  };
}

export function EventoCardSimple({ evento, className }: EventoCardSimpleProps) {
  const {
    data,
    titolo,
    citta,
    struttura,
    modalitaAccesso,
    tipoEvento,
    ticketUrl,
    detailUrl,
  } = evento;
  const parsed = parseData(data);

  return (
    <article
      className={cn(
        "flex gap-5 md:gap-8 items-start p-5 md:p-6 rounded-md bg-nero-soft border border-transparent hover:border-rosso-base/30 transition-colors",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center shrink-0 w-20 md:w-24 py-3 rounded-md bg-nero-deep border border-crema-faint text-center">
        {parsed ? (
          <>
            <span className="font-display text-display-m leading-none text-crema-base">
              {parsed.giorno}
            </span>
            <span className="mt-1 text-label uppercase-tracked text-rosso-hover">
              {parsed.mese}
            </span>
            <span className="text-caption text-crema-muted">{parsed.anno}</span>
          </>
        ) : (
          <span className="text-caption text-crema-muted">TBD</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {tipoEvento && (
          <div className="text-label uppercase-tracked text-rosso-hover mb-2">
            {tipoEvento}
          </div>
        )}
        <h3 className="font-display text-h4 text-crema-base">
          {detailUrl ? (
            <Link
              href={detailUrl}
              className="hover:text-rosso-hover transition-colors"
            >
              {splitDisplay(titolo)}
            </Link>
          ) : (
            splitDisplay(titolo)
          )}
        </h3>
        <p className="mt-1 text-body-s text-crema-muted">
          {[citta, struttura].filter(Boolean).join(" — ")}
        </p>
        {modalitaAccesso && (
          <p className="mt-2 text-caption uppercase-tracked text-crema-base/80">
            {modalitaAccesso}
          </p>
        )}
        {ticketUrl && (
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-body-s font-semibold text-rosso-hover hover:text-rosso-base transition-colors"
          >
            Vai ai biglietti
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}

export default EventoCardSimple;
