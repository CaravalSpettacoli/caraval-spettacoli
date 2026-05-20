import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  BigliettoSpettacolo,
  type BigliettoSpettacoloData,
  type ModalitaPrenotazione,
  type OpzionePrenotazione,
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
  annoProduzione?: number;
  durataMinuti?: number;
  postiLimitati?: boolean;
  numeroPostiLimitati?: number;
  slug?: { current?: string };
  opzioniPrenotazione?: OpzionePrenotazione[];
  prenotazione?: {
    modalita?: ModalitaPrenotazione;
    urlBiglietti?: string;
    qrCode?: { asset?: { _ref?: string }; alt?: string };
    etichettaCustom?: string;
    noteAggiuntive?: string;
  };
  schedaTecnicaPdf?: {
    asset?: { url?: string; originalFilename?: string };
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
    annoProduzione: spettacolo.annoProduzione,
    durataMinuti: spettacolo.durataMinuti,
    postiLimitati: spettacolo.postiLimitati,
    numeroPostiLimitati: spettacolo.numeroPostiLimitati,
    slug: spettacolo.slug?.current,
    opzioniPrenotazione: spettacolo.opzioniPrenotazione,
    prenotazione: spettacolo.prenotazione,
    contatti: { telefono, email },
  };

  const pdfUrl = spettacolo.schedaTecnicaPdf?.asset?.url;
  const pdfFilename = spettacolo.schedaTecnicaPdf?.asset?.originalFilename;

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
        {/* <1024px (mobile + tablet portrait): stack verticale, biglietto sopra
            e info sotto, tutto centrato. Da lg: 2 colonne (biglietto sx, info dx)
            con allineamento testo a sinistra. Fix_3_Bug_Pre_Golive §2. */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-16 items-center justify-items-center lg:justify-items-stretch text-center lg:text-left">
          <BigliettoSpettacolo data={bigliettoData} />

          <div className="max-w-[560px] mx-auto lg:mx-0">
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
            {pdfUrl && (
              <a
                href={`${pdfUrl}?dl=${encodeURIComponent(pdfFilename ?? `${titolo}-scheda-tecnica.pdf`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 border border-rosso-base text-crema-base hover:bg-rosso-base hover:text-crema-bright transition-all duration-base rounded-md text-body-s font-semibold uppercase-tracked"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Scarica la scheda tecnica (PDF)</span>
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default SezionePrenotazione;
