import Image from "next/image";
import { client } from "@/../sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { urlFor } from "@/../sanity/lib/image";

type ArchivioCopy = {
  archivioEyebrow?: string;
  archivioHeading?: string;
  archivioIntro?: string;
};

type ArchivioItem = {
  _id: string;
  titolo?: string;
  annoCreazione?: number;
  regia?: string;
  immagineCover?: { asset?: { _ref?: string }; alt?: string };
  premiAssociati?: Array<{ _id: string; anno?: number; nomePremio?: string }>;
};

export const revalidate = 60;

export const metadata = {
  title: "Archivio spettacoli",
  description:
    "Le produzioni passate di Caraval Spettacoli: per scoprire da dove veniamo.",
};

async function getData() {
  const [archivio, copy] = await Promise.all([
    client.fetch<ArchivioItem[]>(
      `*[_type == "spettacolo" && inRepertorio == false] | order(annoCreazione desc, titolo asc){
        _id, titolo, annoCreazione, regia, immagineCover,
        "premiAssociati": premiAssociati[]->{ _id, anno, nomePremio }
      }`
    ),
    client.fetch<ArchivioCopy | null>(
      `*[_type == "paginaSpettacoliCopy"][0]{ archivioEyebrow, archivioHeading, archivioIntro }`
    ),
  ]);
  return { archivio, copy };
}

export default async function PaginaArchivio() {
  const { archivio, copy } = await getData();

  return (
    <>
      <section className="bg-nero-base flex items-center min-h-[40vh]">
        <Container>
          <div className="py-16 md:py-20 max-w-[820px]">
            {copy?.archivioEyebrow && (
              <p className="uppercase-tracked text-caption text-rosso-base">
                {copy.archivioEyebrow}
              </p>
            )}
            <h1 className="mt-3 font-display text-display-m md:text-display-l text-crema-base text-balance">
              {copy?.archivioHeading ?? "Produzioni passate"}
            </h1>
            {copy?.archivioIntro && (
              <p className="mt-4 text-body-l text-crema-muted">
                {copy.archivioIntro}
              </p>
            )}
          </div>
        </Container>
      </section>

      <Section background="nero">
        <Container>
          {archivio.length === 0 ? (
            <p className="text-body text-crema-muted text-center py-12">
              Archivio in arrivo.
            </p>
          ) : (
            <ul
              role="list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {archivio.map((s) => {
                const fotoUrl =
                  s.immagineCover?.asset?._ref &&
                  urlFor(s.immagineCover as Parameters<typeof urlFor>[0])
                    .width(700)
                    .height(875)
                    .fit("crop")
                    .url();
                const premio = s.premiAssociati?.[0];
                return (
                  <li key={s._id} className="bg-nero-soft border border-crema-faint">
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: "4/5" }}
                    >
                      {fotoUrl ? (
                        <Image
                          src={fotoUrl}
                          alt={s.immagineCover?.alt ?? s.titolo ?? ""}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <PlaceholderImage
                          title={s.titolo ?? "Spettacolo"}
                          aspectRatio="4/5"
                        />
                      )}
                      {premio && (
                        <div className="absolute top-3 right-3 bg-rosso-deep text-crema-base px-2 py-1 text-[10px] uppercase-tracked font-semibold rounded-sm">
                          Premio {premio.anno}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-h4 text-crema-base leading-tight line-clamp-2">
                        {s.titolo}
                      </h3>
                      <div className="mt-2 flex items-baseline justify-between gap-3">
                        {s.annoCreazione && (
                          <span className="text-body-s text-crema-muted">
                            {s.annoCreazione}
                          </span>
                        )}
                        {s.regia && (
                          <span className="text-caption text-crema-muted italic line-clamp-1 text-right">
                            regia {s.regia}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
