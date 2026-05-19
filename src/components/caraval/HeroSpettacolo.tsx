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
  /** Foto orizzontale 16:9 dedicata alla hero scheda dettaglio. */
  fotoHero?: { asset?: { _ref?: string }; alt?: string };
  /** Cover verticale 4:5 usata in card anteprima. Fallback se fotoHero manca. */
  immagineCover?: { asset?: { _ref?: string }; alt?: string };
  premiAssociati?: Array<{ _id: string; anno?: number; nomePremio?: string }>;
};

export function HeroSpettacolo({ data }: { data: HeroSpettacoloData }) {
  // Hotfix pre-golive: la priorità fotoHero (orizzontale 16:9) resta, ma quando
  // SOLO la cover verticale 4:5 è disponibile non la stiracchiamo più — la
  // mostriamo come "poster" (sfocata come sfondo, nitida sulla sx come elemento
  // grafico). Risolve la sensazione di zoom estremo segnalata da Vera su
  // I Viaggiastorie e altri spettacoli con solo cover.
  const hasHero = !!data.fotoHero?.asset?._ref;
  const hasCover = !!data.immagineCover?.asset?._ref;
  const heroUrl =
    hasHero &&
    urlFor(data.fotoHero as Parameters<typeof urlFor>[0])
      .width(2400)
      .height(1400)
      .fit("crop")
      .url();
  const coverUrl =
    hasCover &&
    urlFor(data.immagineCover as Parameters<typeof urlFor>[0])
      .width(900)
      .height(1125)
      .fit("crop")
      .url();
  const posterMode = !hasHero && hasCover;
  const premio = data.premiAssociati?.[0];

  return (
    <section
      data-theme="dark"
      className="relative w-full overflow-hidden bg-nero-deep flex items-end"
      style={{ minHeight: "70vh" }}
    >
      {heroUrl ? (
        <Image
          src={heroUrl}
          alt={data.fotoHero?.alt ?? data.titolo ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover hero-foto-sfondo"
          style={{ objectPosition: "center 35%" }}
        />
      ) : posterMode && coverUrl ? (
        <>
          {/* Sfondo: cover sfocata + saturata per dare colore alla hero. */}
          <Image
            src={coverUrl}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              filter: "blur(28px) saturate(1.1)",
              transform: "scale(1.15)",
            }}
          />
          {/* Cover nitida a destra come poster (visibile solo su md+). */}
          <div
            aria-hidden
            className="hidden md:block absolute right-[6vw] top-1/2 -translate-y-1/2 w-[280px] lg:w-[340px] aspect-[4/5] rounded-md overflow-hidden shadow-poster"
          >
            <Image
              src={coverUrl}
              alt={data.immagineCover?.alt ?? data.titolo ?? ""}
              fill
              sizes="(min-width: 1024px) 340px, 280px"
              className="object-cover"
            />
          </div>
        </>
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
        className={
          posterMode
            ? "absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30"
            : "absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/85"
        }
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
