import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { CategoriaBadge, type Categoria } from "@/components/caraval/CategoriaBadge";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { urlFor } from "@/../sanity/lib/image";

export type HeroSpettacoloData = {
  titolo?: string;
  sottotitolo?: string;
  categoria?: Categoria;
  annoCreazione?: number;
  immagineCover?: { asset?: { _ref?: string }; alt?: string };
  premiAssociati?: Array<{ _id: string; anno?: number; nomePremio?: string }>;
};

export function HeroSpettacolo({ data }: { data: HeroSpettacoloData }) {
  const fotoUrl =
    data.immagineCover?.asset?._ref &&
    urlFor(data.immagineCover as Parameters<typeof urlFor>[0])
      .width(2400)
      .height(1400)
      .fit("crop")
      .url();
  const premio = data.premiAssociati?.[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-nero-deep flex items-end"
      style={{ minHeight: "70vh" }}
    >
      {fotoUrl ? (
        <Image
          src={fotoUrl}
          alt={data.immagineCover?.alt ?? data.titolo ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div aria-hidden className="absolute inset-0">
          <PlaceholderImage
            title=""
            aspectRatio="auto"
            className="absolute inset-0 h-full"
          />
        </div>
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/85"
      />

      <div className="relative w-full">
        <Container>
          <div className="py-16 md:py-20 max-w-[820px]">
            {data.categoria && (
              <div className="mb-6">
                <CategoriaBadge categoria={data.categoria} />
              </div>
            )}
            <h1
              className="font-display text-crema-base leading-[1.05] tracking-tight text-balance"
              style={{ fontSize: "clamp(2.75rem, 7vw, 5.5rem)" }}
            >
              {data.titolo}
            </h1>
            {data.sottotitolo && (
              <p className="mt-4 text-h4 md:text-h3 text-crema-muted italic font-light">
                {data.sottotitolo}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-body-s text-crema-muted">
              {data.annoCreazione && (
                <span className="uppercase-tracked text-caption">
                  {data.annoCreazione}
                </span>
              )}
              {premio && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-rosso-deep/80 text-crema-base text-caption uppercase-tracked rounded-sm">
                  {premio.nomePremio} {premio.anno}
                </span>
              )}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

export default HeroSpettacolo;
