import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/cn";
import { urlFor } from "@/../sanity/lib/image";

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
  slug?: string;
  target?: string;
  statoCorso?: StatoCorso;
  frequenza?: string;
  descrizioneBreve?: string;
  immagineCover?: { asset?: { _ref?: string }; alt?: string };
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
  /** Override label della CTA. Default "Scopri il corso". */
  ctaLabel?: string;
};

/** Corpo condiviso fra la variante cliccabile e quella senza slug. */
function CorpoCorso({
  corso,
  stato,
  target,
  range,
  coverUrl,
}: {
  corso: CorsoCardData;
  stato: StatoCorso;
  target: string | null;
  range: string | null;
  coverUrl: string | null;
}) {
  return (
    <>
      {coverUrl ? (
        <div className="relative -mx-6 -mt-6 mb-2 aspect-[16/9] overflow-hidden rounded-t-md md:-mx-8 md:-mt-8">
          <Image
            src={coverUrl}
            alt={corso.immagineCover?.alt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-slow group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-nero-base via-nero-base/30 to-transparent"
          />
        </div>
      ) : (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rosso-base/40"
          style={{ backgroundColor: "rgba(168, 23, 74, 0.1)" }}
          aria-hidden
        >
          <GraduationCap className="h-5 w-5 text-rosso-base" />
        </div>
      )}

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

      {corso.descrizioneBreve && (
        <p className="whitespace-pre-line text-body-s text-crema-muted leading-relaxed">
          {corso.descrizioneBreve}
        </p>
      )}

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
        {corso.spettacoloFinaleLinked?.titolo && (
          <div className="flex gap-3">
            <dt className="text-crema-muted shrink-0 w-24">Spettacolo finale</dt>
            <dd className="text-crema-base">
              {corso.spettacoloFinaleLinked.titolo}
            </dd>
          </div>
        )}
      </dl>
    </>
  );
}

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

  const coverUrl = corso.immagineCover?.asset?._ref
    ? urlFor(corso.immagineCover as Parameters<typeof urlFor>[0])
        .width(800)
        .height(450)
        .fit("crop")
        .url()
    : null;

  const shell =
    "group flex flex-col gap-4 p-6 md:p-8 rounded-md bg-nero-base border border-rosso-base/30 transition-all duration-base hover:border-rosso-base hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(168,23,74,0.18)]";

  // Senza slug non esiste una pagina di dettaglio: la card resta statica e
  // rimanda ai contatti, mostrando i recapiti del referente iscrizioni.
  if (!corso.slug) {
    return (
      <article className={cn(shell, className)}>
        <CorpoCorso
          corso={corso}
          stato={stato}
          target={target}
          range={range}
          coverUrl={coverUrl}
        />

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

        <Link
          href="/contatti"
          className="mt-auto inline-flex items-center gap-2 text-body-s text-crema-base underline underline-offset-4 decoration-rosso-base hover:text-rosso-hover transition-colors uppercase-tracked"
        >
          Contattaci per informazioni →
        </Link>
      </article>
    );
  }

  return (
    <Link
      href={`/caraval-academy/${corso.slug}`}
      className={cn(shell, "no-underline", className)}
      aria-label={`${corso.ctaLabel ?? "Scopri il corso"}: ${corso.titolo}`}
    >
      <CorpoCorso
        corso={corso}
        stato={stato}
        target={target}
        range={range}
        coverUrl={coverUrl}
      />

      <span className="mt-auto inline-flex items-center gap-2 pt-2 text-body-s text-crema-base uppercase-tracked underline underline-offset-4 decoration-rosso-base transition-colors group-hover:text-rosso-hover">
        {corso.ctaLabel ?? "Scopri il corso"}
        <span
          aria-hidden
          className="transition-transform duration-base group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}

export default CorsoCard;
