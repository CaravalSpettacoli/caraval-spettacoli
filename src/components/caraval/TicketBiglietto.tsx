"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { Stella5Punte } from "@/components/decorative/Stella5Punte";
import { MascheraTeatrale } from "@/components/decorative/MascheraTeatrale";

const MESI_BREVI = [
  "GEN", "FEB", "MAR", "APR", "MAG", "GIU",
  "LUG", "AGO", "SET", "OTT", "NOV", "DIC",
];

const MESI_ESTESI = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

export type TicketStyle = "A" | "B" | "C";

export interface TicketBigliettoProps {
  data: Date | string;
  titolo: string;
  citta?: string;
  struttura?: string;
  prezzo?: string;
  urlBiglietti: string;
  numeroSeriale?: string;
  variant?: "default" | "compact";
  /** A=manifesto vintage italiano, B=art deco puro, C=mix (default) */
  style?: TicketStyle;
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

/* ----------------------------- DECORAZIONI ----------------------------- */

function CornerFloral({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <path d="M2 2 L10 2 M2 2 L2 10" strokeLinecap="round" />
      <path d="M5 5 C 7 4, 9 4, 11 5" strokeLinecap="round" />
      <path d="M5 5 C 4 7, 4 9, 5 11" strokeLinecap="round" />
      <circle cx="11" cy="5" r="0.9" fill="currentColor" />
      <circle cx="5" cy="11" r="0.9" fill="currentColor" />
      <path d="M8 8 l1 0 m-1 0 a1 1 0 1 1 -0.001 0" />
    </svg>
  );
}

function CornerArtDeco({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <line x1="2" y1="2" x2="20" y2="2" />
      <line x1="2" y1="2" x2="2" y2="20" />
      <line x1="2" y1="6" x2="16" y2="6" />
      <line x1="6" y1="2" x2="6" y2="16" />
      <line x1="2" y1="10" x2="12" y2="10" />
      <line x1="10" y1="2" x2="10" y2="12" />
      {/* Ventaglio agli angoli */}
      <line x1="14" y1="14" x2="22" y2="6" />
      <line x1="14" y1="14" x2="20" y2="4" />
      <line x1="14" y1="14" x2="16" y2="2" />
      <line x1="14" y1="14" x2="6" y2="22" />
      <line x1="14" y1="14" x2="4" y2="20" />
      <line x1="14" y1="14" x2="2" y2="16" />
    </svg>
  );
}

function CornerMix({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <path d="M2 2 L14 2 L14 4 L4 4 L4 14 L2 14 Z" fill="currentColor" />
      <path d="M6 6 L18 6" />
      <path d="M6 6 L6 18" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function DividerFloralVertical() {
  return (
    <svg
      width="2"
      height="100"
      viewBox="0 0 2 100"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      <line
        x1="1"
        y1="0"
        x2="1"
        y2="100"
        stroke="currentColor"
        strokeDasharray="4 3"
        strokeWidth="1"
      />
      <circle cx="1" cy="14" r="2" fill="currentColor" />
      <circle cx="1" cy="50" r="2.5" fill="currentColor" />
      <circle cx="1" cy="86" r="2" fill="currentColor" />
    </svg>
  );
}

function DividerChevronVertical() {
  return (
    <svg
      width="10"
      height="100"
      viewBox="0 0 10 100"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <polyline
          key={i}
          points={`0,${4 + i * 12} 5,${10 + i * 12} 0,${16 + i * 12}`}
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      ))}
    </svg>
  );
}

function DividerStarVertical() {
  return (
    <svg
      width="14"
      height="100"
      viewBox="0 0 14 100"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      <line
        x1="7"
        y1="0"
        x2="7"
        y2="40"
        stroke="currentColor"
        strokeDasharray="3 3"
        strokeWidth="1"
      />
      <polygon
        points="7,42 8.6,49 13,49 9.5,52 11,58 7,54.5 3,58 4.5,52 1,49 5.4,49"
        fill="currentColor"
      />
      <line
        x1="7"
        y1="60"
        x2="7"
        y2="100"
        stroke="currentColor"
        strokeDasharray="3 3"
        strokeWidth="1"
      />
    </svg>
  );
}

/* ----------------------------- VARIANT COMPACT ----------------------------- */

function CompactTicket(props: TicketBigliettoProps) {
  const { titolo, urlBiglietti, className } = props;
  const parsed = toDate(props.data);
  const giorno = parsed ? parsed.getDate() : null;
  const mese = parsed ? MESI_BREVI[parsed.getMonth()] : null;
  const luogo = [props.citta, props.struttura].filter(Boolean).join(" · ");
  return (
    <a
      href={urlBiglietti}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Acquista biglietto per ${titolo}`}
      className={cn(
        "group relative block w-full max-w-[420px] bg-crema-base text-nero-base",
        "border-[3px] border-rosso-base rounded-sm shadow-md",
        "transition-all duration-slow ease-bounce-soft",
        "hover:scale-[1.02] hover:shadow-glow-rosso-lg hover:-rotate-1",
        "active:scale-[0.98] active:rotate-0",
        "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:rotate-0",
        className,
      )}
    >
      <div className="absolute inset-1.5 border border-rosso-base/40 rounded-sm pointer-events-none" />
      <div className="flex flex-col items-center gap-1 p-4 min-h-[120px] justify-center">
        <span className="font-display text-[40px] leading-none text-nero-base">
          {giorno ?? ""}
        </span>
        <span className="text-[11px] tracking-[0.15em] uppercase text-rosso-base font-semibold">
          {mese ?? "TBD"}
        </span>
        <h3 className="mt-2 font-sans font-bold text-[16px] text-center leading-tight">
          {titolo}
        </h3>
        {luogo && (
          <p className="text-[12px] text-nero-base/70 text-center">{luogo}</p>
        )}
        {props.prezzo && (
          <p className="mt-1 text-[10px] tracking-[0.15em] uppercase text-rosso-base font-semibold">
            {props.prezzo}
          </p>
        )}
      </div>
    </a>
  );
}

/* ----------------------------- VARIANT DEFAULT ----------------------------- */

export function TicketBiglietto(props: TicketBigliettoProps) {
  const {
    data,
    titolo,
    citta,
    struttura,
    prezzo,
    urlBiglietti,
    numeroSeriale,
    variant = "default",
    style = "C",
    className,
  } = props;

  const [isTearing, setIsTearing] = useState(false);

  if (variant === "compact") return <CompactTicket {...props} />;

  const parsed = toDate(data);
  const giorno = parsed ? parsed.getDate() : null;
  const mese = parsed ? MESI_BREVI[parsed.getMonth()] : null;
  const meseEsteso = parsed ? MESI_ESTESI[parsed.getMonth()] : null;
  const seriale =
    numeroSeriale ?? hashSeriale(`${titolo}-${parsed?.toISOString() ?? ""}`);
  const luogo = [citta, struttura].filter(Boolean).join(" · ");
  const ariaLabel = `Acquista biglietto per ${titolo}${
    parsed && giorno && meseEsteso ? ` il ${giorno} ${meseEsteso}` : ""
  }`;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // redirect immediato
    }
    e.preventDefault();
    setIsTearing(true);
    window.setTimeout(() => {
      window.open(urlBiglietti, "_blank", "noopener,noreferrer");
      setIsTearing(false);
    }, 380);
  };

  /* ---------- Stili specifici ---------- */
  const styleConfig: Record<
    TicketStyle,
    {
      shellClass: string;
      shellStyle?: CSSProperties;
      ingressoFontFamily: string;
      ingressoFontStyle?: "italic" | "normal";
      ingressoUseDisplay?: boolean;
      titoloFontFamily?: string;
      luogoFontFamily?: string;
      cornerColor: string;
      Corner: (p: { rotate?: number }) => JSX.Element;
      DividerVertical: () => JSX.Element;
      serialePosition: "top" | "bottom";
      serialeClass: string;
      topOrnament?: JSX.Element;
    }
  > = {
    A: {
      shellClass: "border-[3px] border-rosso-base",
      shellStyle: {
        backgroundImage:
          "radial-gradient(ellipse at top left, rgba(168,23,74,0.06), transparent 60%), radial-gradient(ellipse at bottom right, rgba(0,0,0,0.05), transparent 70%), var(--ticket-paper, #f5e6d3)",
      },
      ingressoFontFamily: "Georgia, 'Times New Roman', serif",
      ingressoFontStyle: "italic",
      titoloFontFamily: "Georgia, 'Times New Roman', serif",
      luogoFontFamily: "Georgia, 'Times New Roman', serif",
      cornerColor: "text-rosso-base",
      Corner: CornerFloral,
      DividerVertical: DividerFloralVertical,
      serialePosition: "bottom",
      serialeClass:
        "font-mono text-[10px] tracking-[0.18em] text-rosso-base/70 px-1.5 py-0.5 border border-rosso-base/40 rounded-[1px]",
    },
    B: {
      shellClass:
        "border-[2px] border-rosso-base outline outline-1 outline-offset-[3px] outline-rosso-base/60",
      ingressoFontFamily: "var(--font-stonehead), serif",
      ingressoUseDisplay: true,
      cornerColor: "text-rosso-base",
      Corner: CornerArtDeco,
      DividerVertical: DividerChevronVertical,
      serialePosition: "top",
      serialeClass:
        "font-mono text-[9px] tracking-[0.18em] text-nero-base/80 bg-rosso-muted px-1.5 py-0.5",
    },
    C: {
      shellClass:
        "border-[3px] border-rosso-base shadow-[inset_0_0_0_1px_rgba(168,23,74,0.4)]",
      shellStyle: {
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(168,23,74,0.025) 0 1px, transparent 1px 3px)",
      },
      ingressoFontFamily: "var(--font-inter), system-ui, sans-serif",
      cornerColor: "text-rosso-base",
      Corner: CornerMix,
      DividerVertical: DividerStarVertical,
      serialePosition: "bottom",
      serialeClass:
        "font-mono text-[9px] tracking-[0.15em] text-rosso-base/60",
      topOrnament: (
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-rosso-base z-[2] pointer-events-none">
          <MascheraTeatrale tipo="commedia" size={18} />
        </div>
      ),
    },
  };

  const cfg = styleConfig[style];
  const Corner = cfg.Corner;
  const DividerV = cfg.DividerVertical;

  return (
    <a
      href={urlBiglietti}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={cn(
        "group relative block w-full max-w-[480px] h-40 text-nero-base bg-crema-base rounded-sm",
        "shadow-[0_4px_16px_rgba(0,0,0,0.15)]",
        "transition-all duration-slow",
        "[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
        "hover:-translate-y-2 hover:scale-[1.02] hover:[transform:translateY(-8px)_scale(1.02)_rotate(-1deg)]",
        "hover:shadow-[0_16px_48px_rgba(168,23,74,0.3)]",
        "active:scale-[0.98]",
        "focus-visible:outline-rosso-base focus-visible:[outline-offset:4px]",
        "motion-reduce:transition-none motion-reduce:transform-none motion-reduce:hover:transform-none",
        cfg.shellClass,
        className,
      )}
      style={cfg.shellStyle}
    >
      {/* Ornamenti angoli */}
      <span className={cn("absolute top-1 left-1 z-[1]", cfg.cornerColor)} aria-hidden="true">
        <Corner rotate={0} />
      </span>
      <span className={cn("absolute top-1 right-1 z-[1]", cfg.cornerColor)} aria-hidden="true">
        <Corner rotate={90} />
      </span>
      <span className={cn("absolute bottom-1 right-1 z-[1]", cfg.cornerColor)} aria-hidden="true">
        <Corner rotate={180} />
      </span>
      <span className={cn("absolute bottom-1 left-1 z-[1]", cfg.cornerColor)} aria-hidden="true">
        <Corner rotate={270} />
      </span>
      {cfg.topOrnament}

      {/* Cornice interna sottile per stile A/C */}
      {style !== "B" && (
        <div className="absolute inset-1.5 border border-rosso-base/40 rounded-sm pointer-events-none" />
      )}

      {/* Seriale top per stile B */}
      {cfg.serialePosition === "top" && (
        <span
          className={cn("absolute top-3 right-10 z-[2]", cfg.serialeClass)}
          aria-hidden="true"
        >
          N° {seriale}
        </span>
      )}

      <div className="relative flex h-full">
        {/* Sezione laterale "INGRESSO" ~25% */}
        <div
          className={cn(
            "relative flex flex-col items-center justify-center w-[25%] shrink-0 transition-colors duration-300",
            "group-hover:bg-rosso-muted",
            isTearing &&
              "[transform:translateX(-20px)_rotate(-3deg)] opacity-50 transition-all",
          )}
          aria-hidden="true"
          style={{
            transitionProperty: isTearing ? "transform, opacity" : undefined,
            transitionDuration: isTearing ? "380ms" : undefined,
          }}
        >
          {style === "A" && (
            <Stella5Punte size={10} className="text-rosso-base mb-3 opacity-70" />
          )}
          <span
            className={cn(
              "text-rosso-base",
              cfg.ingressoUseDisplay && "font-feature-settings-stonehead",
            )}
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: cfg.ingressoUseDisplay ? "16px" : "11px",
              letterSpacing: cfg.ingressoUseDisplay ? "0.08em" : "0.22em",
              textTransform: "uppercase",
              fontFamily: cfg.ingressoFontFamily,
              fontStyle: cfg.ingressoFontStyle ?? "normal",
              fontWeight: cfg.ingressoUseDisplay ? 400 : 700,
              fontFeatureSettings: cfg.ingressoUseDisplay
                ? '"liga" 0, "dlig" 0, "salt" 0, "ss01" 0, "ss02" 0, "ss03" 0, "ss04" 0, "ss05" 0, "calt" 0, "swsh" 0, "ornm" 0'
                : undefined,
            }}
          >
            INGRESSO
          </span>
          {/* Divisore verticale */}
          <span
            className="absolute top-2 bottom-2 right-0 text-rosso-base/70 translate-x-[1px]"
            aria-hidden="true"
          >
            <DividerV />
          </span>
        </div>

        {/* Sezione principale ~75% */}
        <div className="flex-1 flex items-stretch px-4 py-3 gap-3 min-w-0">
          {/* Zona data ~30% */}
          <div className="flex flex-col items-center justify-center shrink-0 min-w-[68px]">
            <span
              className="font-display text-[56px] leading-none text-nero-base transition-transform duration-300 ease-bounce-soft group-hover:-translate-y-1"
              aria-hidden="true"
            >
              {giorno ?? ""}
            </span>
            <span className="mt-1 text-[12px] tracking-[0.15em] uppercase text-rosso-base font-semibold">
              {mese ?? "TBD"}
            </span>
          </div>

          {/* Zona info ~50% */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <h3
              className={cn(
                "leading-tight truncate",
                style === "A" ? "text-[18px] font-semibold" : "text-[18px] font-bold",
              )}
              style={
                cfg.titoloFontFamily
                  ? { fontFamily: cfg.titoloFontFamily }
                  : undefined
              }
            >
              {titolo}
            </h3>
            {luogo && (
              <p
                className={cn(
                  "mt-1 text-[13px] truncate",
                  style === "A" ? "italic text-nero-base/80" : "text-nero-base/70",
                )}
                style={
                  cfg.luogoFontFamily
                    ? { fontFamily: cfg.luogoFontFamily }
                    : undefined
                }
              >
                {luogo}
              </p>
            )}
            {prezzo && (
              <p className="mt-2 text-[11px] tracking-[0.15em] uppercase text-rosso-base font-semibold">
                {prezzo}
              </p>
            )}
          </div>

          {/* Zona azione ~20% */}
          <div className="flex flex-col items-end justify-between shrink-0">
            {cfg.serialePosition === "bottom" ? (
              <span aria-hidden="true" className="opacity-0">
                {/* placeholder per allineare la freccia in alto */}
                .
              </span>
            ) : (
              <span aria-hidden="true" className="opacity-0">
                .
              </span>
            )}
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-rosso-base transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path
                d="M5 11 L17 11 M11 5 L17 11 L11 17"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cfg.serialePosition === "bottom" && (
              <span className={cfg.serialeClass} aria-hidden="true">
                N° {seriale}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

export default TicketBiglietto;
