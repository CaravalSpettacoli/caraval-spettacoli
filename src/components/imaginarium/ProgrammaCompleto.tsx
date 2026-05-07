import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { urlFor } from "@/../sanity/lib/image";

export type SpettacoloImagItem = {
  _id: string;
  titolo?: string;
  dataInizio?: string;
  compagnia?: { nome?: string; urlSitoCompagnia?: string };
  linkCompagniaEsterna?: string;
  immagineCover?: { asset?: { _ref?: string }; alt?: string };
};

const MESI = [
  "gen",
  "feb",
  "mar",
  "apr",
  "mag",
  "giu",
  "lug",
  "ago",
  "set",
  "ott",
  "nov",
  "dic",
];
const GIORNI = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];

function formatData(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const giorno = GIORNI[d.getDay()];
  const num = d.getDate();
  const mese = MESI[d.getMonth()];
  const ore = d.getHours();
  const min = d.getMinutes();
  const oraStr =
    min === 0 ? `ore ${ore}` : `ore ${ore}.${min.toString().padStart(2, "0")}`;
  return `${giorno.charAt(0).toUpperCase() + giorno.slice(1)} ${num} ${mese} · ${oraStr}`;
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
      <section className="py-16 md:py-20 bg-crema-base text-nero-base">
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
    <section className="py-16 md:py-20 bg-crema-base text-nero-base">
      <Container>
        {heading && (
          <h2 className="text-center font-display text-display-m text-rosso-deep mb-12">
            {heading}
          </h2>
        )}
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {spettacoli.map((s) => {
            const linkCompagnia =
              s.linkCompagniaEsterna ?? s.compagnia?.urlSitoCompagnia;
            const fotoUrl =
              s.immagineCover?.asset?._ref &&
              urlFor(s.immagineCover as Parameters<typeof urlFor>[0])
                .width(800)
                .height(600)
                .fit("crop")
                .url();
            return (
              <li
                key={s._id}
                className="group flex flex-col bg-crema-bright border border-rosso-deep/20 hover:border-rosso-deep transition-all duration-base hover:shadow-[0_12px_32px_rgba(142,18,64,0.18)] hover:-translate-y-1"
              >
                <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                  {fotoUrl ? (
                    <Image
                      src={fotoUrl}
                      alt={s.immagineCover?.alt ?? s.titolo ?? ""}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <PlaceholderImage
                      title={s.titolo ?? "Spettacolo"}
                      aspectRatio="4/3"
                    />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="font-display text-h4 text-rosso-deep leading-tight">
                    {formatData(s.dataInizio)}
                  </div>
                  <div className="mt-2 text-body font-semibold text-nero-base">
                    {s.titolo}
                  </div>
                  {s.compagnia?.nome && (
                    <div className="mt-1 text-body-s text-nero-base/70 italic">
                      {linkCompagnia ? (
                        <a
                          href={linkCompagnia}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="hover:text-rosso-deep underline underline-offset-4"
                        >
                          {s.compagnia.nome}
                        </a>
                      ) : (
                        s.compagnia.nome
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default ProgrammaCompleto;
