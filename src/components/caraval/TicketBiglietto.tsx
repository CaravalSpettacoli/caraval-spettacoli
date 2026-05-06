import { cn } from "@/lib/cn";
import { Stella5Punte } from "@/components/decorative/Stella5Punte";

const MESI_BREVI = [
  "GEN", "FEB", "MAR", "APR", "MAG", "GIU",
  "LUG", "AGO", "SET", "OTT", "NOV", "DIC",
];

const MESI_ESTESI = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

export interface TicketBigliettoProps {
  data: Date | string;
  titolo: string;
  citta?: string;
  struttura?: string;
  prezzo?: string;
  urlBiglietti: string;
  numeroSeriale?: string;
  variant?: "default" | "compact";
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
  return String(h % 9000 + 1000).padStart(4, "0");
}

export function TicketBiglietto({
  data,
  titolo,
  citta,
  struttura,
  prezzo,
  urlBiglietti,
  numeroSeriale,
  variant = "default",
  className,
}: TicketBigliettoProps) {
  const parsed = toDate(data);
  const giorno = parsed ? parsed.getDate() : null;
  const mese = parsed ? MESI_BREVI[parsed.getMonth()] : null;
  const meseEsteso = parsed ? MESI_ESTESI[parsed.getMonth()] : null;
  const seriale =
    numeroSeriale ??
    hashSeriale(`${titolo}-${parsed?.toISOString() ?? ""}`);
  const luogo = [citta, struttura].filter(Boolean).join(" · ");
  const ariaLabel = `Acquista biglietto per ${titolo}${
    parsed && giorno && meseEsteso ? ` il ${giorno} ${meseEsteso}` : ""
  }`;

  if (variant === "compact") {
    return (
      <a
        href={urlBiglietti}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={cn(
          "group relative block w-full max-w-[420px] bg-crema-base text-nero-base",
          "border-[3px] border-rosso-base rounded-sm shadow-md",
          "transition-all duration-300 ease-bounce-soft",
          "hover:scale-[1.02] hover:shadow-glow-rosso-lg hover:-rotate-1",
          "active:scale-[0.98] active:rotate-0",
          className,
        )}
      >
        <div className="absolute inset-1.5 border border-rosso-base/40 rounded-sm pointer-events-none" />
        <div className="flex flex-col items-center gap-1 p-4 min-h-[120px] justify-center">
          <span
            className="font-display text-[40px] leading-none text-nero-base transition-transform duration-300 ease-bounce-soft group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            {giorno ?? ""}
          </span>
          <span className="text-[11px] tracking-[0.15em] uppercase text-rosso-base font-semibold">
            {mese ?? "TBD"}
          </span>
          <h3 className="mt-2 font-sans font-bold text-[16px] text-center leading-tight">
            {titolo}
          </h3>
          {luogo && (
            <p className="text-[12px] text-nero-base/70 text-center">
              {luogo}
            </p>
          )}
          {prezzo && (
            <p className="mt-1 text-[10px] tracking-[0.15em] uppercase text-rosso-base font-semibold">
              {prezzo}
            </p>
          )}
        </div>
      </a>
    );
  }

  return (
    <a
      href={urlBiglietti}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "group relative block w-full max-w-[480px] h-40 bg-crema-base text-nero-base",
        "border-[3px] border-rosso-base rounded-sm shadow-md",
        "transition-all duration-300 ease-bounce-soft",
        "hover:scale-[1.02] hover:shadow-glow-rosso-lg hover:-rotate-1",
        "active:scale-[0.98] active:rotate-0",
        className,
      )}
    >
      {/* Cornice interna sottile per effetto bordo doppio */}
      <div className="absolute inset-1.5 border border-rosso-base/40 rounded-sm pointer-events-none" />

      <div className="relative flex h-full">
        {/* Sezione "matrice" sinistra ~25% */}
        <div
          className="flex flex-col items-center justify-center w-1/4 border-r-2 border-dashed border-rosso-base/70"
          aria-hidden="true"
        >
          <Stella5Punte size={12} className="text-rosso-base mb-3" />
          <span
            className="text-rosso-base font-semibold uppercase"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: "10px",
              letterSpacing: "0.15em",
            }}
          >
            STRAPPA QUI
          </span>
        </div>

        {/* Sezione principale ~75% */}
        <div className="flex-1 flex items-stretch px-4 py-3 gap-3 min-w-0">
          {/* Zona data */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <span
              className="font-display text-[56px] leading-none text-nero-base transition-transform duration-300 ease-bounce-soft group-hover:-translate-y-0.5"
              aria-hidden="true"
            >
              {giorno ?? ""}
            </span>
            <span className="mt-1 text-[12px] tracking-[0.15em] uppercase text-rosso-base font-semibold">
              {mese ?? "TBD"}
            </span>
          </div>

          {/* Zona info */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <h3 className="font-sans font-bold text-[18px] leading-tight truncate">
              {titolo}
            </h3>
            {luogo && (
              <p className="mt-1 text-[13px] text-nero-base/70 truncate">
                {luogo}
              </p>
            )}
            {prezzo && (
              <p className="mt-2 text-[11px] tracking-[0.15em] uppercase text-rosso-base font-semibold">
                {prezzo}
              </p>
            )}
          </div>

          {/* Zona azione */}
          <div className="flex flex-col items-end justify-between shrink-0">
            <span
              className="font-mono text-[9px] text-rosso-base/50"
              aria-hidden="true"
            >
              N {seriale}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-rosso-base transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 10 L15 10 M10 5 L15 10 L10 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

export default TicketBiglietto;
