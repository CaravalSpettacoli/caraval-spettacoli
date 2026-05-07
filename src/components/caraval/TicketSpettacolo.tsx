import { TicketWatermark } from "@/components/caraval/ticket-watermark.svg";
import { Stella5Punte } from "@/components/decorative/Stella5Punte";
import { cn } from "@/lib/cn";

export type ModalitaPrenotazione =
  | "linkEsterno"
  | "emailTelefono"
  | "ingressoLibero"
  | "botteghino"
  | "richiestaContatto";

export type TicketSpettacoloProps = {
  titolo: string;
  sottotitolo?: string;
  categoria?: "prosa" | "fuoco" | "strada";
  anno?: number;
  slug: string;
  prenotazione?: {
    modalita?: ModalitaPrenotazione;
    urlBiglietti?: string;
    etichettaCustom?: string;
    noteAggiuntive?: string;
  };
  contattiPubblici?: { email?: string; telefono?: string };
  ancoraPrenotazione?: string;
};

const CATEGORIA_LABEL: Record<NonNullable<TicketSpettacoloProps["categoria"]>, string> = {
  prosa: "PROSA",
  fuoco: "FUOCO",
  strada: "STRADA",
};

const CATEGORIA_COLOR: Record<NonNullable<TicketSpettacoloProps["categoria"]>, string> = {
  prosa: "text-rosso-hover",
  fuoco: "text-amber-400",
  strada: "text-crema-base",
};

function defaultEtichetta(modalita?: ModalitaPrenotazione): string {
  switch (modalita) {
    case "linkEsterno":
      return "Vai ai biglietti";
    case "emailTelefono":
      return "Prenota";
    case "ingressoLibero":
      return "Ingresso libero";
    case "botteghino":
      return "Biglietto al teatro";
    default:
      return "Per ingaggiarci";
  }
}

function pulisciTel(tel?: string) {
  return tel ? tel.replace(/\s+/g, "") : "";
}

function CtaArea({
  titolo,
  prenotazione,
  contattiPubblici,
  ancora,
}: {
  titolo: string;
  prenotazione?: TicketSpettacoloProps["prenotazione"];
  contattiPubblici?: TicketSpettacoloProps["contattiPubblici"];
  ancora: string;
}) {
  const modalita: ModalitaPrenotazione =
    prenotazione?.modalita ?? "richiestaContatto";
  const etichetta = prenotazione?.etichettaCustom ?? defaultEtichetta(modalita);

  const baseBtn =
    "inline-flex items-center justify-center w-full h-11 px-4 rounded-md text-body-s font-semibold uppercase-tracked transition-all duration-base active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-rosso-hover focus-visible:outline-offset-2";

  if (modalita === "linkEsterno" && prenotazione?.urlBiglietti) {
    return (
      <a
        href={prenotazione.urlBiglietti}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(baseBtn, "bg-rosso-base text-crema-base hover:bg-rosso-hover")}
      >
        {etichetta}
      </a>
    );
  }

  if (modalita === "emailTelefono") {
    const subject = encodeURIComponent(`Prenotazione ${titolo}`);
    return (
      <div className="grid grid-cols-2 gap-2">
        {contattiPubblici?.email && (
          <a
            href={`mailto:${contattiPubblici.email}?subject=${subject}`}
            className={cn(
              baseBtn,
              "bg-rosso-base text-crema-base hover:bg-rosso-hover"
            )}
          >
            Email
          </a>
        )}
        {contattiPubblici?.telefono && (
          <a
            href={`tel:${pulisciTel(contattiPubblici.telefono)}`}
            className={cn(
              baseBtn,
              "bg-transparent border border-rosso-base text-crema-base hover:bg-rosso-base"
            )}
          >
            Chiama
          </a>
        )}
      </div>
    );
  }

  if (modalita === "ingressoLibero") {
    return (
      <div className="inline-flex items-center justify-center w-full h-11 px-4 rounded-md border border-amber-400/60 bg-amber-400/10 text-amber-200 font-semibold uppercase-tracked text-body-s">
        {etichetta}
      </div>
    );
  }

  if (modalita === "botteghino") {
    return (
      <div className="inline-flex items-center justify-center w-full h-11 px-4 rounded-md border border-crema-faint text-crema-base font-semibold uppercase-tracked text-body-s">
        {etichetta}
      </div>
    );
  }

  // richiestaContatto (default) → ancora interna
  return (
    <a
      href={ancora}
      className={cn(baseBtn, "bg-rosso-base text-crema-base hover:bg-rosso-hover")}
    >
      {etichetta}
    </a>
  );
}

export function TicketSpettacolo({
  titolo,
  sottotitolo,
  categoria,
  anno,
  slug,
  prenotazione,
  contattiPubblici,
  ancoraPrenotazione = "#prenotazione",
}: TicketSpettacoloProps) {
  return (
    <article
      className={cn(
        "ticket-spettacolo relative max-w-[280px] w-full mx-auto bg-nero-deep border-[1.5px] border-rosso-base rounded-xl overflow-hidden",
        "transition-all duration-base hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(168,23,74,0.22)]",
        "flex flex-col"
      )}
      style={{ aspectRatio: "2 / 5" }}
      aria-label={`Ticket — ${titolo}`}
    >
      <TicketWatermark />

      {/* "INGRESSO" verticale */}
      <span
        aria-hidden
        className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[9px] uppercase-tracked text-rosso-base/80 tracking-[0.3em] font-semibold whitespace-nowrap"
        style={{ transformOrigin: "left center", left: "0.4rem" }}
      >
        INGRESSO
      </span>

      {/* TOP HALF */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-8 pb-4">
        <h3
          className="font-display text-h4 md:text-h3 text-crema-base leading-tight line-clamp-3"
          style={{ letterSpacing: "0.01em" }}
        >
          {titolo}
        </h3>
        {sottotitolo && (
          <p className="mt-2 text-body-s text-crema-muted italic line-clamp-2">
            {sottotitolo}
          </p>
        )}
      </div>

      {/* DIVISORE */}
      <div className="relative h-6">
        {/* perforazioni laterali (nasconde con bg del wrapper esterno) */}
        <span
          aria-hidden
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-nero-base border-[1.5px] border-rosso-base"
        />
        <span
          aria-hidden
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-nero-base border-[1.5px] border-rosso-base"
        />
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="flex-1 h-px border-t border-dashed border-rosso-base/70" />
          <Stella5Punte size={12} className="text-rosso-base shrink-0" />
          <span className="flex-1 h-px border-t border-dashed border-rosso-base/70" />
        </div>
      </div>

      {/* BOTTOM HALF */}
      <div className="relative flex-1 flex flex-col px-6 pb-5 pt-4">
        <div className="flex items-baseline justify-between mb-4">
          {categoria && (
            <span
              className={cn(
                "uppercase-tracked text-caption font-semibold",
                CATEGORIA_COLOR[categoria]
              )}
            >
              {CATEGORIA_LABEL[categoria]}
            </span>
          )}
          {anno && (
            <span className="font-display text-body text-crema-muted">
              {anno}
            </span>
          )}
        </div>

        <div className="mt-auto">
          <CtaArea
            titolo={titolo}
            prenotazione={prenotazione}
            contattiPubblici={contattiPubblici}
            ancora={ancoraPrenotazione}
          />
          {prenotazione?.noteAggiuntive && (
            <p className="mt-3 text-caption text-crema-muted text-center leading-snug">
              {prenotazione.noteAggiuntive}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-crema-faint uppercase-tracked">
            <span>N° SERIE</span>
            <span>{slug.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TicketSpettacolo;
