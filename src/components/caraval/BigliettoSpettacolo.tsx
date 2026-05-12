"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { Phone, ArrowLeft } from "lucide-react";
import { Stella5Punte } from "@/components/decorative/Stella5Punte";
import { cn } from "@/lib/cn";

export type BigliettoSpettacoloProps = {
  /** Numero di telefono cliccabile sul retro. */
  telefono?: string;
  /** Link destinazione del CTA principale sul fronte. Default /contatti. */
  contattiHref?: string;
};

function pulisciTel(tel?: string) {
  return tel ? tel.replace(/\s+/g, "") : "";
}

export function BigliettoSpettacolo({
  telefono,
  contattiHref = "/contatti",
}: BigliettoSpettacoloProps) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((f) => !f);

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className="biglietto-container mx-auto w-full max-w-[320px]"
      style={{ perspective: "1500px" }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? "Biglietto, mostra fronte"
            : "Biglietto, mostra retro con telefono"
        }
        onClick={toggle}
        onKeyDown={handleKey}
        className={cn(
          "biglietto relative w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-rosso-hover focus-visible:outline-offset-4",
          flipped && "is-flipped"
        )}
        style={{
          aspectRatio: "2 / 3",
          transformStyle: "preserve-3d",
          transition:
            "transform 800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONTE */}
        <Faccia color="fronte">
          <p className="uppercase-tracked text-caption text-rosso-base">
            Prenotazione
          </p>
          <h3
            className="mt-4 font-display text-h3 text-nero-base leading-tight text-balance"
            style={{ letterSpacing: "0.01em" }}
          >
            Vuoi vedere questo spettacolo?
          </h3>
          <p className="mt-3 text-body-s text-nero-base/75 leading-relaxed">
            Le modalità di prenotazione cambiano in base al teatro ospitante.
            Contattaci per info.
          </p>

          <Link
            href={contattiHref}
            onClick={(e) => e.stopPropagation()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 h-11 px-4 bg-rosso-base text-crema-base font-semibold uppercase-tracked text-body-s rounded-md hover:bg-rosso-hover transition-colors"
          >
            Scopri come prenotare →
          </Link>

          <div className="mt-4 flex items-center justify-center gap-2 text-caption text-nero-base/60">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            <span>Clicca per vedere il numero</span>
          </div>
        </Faccia>

        {/* RETRO */}
        <Faccia color="retro">
          <p className="uppercase-tracked text-caption text-rosso-base">
            Chiamaci
          </p>
          {telefono ? (
            <>
              <a
                href={`tel:${pulisciTel(telefono)}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-6 font-display text-nero-base leading-none hover:text-rosso-hover transition-colors"
                style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)" }}
              >
                {telefono}
              </a>
              <p className="mt-4 text-body-s text-nero-base/70">
                Clicca sul numero per chiamare ora.
              </p>
            </>
          ) : (
            <p className="mt-6 text-body text-nero-base/75">
              Numero di telefono non disponibile. Scrivici via email da{" "}
              <Link href={contattiHref} className="underline">
                contatti
              </Link>
              .
            </p>
          )}

          <div className="mt-auto pt-6 flex items-center justify-center gap-2 text-caption text-nero-base/60">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            <span>Clicca per tornare al fronte</span>
          </div>
        </Faccia>
      </div>
    </div>
  );
}

function Faccia({
  color,
  children,
}: {
  color: "fronte" | "retro";
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col p-6 md:p-8 rounded-xl border-[1.5px] border-rosso-base/70"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        backgroundColor: "#f5e6d3",
        transform: color === "retro" ? "rotateY(180deg)" : undefined,
        boxShadow:
          "0 14px 32px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(168,23,74,0.08)",
      }}
    >
      {/* Perforazioni laterali (lati corti = top/bottom) */}
      <PerforazioniOrizzontali position="top" />
      <PerforazioniOrizzontali position="bottom" />

      <div className="flex-1 flex flex-col">{children}</div>

      {/* Stella decorativa angolo basso destra */}
      <div className="absolute bottom-3 right-3 opacity-30">
        <Stella5Punte size={12} className="text-rosso-base" />
      </div>
    </div>
  );
}

function PerforazioniOrizzontali({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute left-4 right-4 flex justify-between items-center pointer-events-none",
        position === "top" ? "top-3" : "bottom-3"
      )}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-rosso-base/30"
        />
      ))}
    </div>
  );
}

export default BigliettoSpettacolo;
