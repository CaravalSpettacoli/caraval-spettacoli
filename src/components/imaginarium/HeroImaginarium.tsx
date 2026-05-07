import { Container } from "@/components/ui/Container";

export type EdizioneHero = {
  anno?: number;
  titoloEdizione?: string;
  dataInizio?: string;
  dataFine?: string;
  locationPrincipale?: string;
  descrizione?: Array<{ children?: Array<{ text?: string }> }>;
  descrizioneBreve?: string;
};

const MESI = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
];

function formatRangeDate(inizio?: string, fine?: string): string {
  if (!inizio || !fine) return "";
  const a = new Date(inizio);
  const b = new Date(fine);
  const meseA = MESI[a.getMonth()];
  const meseB = MESI[b.getMonth()];
  const annoB = b.getFullYear();
  if (meseA === meseB) {
    return `${a.getDate()} — ${b.getDate()} ${meseB} ${annoB}`;
  }
  return `${a.getDate()} ${meseA} — ${b.getDate()} ${meseB} ${annoB}`;
}

function descrizioneToText(blocks?: EdizioneHero["descrizione"]): string {
  if (!blocks) return "";
  return blocks
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join("\n\n");
}

export function HeroImaginarium({
  edizione,
  titoloOverride,
}: {
  edizione: EdizioneHero | null;
  titoloOverride?: string;
}) {
  if (!edizione) return null;
  const dateRange = formatRangeDate(edizione.dataInizio, edizione.dataFine);
  const descrizione =
    descrizioneToText(edizione.descrizione) ?? edizione.descrizioneBreve;

  return (
    <section
      className="relative bg-crema-base text-nero-base flex items-center"
      style={{ minHeight: "60vh" }}
    >
      <Container>
        <div className="text-center py-16 md:py-20">
          {titoloOverride ? (
            <p className="uppercase-tracked text-caption text-rosso-deep">
              {titoloOverride}
            </p>
          ) : (
            <p className="uppercase-tracked text-caption text-rosso-deep">
              Festival di Teatro Itinerante
            </p>
          )}
          <h1
            className="mt-4 font-display text-rosso-deep leading-none"
            style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)", letterSpacing: "0.02em" }}
          >
            IMAGINARIUM
          </h1>
          {edizione.anno && (
            <p className="mt-3 text-h2 font-display text-rosso-deep/80">
              {edizione.anno}
            </p>
          )}
          {(dateRange || edizione.locationPrincipale) && (
            <p className="mt-4 text-body-l text-nero-base">
              {edizione.locationPrincipale}
              {edizione.locationPrincipale && dateRange && " · "}
              {dateRange}
            </p>
          )}
          {descrizione && (
            <p className="mt-6 max-w-[720px] mx-auto text-body text-nero-base/85 whitespace-pre-line">
              {descrizione}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

export default HeroImaginarium;
