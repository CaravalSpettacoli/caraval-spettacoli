import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BigliettoSpettacolo } from "@/components/caraval/BigliettoSpettacolo";
import type { ModalitaPrenotazione } from "@/components/caraval/TicketSpettacolo";

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

export function SezionePrenotazione({
  spettacolo,
  referente,
  fallbackContatti,
}: {
  spettacolo: SezionePrenotazioneSpettacolo;
  referente?: ReferenteContatto | null;
  fallbackContatti?: { email?: string; telefono?: string } | null;
}) {
  const telefono =
    referente?.telefonoPubblico ?? fallbackContatti?.telefono ?? undefined;
  const titolo = spettacolo.titolo ?? "Spettacolo";

  return (
    <Section background="nero-soft" id="prenotazione">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-center">
          <BigliettoSpettacolo telefono={telefono} />

          <div className="max-w-[560px]">
            <p className="uppercase-tracked text-caption text-rosso-base">
              Per vedere {titolo}
            </p>
            <h2 className="mt-3 font-display text-display-m text-crema-base text-balance leading-tight">
              Contattaci per le date
            </h2>
            <p className="mt-4 text-body-l text-crema-muted">
              Le modalità di prenotazione e ingresso cambiano in base al teatro
              o all&apos;ente ospitante. Clicca il biglietto per vedere il numero
              o scrivici via email — ti rispondiamo entro 24 ore.
            </p>
            {spettacolo.prenotazione?.noteAggiuntive && (
              <p className="mt-4 text-body-s text-crema-muted italic">
                {spettacolo.prenotazione.noteAggiuntive}
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default SezionePrenotazione;
