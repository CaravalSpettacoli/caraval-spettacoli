"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/effects/Reveal";
import { urlFor } from "@/../sanity/lib/image";
import type { ProssimoEvento } from "@/lib/prossimi-eventi-utils";

const GIORNI_SETT = [
  "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato",
];
const MESI = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

function formatDataLunga(d: Date): string {
  return `${GIORNI_SETT[d.getDay()]} ${d.getDate()} ${MESI[d.getMonth()]} ${d.getFullYear()}`;
}

function formatOra(d: Date): string {
  return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

function countdownLabel(data: Date): string | null {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const dataMidnight = new Date(data);
  dataMidnight.setHours(0, 0, 0, 0);
  const diffMs = dataMidnight.getTime() - oggi.getTime();
  const diffGiorni = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffGiorni === 0) return "Oggi";
  if (diffGiorni === 1) return "Domani";
  if (diffGiorni > 1 && diffGiorni <= 30) return `Tra ${diffGiorni} giorni`;
  return null;
}

function EventoFeedRow({ evento }: { evento: ProssimoEvento }) {
  const fotoUrl =
    evento.foto?.asset?._ref &&
    urlFor(evento.foto as Parameters<typeof urlFor>[0])
      .width(400)
      .height(300)
      .fit("crop")
      .url();
  const countdown = countdownLabel(evento.data);
  const dataLabel = formatDataLunga(evento.data);
  const oraLabel = formatOra(evento.data);
  const iniziale = evento.titolo.slice(0, 2).toUpperCase();

  return (
    <article className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-4 md:gap-6 items-center p-4 md:p-5 transition-all duration-base hover:-translate-y-0.5">
      {/* Foto sx (desktop) / top (mobile) */}
      <div className="relative w-full aspect-[4/3] md:h-[120px] md:aspect-auto rounded-md overflow-hidden">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={evento.titolo}
            fill
            sizes="(min-width: 768px) 180px, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-display text-rosso-base"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,23,74,0.22), rgba(168,23,74,0.06))",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
            }}
          >
            {iniziale}
          </div>
        )}
      </div>

      {/* Contenuto */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <time
            dateTime={evento.data.toISOString()}
            className="text-caption text-crema-muted"
          >
            {dataLabel} · {oraLabel}
          </time>
          {countdown && (
            <span
              className="text-[0.7rem] uppercase tracking-wider font-medium px-2 py-0.5 rounded text-rosso-base"
              style={{ backgroundColor: "rgba(168,23,74,0.15)" }}
            >
              {countdown}
            </span>
          )}
        </div>

        <h3 className="font-display text-h4 leading-tight text-crema-base m-0 truncate">
          {evento.titolo}
        </h3>

        {evento.location && (
          <p className="flex items-center gap-1.5 text-body-s text-crema-muted m-0">
            <MapPin size={14} className="shrink-0" aria-hidden />
            <span className="truncate">{evento.location}</span>
          </p>
        )}

        {evento.descrizioneBreve && (
          <p className="text-body-s text-crema-base/80 m-0 line-clamp-2">
            {evento.descrizioneBreve}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="flex md:justify-end">
        <Link
          href={evento.ctaHref}
          className="inline-flex items-center px-4 py-2 text-caption uppercase tracking-wider border border-rosso-base/40 text-crema-base hover:border-rosso-base hover:bg-rosso-muted transition-all duration-base rounded-md"
          {...(evento.ctaExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {evento.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

export function ProssimiEventiHomepage({
  eventi,
  eyebrow = "PROSSIMI EVENTI",
  heading = "In programma",
  ctaTuttiLabel = "Vedi tutti gli eventi →",
  ctaTuttiHref = "/calendario",
}: {
  eventi: ProssimoEvento[];
  eyebrow?: string;
  heading?: string;
  ctaTuttiLabel?: string;
  ctaTuttiHref?: string;
}) {
  if (!eventi || eventi.length === 0) return null;

  return (
    <section
      data-theme="dark"
      className="bg-nero-soft text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        <Reveal>
          <p className="uppercase-tracked text-caption text-rosso-base mb-2">
            {eyebrow}
          </p>
          <h2 className="font-display text-h2 leading-tight mb-8">{heading}</h2>
        </Reveal>

        <Reveal
          as="ul"
          className="reveal-stagger list-none p-0 m-0 flex flex-col gap-4"
        >
          {eventi.map((evento) => (
            <li
              key={evento.id}
              className="border border-rosso-base/20 rounded-md transition-colors duration-base hover:border-rosso-base"
            >
              <EventoFeedRow evento={evento} />
            </li>
          ))}
        </Reveal>

        {eventi.length >= 5 && (
          <div className="text-center mt-10">
            <Link href={ctaTuttiHref} className="cta-tertiary">
              {ctaTuttiLabel}
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}

export default ProssimiEventiHomepage;
