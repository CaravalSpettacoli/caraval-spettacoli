import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";
import { paletteToTheme } from "@/lib/theme-system";
import { HeroParallaxFoto } from "@/components/caraval/HeroParallaxFoto";

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
  /** Se settato, sostituisce l'heading testuale con un'immagine logo. */
  logoSrc?: string;
  logoAlt?: string;
  /** Object-position della foto sfondo. Default "center". Esempio "center 30%"
   *  per ritratti dove servono visibili i volti (es. /chi-siamo). */
  fotoObjectPosition?: string;
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
  logoSrc,
  logoAlt,
  fotoObjectPosition,
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

  // Hotfix 1: palette imaginarium = rosso pieno #a8174a (era crema invertita).
  const bgInlineStyle = isImag
    ? { backgroundColor: "#a8174a" }
    : {};
  const bgClass = isImag ? "" : "bg-nero-deep";
  const eyebrowClass = isImag
    ? "text-crema-base/80"
    : "text-rosso-base/90";
  const headingClass = "text-crema-base";
  const sottotitoloClass = isImag
    ? "text-crema-base/85"
    : "text-crema-base/85";
  const ctaSecLinkClass = isImag
    ? "text-crema-base hover:text-crema-bright decoration-crema-base"
    : "text-crema-base hover:text-crema-bright decoration-rosso-base";

  return (
    <section
      data-theme={paletteToTheme[palette]}
      className={`relative w-full overflow-hidden flex items-center ${bgClass}`}
      style={{ minHeight: isFull ? "100vh" : "60vh", ...bgInlineStyle }}
    >
      {fotoUrl ? (
        <>
          <HeroParallaxFoto
            src={fotoUrl}
            alt={fotoSfondo?.alt ?? ""}
            objectPosition={fotoObjectPosition}
          />
          {/* Overlay scuro su entrambe le palette: il testo crema sopra foto
              ha bisogno di overlay scuro per leggibilità. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20"
          />
        </>
      ) : (
        // Placeholder grafico: gradient radiale sottile + noise SVG opacity 0.03.
        // Dà profondità alla hero quando la foto Sanity non è ancora caricata.
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isImag
              ? "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(245,230,211,0.08), transparent 60%)"
              : "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(168,23,74,0.18), transparent 65%)",
          }}
        >
          <svg
            className="w-full h-full opacity-[0.04] mix-blend-overlay"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="hero-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#hero-noise)" />
          </svg>
        </div>
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
            {logoSrc ? (
              <div className="mt-3 max-w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt={logoAlt ?? heading}
                  className="block w-full h-auto"
                  style={{
                    maxWidth: isFull
                      ? "min(720px, 90vw)"
                      : "min(520px, 80vw)",
                    // Hotfix 1: niente filter per palette imaginarium. Il logo
                    // PNG è già crema/beige, perfetto su rosso saturo.
                  }}
                />
                <span className="sr-only">{heading}</span>
              </div>
            ) : (
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
            )}
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
                        ? "!bg-nero-base !text-crema-base hover:!bg-nero-soft"
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
