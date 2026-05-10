import Link from "next/link";
import { cn } from "@/lib/cn";

type StatoCorso = "in_corso" | "iscrizioni_aperte" | "concluso";

const STATO_LABEL: Record<StatoCorso, string> = {
  in_corso: "In corso",
  iscrizioni_aperte: "Iscrizioni aperte",
  concluso: "Concluso",
};

const STATO_STYLE: Record<StatoCorso, string> = {
  in_corso: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  iscrizioni_aperte: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  concluso: "bg-crema-faint text-crema-muted border-crema-faint",
};

const TARGET_LABEL: Record<string, string> = {
  adulti: "Adulti",
  bambini: "Bambini",
  adolescenti: "Adolescenti",
  professionisti: "Professionisti",
  scuole: "Scuole",
  altro: "Altro",
};

function formatRange(inizio?: string, fine?: string) {
  if (!inizio && !fine) return null;
  const fmt = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("it-IT", {
          month: "short",
          year: "numeric",
        })
      : "?";
  return `${fmt(inizio)} – ${fmt(fine)}`;
}

export type CorsoCardData = {
  _id: string;
  titolo: string;
  target?: string;
  statoCorso?: StatoCorso;
  frequenza?: string;
  dataInizio?: string;
  dataFine?: string;
  spettacoloFinaleLinked?: {
    titolo?: string;
    slug?: string;
    edizione?: { anno?: number };
  };
  referenteIscrizioni?: {
    nome?: string;
    telefonoPubblico?: string;
    emailPubblica?: string;
  };
};

export function CorsoCard({
  corso,
  className,
}: {
  corso: CorsoCardData;
  className?: string;
}) {
  const stato = (corso.statoCorso ?? "in_corso") as StatoCorso;
  const target = corso.target ? TARGET_LABEL[corso.target] ?? corso.target : null;
  const range = formatRange(corso.dataInizio, corso.dataFine);
  const ref = corso.referenteIscrizioni;
  const finale = corso.spettacoloFinaleLinked;
  const finaleHref =
    finale?.slug && finale?.edizione?.anno
      ? `/imaginarium/${finale.edizione.anno}/${finale.slug}`
      : null;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 p-6 md:p-8 rounded-md bg-nero-soft border border-crema-faint/40",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-block px-3 py-1 rounded-sm border text-caption uppercase-tracked font-semibold",
            STATO_STYLE[stato]
          )}
        >
          {STATO_LABEL[stato]}
        </span>
        {target && (
          <span className="text-caption uppercase-tracked text-crema-muted">
            {target}
          </span>
        )}
      </div>

      <h3 className="font-display text-h3 text-crema-base leading-tight">
        {corso.titolo}
      </h3>

      <dl className="grid grid-cols-1 gap-2 text-body-s">
        {corso.frequenza && (
          <div className="flex gap-3">
            <dt className="text-crema-muted shrink-0 w-24">Frequenza</dt>
            <dd className="text-crema-base">{corso.frequenza}</dd>
          </div>
        )}
        {range && (
          <div className="flex gap-3">
            <dt className="text-crema-muted shrink-0 w-24">Date</dt>
            <dd className="text-crema-base">{range}</dd>
          </div>
        )}
        {finale?.titolo && (
          <div className="flex gap-3">
            <dt className="text-crema-muted shrink-0 w-24">Spettacolo finale</dt>
            <dd className="text-crema-base">
              {finaleHref ? (
                <Link
                  href={finaleHref}
                  className="hover:text-rosso-hover transition-colors underline underline-offset-4 decoration-rosso-base/50"
                >
                  {finale.titolo}
                </Link>
              ) : (
                finale.titolo
              )}
            </dd>
          </div>
        )}
      </dl>

      {ref && (ref.telefonoPubblico || ref.emailPubblica) && (
        <div className="mt-2 pt-4 border-t border-crema-faint/40">
          <p className="text-label uppercase-tracked text-rosso-hover mb-2">
            Iscrizioni
          </p>
          <div className="mt-1 flex flex-col gap-1 text-body-s">
            {ref.telefonoPubblico && (
              <a
                href={`tel:${ref.telefonoPubblico.replace(/\s+/g, "")}`}
                className="text-crema-muted hover:text-rosso-hover transition-colors"
              >
                {ref.telefonoPubblico}
              </a>
            )}
            {ref.emailPubblica && (
              <a
                href={`mailto:${ref.emailPubblica}`}
                className="text-crema-muted hover:text-rosso-hover transition-colors break-all"
              >
                {ref.emailPubblica}
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default CorsoCard;
