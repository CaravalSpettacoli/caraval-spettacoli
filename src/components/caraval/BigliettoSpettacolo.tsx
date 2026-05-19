"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { ArrowLeft, ExternalLink, Mail, Phone, Ticket as TicketIcon } from "lucide-react";
import { Stella5Punte } from "@/components/decorative/Stella5Punte";
import { cn } from "@/lib/cn";
import { urlFor } from "@/../sanity/lib/image";

export type ModalitaPrenotazione =
  | "linkEsterno"
  | "emailTelefono"
  | "ingressoLibero"
  | "botteghino"
  | "richiestaContatto";

type SanityImage = { asset?: { _ref?: string }; alt?: string };

export type BigliettoSpettacoloData = {
  titolo: string;
  sottotitolo?: string;
  categoria?: "prosa" | "fuoco" | "strada";
  annoCreazione?: number;
  slug?: string;
  prenotazione?: {
    modalita?: ModalitaPrenotazione;
    urlBiglietti?: string;
    qrCode?: SanityImage;
    etichettaCustom?: string;
    noteAggiuntive?: string;
  };
  contatti?: {
    telefono?: string;
    email?: string;
  };
};

const CATEGORIA_LABEL: Record<NonNullable<BigliettoSpettacoloData["categoria"]>, string> = {
  prosa: "Prosa",
  fuoco: "Teatro di fuoco",
  strada: "Teatro di strada",
};

function pulisciTel(tel?: string) {
  return tel ? tel.replace(/\s+/g, "") : "";
}

function defaultCtaLabel(modalita: ModalitaPrenotazione): string {
  switch (modalita) {
    case "linkEsterno":
      return "Vai al sito ufficiale";
    case "emailTelefono":
      return "Clicca per la prenotazione";
    case "ingressoLibero":
      return "Clicca per maggiori informazioni";
    case "botteghino":
      return "Acquista biglietto";
    default:
      return "Clicca per maggiori informazioni";
  }
}

/** Biglietto teatrale vintage con reveal animato della CTA in base alla
 *  modalità di prenotazione configurata su Sanity (`prenotazione.modalita`).
 *
 *  Stati:
 *  - chiuso: card "biglietto" con titolo, categoria, anno, e CTA "Vai allo
 *    spettacolo →"
 *  - aperto: la zona CTA viene rivelata con fade+slide e mostra il contenuto
 *    appropriato alla modalità (link esterno / QR code / telefono / mail /
 *    info ingresso libero / richiesta contatti). */
export function BigliettoSpettacolo({ data }: { data: BigliettoSpettacoloData }) {
  const [revealed, setRevealed] = useState(false);
  const modalita: ModalitaPrenotazione =
    data.prenotazione?.modalita ?? "richiestaContatto";
  const ctaLabel =
    data.prenotazione?.etichettaCustom ?? defaultCtaLabel(modalita);

  const reveal = () => setRevealed(true);
  const reset = () => setRevealed(false);

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      reveal();
    }
  };

  return (
    <article
      className="biglietto-vintage relative mx-auto w-full max-w-[320px] flex flex-col bg-crema-base text-nero-base border-[1.5px] border-rosso-base rounded-xl overflow-hidden shadow-lg"
      style={{
        aspectRatio: "5 / 8",
        boxShadow:
          "0 18px 40px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(168,23,74,0.08)",
      }}
      aria-label={`Biglietto — ${data.titolo}`}
    >
      {/* Header band — perforazione superiore */}
      <PerforazioniOrizzontali position="top" />

      {/* "INGRESSO" verticale */}
      <span
        aria-hidden
        className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[9px] uppercase-tracked text-rosso-base/70 tracking-[0.3em] font-semibold whitespace-nowrap pointer-events-none"
      >
        INGRESSO
      </span>

      {/* TOP HALF — titolo + meta */}
      <div className="relative flex-1 flex flex-col px-6 pt-9 pb-3">
        <div className="flex items-center gap-2 text-rosso-base">
          <TicketIcon className="h-3.5 w-3.5" aria-hidden />
          <span className="uppercase-tracked text-caption tracking-[0.2em] font-semibold">
            Biglietto
          </span>
        </div>

        <h3
          className="mt-5 font-display text-nero-base leading-[1.1] text-balance line-clamp-4"
          style={{
            fontSize: "clamp(1.4rem, 2.6vw, 1.7rem)",
            letterSpacing: "0.01em",
          }}
        >
          {data.titolo}
        </h3>

        {data.sottotitolo && (
          <p className="mt-2 text-body-s text-nero-base/70 italic line-clamp-2">
            {data.sottotitolo}
          </p>
        )}

        <div className="mt-auto flex items-baseline justify-between text-caption text-nero-base/65 pt-4">
          {data.categoria && (
            <span className="uppercase-tracked font-semibold text-rosso-base">
              {CATEGORIA_LABEL[data.categoria]}
            </span>
          )}
          {data.annoCreazione && (
            <span className="font-display text-rosso-base">
              {data.annoCreazione}
            </span>
          )}
        </div>
      </div>

      {/* DIVISORE perforato */}
      <div className="relative h-6 shrink-0">
        <span
          aria-hidden
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-nero-soft border-[1.5px] border-rosso-base"
        />
        <span
          aria-hidden
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-nero-soft border-[1.5px] border-rosso-base"
        />
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="flex-1 h-px border-t border-dashed border-rosso-base/70" />
          <Stella5Punte size={12} className="text-rosso-base shrink-0" />
          <span className="flex-1 h-px border-t border-dashed border-rosso-base/70" />
        </div>
      </div>

      {/* BOTTOM HALF — CTA con reveal */}
      <div className="relative flex flex-col px-6 pt-4 pb-5 shrink-0">
        <div className="min-h-[110px] flex flex-col">
          {!revealed ? (
            <button
              type="button"
              onClick={reveal}
              onKeyDown={handleKey}
              className={cn(
                "biglietto-cta inline-flex items-center justify-center w-full h-12 px-4",
                "bg-rosso-base text-crema-base font-semibold uppercase-tracked text-body-s rounded-md",
                "transition-all duration-base hover:bg-rosso-hover hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-rosso-hover focus-visible:outline-offset-2"
              )}
              aria-expanded={false}
              aria-label={`${ctaLabel} per ${data.titolo}`}
            >
              {ctaLabel} →
            </button>
          ) : (
            <div className="biglietto-cta-reveal animate-biglietto-reveal">
              <BigliettoCtaContent
                modalita={modalita}
                data={data}
                onClose={reset}
              />
            </div>
          )}
        </div>

        {data.prenotazione?.noteAggiuntive && (
          <p className="mt-3 text-caption text-nero-base/65 text-center leading-snug italic">
            {data.prenotazione.noteAggiuntive}
          </p>
        )}
      </div>

      <PerforazioniOrizzontali position="bottom" />

      <div className="absolute bottom-3 right-3 opacity-25 pointer-events-none">
        <Stella5Punte size={14} className="text-rosso-base" />
      </div>
    </article>
  );
}

function BigliettoCtaContent({
  modalita,
  data,
  onClose,
}: {
  modalita: ModalitaPrenotazione;
  data: BigliettoSpettacoloData;
  onClose: () => void;
}) {
  const tel = data.contatti?.telefono;
  const email = data.contatti?.email;
  const subject = encodeURIComponent(`Prenotazione ${data.titolo}`);
  const qrCodeUrl =
    data.prenotazione?.qrCode?.asset?._ref &&
    urlFor(data.prenotazione.qrCode as Parameters<typeof urlFor>[0])
      .width(360)
      .height(360)
      .fit("max")
      .url();

  const backBtn = (
    <button
      type="button"
      onClick={onClose}
      className="mt-3 inline-flex items-center justify-center gap-1.5 text-caption uppercase-tracked text-nero-base/55 hover:text-rosso-base transition-colors w-full"
      aria-label="Torna al fronte del biglietto"
    >
      <ArrowLeft className="h-3 w-3" aria-hidden />
      <span>Indietro</span>
    </button>
  );

  // QR code prevale sempre se configurato (Vera può attivarlo solo quando ha il QR pronto)
  if (qrCodeUrl) {
    return (
      <>
        <div className="flex flex-col items-center">
          <div className="relative w-[110px] h-[110px] bg-white rounded-md p-1.5 shadow-sm">
            <Image
              src={qrCodeUrl}
              alt={`QR code biglietto ${data.titolo}`}
              fill
              sizes="110px"
              className="object-contain"
            />
          </div>
          <p className="mt-2 text-caption text-nero-base/65 text-center">
            Inquadra per acquistare
          </p>
        </div>
        {backBtn}
      </>
    );
  }

  if (modalita === "linkEsterno" && data.prenotazione?.urlBiglietti) {
    return (
      <>
        <a
          href={data.prenotazione.urlBiglietti}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center gap-2 w-full h-12 px-4 bg-nero-base text-crema-base font-semibold uppercase-tracked text-body-s rounded-md hover:bg-rosso-base transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          <span>Apri biglietteria</span>
        </a>
        {backBtn}
      </>
    );
  }

  if (modalita === "emailTelefono") {
    return (
      <>
        <div className="flex flex-col gap-2">
          {tel && (
            <a
              href={`tel:${pulisciTel(tel)}`}
              className="inline-flex items-center justify-center gap-2 w-full h-11 px-4 bg-rosso-base text-crema-base font-semibold uppercase-tracked text-body-s rounded-md hover:bg-rosso-hover transition-colors"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              <span>{tel}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}?subject=${subject}`}
              className="inline-flex items-center justify-center gap-2 w-full h-11 px-4 bg-transparent border border-rosso-base text-rosso-base font-semibold uppercase-tracked text-body-s rounded-md hover:bg-rosso-muted transition-colors"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden />
              <span>Scrivi</span>
            </a>
          )}
          {!tel && !email && (
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center w-full h-11 px-4 bg-rosso-base text-crema-base font-semibold uppercase-tracked text-body-s rounded-md hover:bg-rosso-hover transition-colors"
            >
              Vai ai contatti
            </Link>
          )}
        </div>
        {backBtn}
      </>
    );
  }

  if (modalita === "ingressoLibero") {
    return (
      <>
        <div className="flex flex-col items-center text-center px-2">
          <p className="font-display text-h4 text-rosso-base leading-tight">
            Ingresso libero
          </p>
          <p className="mt-2 text-caption text-nero-base/65">
            Presentati direttamente al luogo dello spettacolo.
          </p>
        </div>
        {backBtn}
      </>
    );
  }

  if (modalita === "botteghino") {
    return (
      <>
        <div className="flex flex-col items-center text-center px-2">
          <p className="font-display text-h4 text-nero-base leading-tight">
            Biglietto al teatro
          </p>
          <p className="mt-2 text-caption text-nero-base/65">
            Acquista il biglietto direttamente al botteghino del teatro.
          </p>
        </div>
        {backBtn}
      </>
    );
  }

  // richiestaContatto (default)
  return (
    <>
      <Link
        href="/contatti"
        className="inline-flex items-center justify-center gap-2 w-full h-12 px-4 bg-rosso-base text-crema-base font-semibold uppercase-tracked text-body-s rounded-md hover:bg-rosso-hover transition-colors"
      >
        <Mail className="h-3.5 w-3.5" aria-hidden />
        <span>Scrivici</span>
      </Link>
      <p className="mt-3 text-caption text-nero-base/65 text-center leading-snug">
        Le modalità di prenotazione cambiano in base al teatro ospitante.
      </p>
      {backBtn}
    </>
  );
}

function PerforazioniOrizzontali({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute left-4 right-4 flex justify-between items-center pointer-events-none",
        position === "top" ? "top-2.5" : "bottom-2.5"
      )}
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-rosso-base/30"
        />
      ))}
    </div>
  );
}

export default BigliettoSpettacolo;
