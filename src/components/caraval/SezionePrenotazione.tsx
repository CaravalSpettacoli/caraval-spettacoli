import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  TicketSpettacolo,
  type ModalitaPrenotazione,
} from "@/components/caraval/TicketSpettacolo";

export type ReferenteContatto = {
  nome?: string;
  ruoli?: string[];
  referenteAreaTesto?: string;
  telefonoPubblico?: string;
  emailPubblica?: string;
};

export type SezionePrenotazioneSpettacolo = {
  titolo?: string;
  sottotitolo?: string;
  categoria?: "prosa" | "fuoco" | "strada";
  annoCreazione?: number;
  slug?: { current?: string };
  prenotazione?: {
    modalita?: ModalitaPrenotazione;
    urlBiglietti?: string;
    etichettaCustom?: string;
    noteAggiuntive?: string;
  };
};

function pulisciTel(tel?: string) {
  return tel ? tel.replace(/\s+/g, "") : "";
}

export function SezionePrenotazione({
  spettacolo,
  referente,
  fallbackContatti,
}: {
  spettacolo: SezionePrenotazioneSpettacolo;
  referente?: ReferenteContatto | null;
  fallbackContatti?: { email?: string; telefono?: string } | null;
}) {
  const slug = spettacolo.slug?.current ?? "spettacolo";
  const titolo = spettacolo.titolo ?? "Spettacolo";

  const contattiTicket = {
    email: referente?.emailPubblica ?? fallbackContatti?.email,
    telefono: referente?.telefonoPubblico ?? fallbackContatti?.telefono,
  };

  const haReferente = !!(
    referente?.nome ||
    referente?.telefonoPubblico ||
    referente?.emailPubblica
  );

  return (
    <Section background="nero-soft" id="prenotazione">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
          <div className="mx-auto lg:mx-0">
            <TicketSpettacolo
              titolo={titolo}
              sottotitolo={spettacolo.sottotitolo}
              categoria={spettacolo.categoria}
              anno={spettacolo.annoCreazione}
              slug={slug}
              prenotazione={spettacolo.prenotazione}
              contattiPubblici={contattiTicket}
            />
          </div>

          <div className="max-w-[640px]">
            <p className="uppercase-tracked text-caption text-rosso-base">
              Per ingaggiarci
            </p>
            <h2 className="mt-3 font-display text-display-m text-crema-base text-balance">
              Vuoi questo spettacolo nel tuo evento?
            </h2>
            <p className="mt-4 text-body-l text-crema-muted">
              {haReferente
                ? `Per portare questo spettacolo nel tuo teatro, piazza o rievocazione, contatta ${referente?.nome ?? "noi"}${
                    referente?.referenteAreaTesto
                      ? ` — ${referente.referenteAreaTesto.toLowerCase()}.`
                      : "."
                  }`
                : "Per portare questo spettacolo nel tuo teatro, piazza o rievocazione, contattaci."}
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contattiTicket.email && (
                <a
                  href={`mailto:${contattiTicket.email}?subject=${encodeURIComponent(`Ingaggio ${titolo}`)}`}
                  className="group flex flex-col items-start border border-rosso-base/60 hover:border-rosso-base bg-nero-base p-5 transition-colors duration-base"
                >
                  <span className="uppercase-tracked text-caption text-rosso-base">
                    Email
                  </span>
                  <span className="mt-2 font-display text-body-l text-crema-base group-hover:text-crema-bright break-all">
                    {contattiTicket.email}
                  </span>
                </a>
              )}
              {contattiTicket.telefono && (
                <a
                  href={`tel:${pulisciTel(contattiTicket.telefono)}`}
                  className="group flex flex-col items-start border border-rosso-base/60 hover:border-rosso-base bg-nero-base p-5 transition-colors duration-base"
                >
                  <span className="uppercase-tracked text-caption text-rosso-base">
                    Telefono
                  </span>
                  <span className="mt-2 font-display text-body-l text-crema-base group-hover:text-crema-bright">
                    {contattiTicket.telefono}
                  </span>
                </a>
              )}
            </div>

            {referente?.nome && (
              <p className="mt-6 text-body-s text-crema-muted">
                Referente: <span className="text-crema-base">{referente.nome}</span>
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default SezionePrenotazione;
