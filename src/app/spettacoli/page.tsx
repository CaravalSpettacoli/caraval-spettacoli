import { client } from "@/../sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SpettacoliGrid } from "@/components/caraval/SpettacoliGrid";
import type { SpettacoloCardLargeData } from "@/components/caraval/SpettacoloCardLarge";

type PaginaCopy = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  ctaArchivioDallIndice?: string;
};

export const revalidate = 60;

async function getData() {
  const [spettacoli, copy] = await Promise.all([
    client.fetch<SpettacoloCardLargeData[]>(
      `*[_type == "spettacolo" && inRepertorio == true] | order(ordineHomepage asc, titolo asc){
        _id, titolo, sottotitolo, slug, categoria, descrizioneBreve, immagineCover,
        "premiAssociati": premiAssociati[]->{ _id, anno, nomePremio }
      }`
    ),
    client.fetch<PaginaCopy | null>(`*[_type == "paginaSpettacoliCopy"][0]`),
  ]);
  return { spettacoli, copy };
}

export const metadata = {
  title: "Spettacoli",
  description:
    "Il repertorio attivo di Caraval Spettacoli: prosa, teatro di fuoco, teatro di strada.",
};

export default async function PaginaSpettacoli() {
  const { spettacoli, copy } = await getData();

  return (
    <>
      <section className="bg-nero-base flex items-center min-h-[40vh]">
        <Container>
          <div className="py-16 md:py-20 max-w-[820px]">
            {copy?.eyebrow && (
              <p className="uppercase-tracked text-caption text-rosso-base">
                {copy.eyebrow}
              </p>
            )}
            <h1 className="mt-3 font-display text-display-m md:text-display-l text-crema-base text-balance">
              {copy?.heading ?? "I nostri spettacoli"}
            </h1>
            {copy?.intro && (
              <p className="mt-4 text-body-l text-crema-muted">{copy.intro}</p>
            )}
          </div>
        </Container>
      </section>

      <Section background="nero">
        <Container>
          <SpettacoliGrid spettacoli={spettacoli} />
        </Container>
      </Section>

      {copy?.ctaArchivioDallIndice && (
        <Section background="nero-soft" className="py-16 md:py-20">
          <Container>
            <a
              href="/spettacoli/archivio"
              className="block text-center font-display text-h3 md:text-h2 text-crema-base hover:text-rosso-hover transition-colors text-balance"
            >
              {copy.ctaArchivioDallIndice} →
            </a>
          </Container>
        </Section>
      )}
    </>
  );
}
