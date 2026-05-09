import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";

type CTA = { label: string; href: string; esterno?: boolean };

type FotoSfondo = {
  asset?: { _ref?: string };
  alt?: string;
};

export interface HeroPaginaProps {
  eyebrow?: string;
  heading: string;
  sottotitolo?: string;
  ctaPrimaria?: CTA;
  ctaSecondaria?: CTA;
  fotoSfondo?: FotoSfondo | null;
  palette?: "default" | "imaginarium";
  altezza?: "full" | "compatto";
}

export function HeroPagina({
  eyebrow,
  heading,
  sottotitolo,
  ctaPrimaria,
  ctaSecondaria,
  fotoSfondo,
  palette = "default",
  altezza = "compatto",
}: HeroPaginaProps) {
  const isImag = palette === "imaginarium";
  const isFull = altezza === "full";

  const fotoUrl =
    fotoSfondo?.asset?._ref &&
    urlFor(fotoSfondo as Parameters<typeof urlFor>[0])
      .width(2400)
      .height(1400)
      .fit("crop")
      .url();

  const bgClass = isImag
    ? "bg-crema-base"
    : "bg-nero-deep";
  const eyebrowClass = isImag
    ? "text-rosso-deep/80"
    : "text-rosso-base/90";
  const headingClass = isImag
    ? "text-rosso-deep"
    : "text-crema-base";
  const sottotitoloClass = isImag
    ? "text-nero-base/85"
    : "text-crema-base/85";
  const ctaSecLinkClass = isImag
    ? "text-rosso-deep hover:text-rosso-base decoration-rosso-deep"
    : "text-crema-base hover:text-crema-bright decoration-rosso-base";

  return (
    <section
      className={`relative w-full overflow-hidden flex items-center ${bgClass}`}
      style={{ minHeight: isFull ? "100vh" : "60vh" }}
    >
      {fotoUrl && (
        <>
          <Image
            src={fotoUrl}
            alt={fotoSfondo?.alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className={
              isImag
                ? "absolute inset-0 bg-gradient-to-t from-crema-base/80 via-crema-base/40 to-crema-base/10"
                : "absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20"
            }
          />
        </>
      )}

      <div className="relative w-full">
        <Container className={isFull ? "py-20 md:py-28" : "py-14 md:py-20"}>
          <div className="max-w-[820px]">
            {eyebrow && (
              <p
                className={`uppercase-tracked text-caption ${eyebrowClass}`}
              >
                {eyebrow}
              </p>
            )}
            <h1
              className={`mt-3 font-display leading-[1.05] tracking-tight text-balance ${headingClass}`}
              style={{
                fontSize: isFull
                  ? "clamp(2.75rem, 9vw, 7rem)"
                  : "clamp(2.25rem, 6vw, 5rem)",
                letterSpacing: "0.01em",
              }}
            >
              {heading}
            </h1>
            {sottotitolo && (
              <p
                className={`mt-6 max-w-[680px] text-body-l whitespace-pre-line ${sottotitoloClass}`}
              >
                {sottotitolo}
              </p>
            )}
            {(ctaPrimaria || ctaSecondaria) && (
              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-4">
                {ctaPrimaria && (
                  <Button
                    as="link"
                    href={ctaPrimaria.href}
                    variant="primary"
                    size="lg"
                    pulse
                    target={ctaPrimaria.esterno ? "_blank" : undefined}
                    rel={ctaPrimaria.esterno ? "noopener noreferrer" : undefined}
                    className={
                      isImag
                        ? "!bg-rosso-deep hover:!bg-rosso-base"
                        : ""
                    }
                  >
                    {ctaPrimaria.label}
                  </Button>
                )}
                {ctaSecondaria && (
                  <a
                    href={ctaSecondaria.href}
                    target={ctaSecondaria.esterno ? "_blank" : undefined}
                    rel={ctaSecondaria.esterno ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center underline underline-offset-8 transition-colors duration-base text-balance break-words max-w-full ${ctaSecLinkClass}`}
                    style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.125rem)" }}
                  >
                    {ctaSecondaria.label}
                  </a>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}

export default HeroPagina;
