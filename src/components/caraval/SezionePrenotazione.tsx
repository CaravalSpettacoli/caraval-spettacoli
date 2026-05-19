import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  BigliettoSpettacolo,
  type BigliettoSpettacoloData,
  type ModalitaPrenotazione,
} from "@/components/caraval/BigliettoSpettacolo";

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
    qrCode?: { asset?: { _ref?: string }; alt?: string };
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
  const email =
    referente?.emailPubblica ?? fallbackContatti?.email ?? undefined;
  const titolo = spettacolo.titolo ?? "Spettacolo";
  const modalita = spettacolo.prenotazione?.modalita ?? "richiestaContatto";

  const bigliettoData: BigliettoSpettacoloData = {
    titolo,
    sottotitolo: spettacolo.sottotitolo,
    categoria: spettacolo.categoria,
    annoCreazione: spettacolo.annoCreazione,
    slug: spettacolo.slug?.current,
    prenotazione: spettacolo.prenotazione,
    contatti: { telefono, email },
  };

  const headingForModalita = (() => {
    switch (modalita) {
      case "linkEsterno":
        return "Biglietti online";
      case "emailTelefono":
        return "Scrivici o chiamaci";
      case "ingressoLibero":
        return "Ingresso libero";
      case "botteghino":
        return "Biglietto al teatro";
      default:
        return "Contattaci per le date";
    }
  })();

  const descriptionForModalita = (() => {
    switch (modalita) {
      case "linkEsterno":
        return "I biglietti sono disponibili sul portale ufficiale del teatro ospitante. Tocca il biglietto per andare alla biglietteria online.";
      case "emailTelefono":
        return "Per prenotare scrivici o chiamaci. Tocca il biglietto per vedere il contatto giusto — ti rispondiamo entro 24 ore.";
      case "ingressoLibero":
        return "Per questo spettacolo l'ingresso è libero. Tocca il biglietto per i dettagli su orari e luogo.";
      case "botteghino":
        return "Il biglietto si acquista direttamente al botteghino del teatro. Tocca il biglietto per i riferimenti.";
      default:
        return "Le modalità di prenotazione e ingresso cambiano in base al teatro o all'ente ospitante. Tocca il biglietto per scoprire come muoverti.";
    }
  })();

  return (
    <Section background="nero-soft" id="prenotazione">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-16 items-center">
          <BigliettoSpettacolo data={bigliettoData} />

          <div className="max-w-[560px]">
            <p className="uppercase-tracked text-caption text-rosso-base">
              Per vedere {titolo}
            </p>
            <h2 className="mt-3 font-display text-display-m text-crema-base text-balance leading-tight">
              {headingForModalita}
            </h2>
            <p className="mt-4 text-body-l text-crema-muted">
              {descriptionForModalita}
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
