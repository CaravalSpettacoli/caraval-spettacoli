import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { urlFor } from "@/../sanity/lib/image";
import { paletteToTheme } from "@/lib/theme-system";
import { OndaDecorativa } from "@/components/decorative/OndaDecorativa";

export type SpettacoloImagItem = {
  _id: string;
  titolo?: string;
  dataInizio?: string;
  compagnia?: {
    nome?: string;
    urlSitoCompagnia?: string;
    descrizioneCompagniaBreve?: string;
  };
  linkCompagniaEsterna?: string;
  immagineCover?: { asset?: { _ref?: string }; alt?: string };
  /** Descrizione breve 1-2 righe per card programma (Hotfix 1). */
  descrizioneBreve?: string;
  descrizione?: Array<{ children?: Array<{ text?: string }> }>;
  cast?: string;
  locationSpecifica?: string;
  luogo?: { nome?: string; citta?: string };
};

const MESI = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];
const GIORNI = [
  "domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato",
];

function blocksToText(blocks?: SpettacoloImagItem["descrizione"]): string {
  if (!blocks) return "";
  return blocks
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join("\n\n");
}

function dataParts(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  return {
    giorno: d.getDate(),
    mese: MESI[d.getMonth()],
    settimana: GIORNI[d.getDay()],
    ora: `${d.getHours()}${
      d.getMinutes() === 0 ? "" : `.${d.getMinutes().toString().padStart(2, "0")}`
    }`,
  };
}

function locationLabel(s: SpettacoloImagItem): string | null {
  if (s.locationSpecifica) return s.locationSpecifica;
  const parts = [s.luogo?.nome, s.luogo?.citta].filter(Boolean);
  return parts.length > 0 ? parts.join(" — ") : null;
}

export function ProgrammaCompleto({
  spettacoli,
  heading,
  palette = "imaginarium",
}: {
  spettacoli: SpettacoloImagItem[] | null;
  heading?: string;
  palette?: "imaginarium" | "rosso";
}) {
  // Hotfix 1: entrambe le palette (imaginarium/rosso) ora hanno bg rosso saturo
  // con testi crema. palette="imaginarium" usa #a8174a (rosso brand),
  // palette="rosso" usa #a8174a anche, prima distinte erano crema/rosso.
  const inlineBg = "#a8174a";
  const bg = "text-crema-base";
  const eyebrowCol = "text-crema-base/80";
  const headingCol = "text-crema-bright";
  const dataCol = "text-crema-bright";
  const titoloCol = "text-crema-bright";
  const compagniaCol = "text-crema-base/80";
  const compagniaUnderline =
    "decoration-crema-base/40 hover:text-crema-bright";
  const descrCol = "text-crema-base/85";
  const dlLabelCol = "text-crema-base/75";
  const dlValueCol = "text-crema-bright";
  const fotoBorder = "border-crema-base/20";
  const datasubCol = "text-crema-base/65";

  if (!spettacoli || spettacoli.length === 0) {
    return (
      <section
        data-theme={paletteToTheme[palette]}
        className={bg}
        style={{
          backgroundColor: inlineBg,
          paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))",
        }}
      >
        <Container>
          <p className="text-center text-body-l opacity-70 italic">
            Programma in fase di caricamento. Le date saranno annunciate sui
            canali ufficiali.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section
      data-theme={paletteToTheme[palette]}
      className={bg}
      style={{
        backgroundColor: inlineBg,
        paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))",
      }}
    >
      <Container>
        {heading && (
          <div className="text-center mb-16 md:mb-20">
            <div className="flex justify-center mb-4">
              <OndaDecorativa
                width={120}
                variant="sottile"
                className="text-crema-base/50"
              />
            </div>
            <p className={`uppercase-tracked text-caption mb-3 ${eyebrowCol}`}>
              Programma
            </p>
            <h2 className={`font-display text-display-m ${headingCol}`}>
              {heading}
            </h2>
          </div>
        )}

        <div className="space-y-20 md:space-y-28">
          {spettacoli.map((s, idx) => {
            const reverse = idx % 2 === 1;
            const fotoUrl =
              s.immagineCover?.asset?._ref &&
              urlFor(s.immagineCover as Parameters<typeof urlFor>[0])
                .width(1200)
                .height(900)
                .fit("crop")
                .url();
            const linkCompagnia =
              s.linkCompagniaEsterna ?? s.compagnia?.urlSitoCompagnia;
            const data = dataParts(s.dataInizio);
            // Priorità: descrizione lunga (PortableText) > descrizioneBreve > descrizione compagnia.
            const descrizione =
              blocksToText(s.descrizione) || s.descrizioneBreve || "";
            const luogoStr = locationLabel(s);

            return (
              <article
                key={s._id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Foto */}
                <div className="md:col-span-7">
                  <div
                    className={`relative w-full overflow-hidden border ${fotoBorder}`}
                    style={{ aspectRatio: "4/3" }}
                  >
                    {fotoUrl ? (
                      <Image
                        src={fotoUrl}
                        alt={s.immagineCover?.alt ?? s.titolo ?? ""}
                        fill
                        sizes="(min-width: 768px) 58vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <PlaceholderImage
                        title={s.titolo ?? "Spettacolo"}
                        aspectRatio="4/3"
                      />
                    )}
                  </div>
                </div>

                {/* Testo */}
                <div className="md:col-span-5">
                  {data && (
                    <div className="flex items-baseline gap-3 mb-4">
                      <span
                        className={`font-display leading-none ${dataCol}`}
                        style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)" }}
                      >
                        {data.giorno}
                      </span>
                      <div className="flex flex-col">
                        <span className={`font-display text-h4 leading-none ${dataCol}`}>
                          {data.mese}
                        </span>
                        <span className={`text-caption uppercase-tracked mt-1 ${datasubCol}`}>
                          {data.settimana} · ore {data.ora}
                        </span>
                      </div>
                    </div>
                  )}

                  <h3 className={`font-display text-h2 leading-tight text-balance ${titoloCol}`}>
                    {s.titolo}
                  </h3>

                  {s.compagnia?.nome && (
                    <p className={`mt-2 text-body-l italic ${compagniaCol}`}>
                      {linkCompagnia ? (
                        <a
                          href={linkCompagnia}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={`underline underline-offset-4 ${compagniaUnderline}`}
                        >
                          {s.compagnia.nome}
                        </a>
                      ) : (
                        s.compagnia.nome
                      )}
                    </p>
                  )}

                  {descrizione && (
                    <p className={`mt-5 text-body whitespace-pre-line leading-relaxed ${descrCol}`}>
                      {descrizione}
                    </p>
                  )}

                  {s.compagnia?.descrizioneCompagniaBreve && !descrizione && (
                    <p className={`mt-5 text-body italic ${descrCol}`}>
                      {s.compagnia.descrizioneCompagniaBreve}
                    </p>
                  )}

                  <dl className="mt-6 grid gap-2 text-body-s">
                    {luogoStr && (
                      <div className="flex gap-3">
                        <dt className={`uppercase-tracked text-caption shrink-0 w-24 pt-0.5 ${dlLabelCol}`}>
                          Luogo
                        </dt>
                        <dd className={dlValueCol}>{luogoStr}</dd>
                      </div>
                    )}
                    {s.cast && (
                      <div className="flex gap-3">
                        <dt className={`uppercase-tracked text-caption shrink-0 w-24 pt-0.5 ${dlLabelCol}`}>
                          Cast
                        </dt>
                        <dd className={`whitespace-pre-line ${dlValueCol}`}>
                          {s.cast}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default ProgrammaCompleto;
