import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { urlFor } from "@/../sanity/lib/image";

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
}: {
  spettacoli: SpettacoloImagItem[] | null;
  heading?: string;
}) {
  if (!spettacoli || spettacoli.length === 0) {
    return (
      <section
        className="bg-crema-base text-nero-base"
        style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
      >
        <Container>
          <p className="text-center text-body-l text-nero-base/70 italic">
            Programma in fase di caricamento. Le date saranno annunciate sui
            canali ufficiali.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="bg-crema-base text-nero-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        {heading && (
          <div className="text-center mb-16 md:mb-20">
            <p className="uppercase-tracked text-caption text-rosso-deep/80 mb-3">
              Programma
            </p>
            <h2 className="font-display text-display-m text-rosso-deep">
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
            const descrizione = blocksToText(s.descrizione);
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
                    className="relative w-full overflow-hidden border border-rosso-deep/20"
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
                        className="font-display text-rosso-deep leading-none"
                        style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)" }}
                      >
                        {data.giorno}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-display text-h4 text-rosso-deep leading-none">
                          {data.mese}
                        </span>
                        <span className="text-caption uppercase-tracked text-nero-base/60 mt-1">
                          {data.settimana} · ore {data.ora}
                        </span>
                      </div>
                    </div>
                  )}

                  <h3 className="font-display text-h2 text-nero-base leading-tight text-balance">
                    {s.titolo}
                  </h3>

                  {s.compagnia?.nome && (
                    <p className="mt-2 text-body-l italic text-nero-base/75">
                      {linkCompagnia ? (
                        <a
                          href={linkCompagnia}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="hover:text-rosso-deep underline underline-offset-4 decoration-rosso-deep/40"
                        >
                          {s.compagnia.nome}
                        </a>
                      ) : (
                        s.compagnia.nome
                      )}
                    </p>
                  )}

                  {descrizione && (
                    <p className="mt-5 text-body text-nero-base/85 whitespace-pre-line leading-relaxed">
                      {descrizione}
                    </p>
                  )}

                  {s.compagnia?.descrizioneCompagniaBreve && !descrizione && (
                    <p className="mt-5 text-body text-nero-base/75 italic">
                      {s.compagnia.descrizioneCompagniaBreve}
                    </p>
                  )}

                  <dl className="mt-6 grid gap-2 text-body-s">
                    {luogoStr && (
                      <div className="flex gap-3">
                        <dt className="uppercase-tracked text-caption text-rosso-deep/80 shrink-0 w-24 pt-0.5">
                          Luogo
                        </dt>
                        <dd className="text-nero-base">{luogoStr}</dd>
                      </div>
                    )}
                    {s.cast && (
                      <div className="flex gap-3">
                        <dt className="uppercase-tracked text-caption text-rosso-deep/80 shrink-0 w-24 pt-0.5">
                          Cast
                        </dt>
                        <dd className="text-nero-base whitespace-pre-line">
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
