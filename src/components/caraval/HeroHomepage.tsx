import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export type HeroHomepageData = {
  heading?: string;
  subheading?: string;
  ctaPrimariaTesto?: string;
  ctaPrimariaLink?: string;
  ctaSecondariaTesto?: string;
  ctaSecondariaLink?: string;
  fotoSfondo?: {
    asset?: { _ref?: string };
    alt?: string;
  };
};

export function HeroHomepage({ data }: { data: HeroHomepageData | null }) {
  if (!data) return null;
  const heading = data.heading ?? "Caraval Spettacoli";
  const fotoUrl =
    data.fotoSfondo?.asset?._ref &&
    urlFor(data.fotoSfondo as Parameters<typeof urlFor>[0])
      .width(2400)
      .height(1400)
      .fit("crop")
      .url();

  return (
    <section className="relative w-full overflow-hidden bg-nero-deep min-h-[80vh] flex items-center">
      {fotoUrl ? (
        <Image
          src={fotoUrl}
          alt={data.fotoSfondo?.alt ?? ""}
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
      {/* Overlay scuro gradient per contrasto sui testi */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"
      />

      <div className="relative w-full">
        <Container className="py-20 md:py-24">
          <h1
            className="font-display text-crema-base leading-[1.05] tracking-tight max-w-[18ch]"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
          >
            {heading}
          </h1>
          {data.subheading && (
            <p className="mt-6 max-w-[700px] text-body-l text-crema-muted whitespace-pre-line">
              {data.subheading}
            </p>
          )}
          {(data.ctaPrimariaTesto || data.ctaSecondariaTesto) && (
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              {data.ctaPrimariaTesto && data.ctaPrimariaLink && (
                <Button
                  as="link"
                  href={data.ctaPrimariaLink}
                  variant="primary"
                  size="lg"
                  pulse
                >
                  {data.ctaPrimariaTesto}
                </Button>
              )}
              {data.ctaSecondariaTesto && data.ctaSecondariaLink && (
                <a
                  href={data.ctaSecondariaLink}
                  className="inline-flex items-center text-body-l text-crema-base underline underline-offset-8 decoration-rosso-base hover:text-crema-bright transition-colors duration-base"
                >
                  {data.ctaSecondariaTesto}
                </a>
              )}
            </div>
          )}
        </Container>
      </div>
    </section>
  );
}

export default HeroHomepage;
