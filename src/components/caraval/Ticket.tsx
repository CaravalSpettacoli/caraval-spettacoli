"use client";

import { useState, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { TicketWatermark } from "./ticket-watermark.svg";

const MESI_BREVI = [
  "GEN", "FEB", "MAR", "APR", "MAG", "GIU",
  "LUG", "AGO", "SET", "OTT", "NOV", "DIC",
];

const MESI_ESTESI = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

export interface TicketProps {
  data: Date | string;
  titolo: string;
  citta?: string;
  struttura?: string;
  prezzo?: string;
  urlBiglietti: string;
  numeroSeriale?: string;
  className?: string;
}

function toDate(d: Date | string): Date | null {
  const date = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? null : date;
}

function hashSeriale(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return String((h % 9000) + 1000).padStart(4, "0");
}

export function Ticket({
  data,
  titolo,
  citta,
  struttura,
  prezzo,
  urlBiglietti,
  numeroSeriale,
  className,
}: TicketProps) {
  const [tearing, setTearing] = useState(false);
  const date = toDate(data);
  if (!date) return null;

  const day = String(date.getDate()).padStart(2, "0");
  const month = MESI_BREVI[date.getMonth()];
  const monthLong = MESI_ESTESI[date.getMonth()];
  const seriale =
    numeroSeriale ?? hashSeriale(`${titolo}-${date.toISOString()}`);
  const venue = [citta, struttura].filter(Boolean).join(" · ");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || tearing) return;
    e.preventDefault();
    setTearing(true);
    const target = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
    window.setTimeout(() => {
      if (target) window.location.href = target;
    }, 300);
  };

  return (
    <a
      href={urlBiglietti}
      onClick={handleClick}
      aria-label={`Acquista biglietto per ${titolo} il ${day} ${monthLong}`}
      className={cn(
        "ticket group relative block w-full max-w-md",
        "bg-crema-base text-nero-base",
        "border-[1.5px] border-rosso-base rounded-[10px] overflow-hidden",
        "shadow-sm transition-[transform,box-shadow] duration-base ease-cinema",
        "hover:-translate-y-1 hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-rosso-hover",
        className
      )}
    >
      <TicketWatermark />

      {/* Perforazione laterale sinistra: 8 puntini verticali */}
      <span
        aria-hidden="true"
        className="absolute left-[6px] top-1/2 -translate-y-1/2 flex flex-col gap-2"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="block w-[3px] h-[3px] rounded-full bg-rosso-base/80"
          />
        ))}
      </span>

      <div
        className={cn(
          "relative grid items-stretch",
          "grid-cols-[80px_1px_1fr_60px]",
          "min-h-[100px] sm:min-h-[120px]",
          "aspect-[3/1] sm:aspect-auto"
        )}
      >
        {/* Stub sinistra — INGRESSO ruotato + stella */}
        <div
          className={cn(
            "stub relative flex flex-col items-center justify-between",
            "py-3 pl-5 pr-2",
            "transition-[transform,opacity,background-color] duration-300 ease-cinema",
            "group-hover:bg-rosso-muted",
            tearing && "is-tearing"
          )}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-rosso-base"
            aria-hidden="true"
          >
            <path d="M12 2 L14.7 9.3 L22 9.3 L16.1 13.7 L18.3 21 L12 16.5 L5.7 21 L7.9 13.7 L2 9.3 L9.3 9.3 Z" />
          </svg>
          <span
            className="text-rosso-base text-[11px] font-semibold tracking-[0.28em] uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            INGRESSO
          </span>
          <span aria-hidden="true" className="block w-[3px] h-[3px]" />
        </div>

        {/* Divider tratteggiato verticale */}
        <div
          aria-hidden="true"
          className="my-3"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, var(--color-rosso-base) 50%, transparent 50%)",
            backgroundSize: "1px 6px",
            backgroundRepeat: "repeat-y",
          }}
        />

        {/* Colonna principale */}
        <div className="flex flex-col justify-center px-4 sm:px-6 py-3 min-w-0">
          <h3
            className={cn(
              "font-display leading-[1.1] text-nero-base",
              "text-[15px] sm:text-[clamp(18px,2.4vw,24px)]",
              "[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden"
            )}
          >
            {titolo}
          </h3>
          {venue && (
            <p className="mt-1 text-[12px] sm:text-[13px] text-nero-base/70 truncate">
              {venue}
            </p>
          )}
          {prezzo && (
            <p className="mt-1 text-[12px] sm:text-[13px] font-semibold text-rosso-base uppercase tracking-wide">
              {prezzo}
            </p>
          )}
        </div>

        {/* Colonna destra — mese + seriale */}
        <div className="flex flex-col items-center justify-between py-3 pr-3 pl-1">
          <div className="text-center">
            <span className="block text-[10px] font-semibold tracking-[0.18em] text-nero-base/60">
              {day}
            </span>
            <span className="block text-rosso-base font-bold text-[20px] sm:text-[22px] leading-none tracking-wide">
              {month}
            </span>
          </div>
          <span className="font-mono text-[9px] tracking-[0.15em] text-nero-base/55">
            N° {seriale}
          </span>
        </div>
      </div>
    </a>
  );
}

export default Ticket;
