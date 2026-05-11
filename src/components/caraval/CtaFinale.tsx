import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { urlFor } from "@/../sanity/lib/image";

type CTA = { label: string; href: string; esterno?: boolean };

type FotoSfondo = { asset?: { _ref?: string }; alt?: string };

export interface CtaFinaleProps {
  /** Eyebrow opzionale uppercase tracked sopra l'heading. */
  eyebrow?: string;
  /** Heading principale Cinzel. */
  heading: string;
  /** 1-2 righe Inter sotto l'heading. Era "body" in versioni precedenti. */
  sottotitolo?: string;
  ctaPrimaria?: CTA;
  ctaSecondaria?: CTA;
  /** "accent" = rosso pieno (default CTA finali). "dark" = nero. */
  variant?: "dark" | "accent";
  /** Foto opzionale come background con overlay (solo variant=dark). */
  fotoSfondo?: FotoSfondo | null;
}

export function CtaFinale({
  eyebrow,
  heading,
  sottotitolo,
  ctaPrimaria,
  ctaSecondaria,
  variant = "accent",
  fotoSfondo,
}: CtaFinaleProps) {
  const isAccent = variant === "accent";

  const fotoUrl =
    !isAccent && fotoSfondo?.asset?._ref
      ? urlFor(fotoSfondo as Parameters<typeof urlFor>[0])
          .width(2400)
          .height(1200)
          .fit("crop")
          .url()
      : null;

  const bg = isAccent
    ? "bg-rosso-base text-crema-base"
    : "bg-nero-base text-crema-base";
  const eyebrowCol = isAccent ? "text-crema-base/80" : "text-rosso-base/90";
  const sottotitoloCol = isAccent ? "text-crema-base/90" : "text-crema-muted";

  return (
    <section
      data-theme={isAccent ? "accent" : "dark"}
      className={`relative overflow-hidden ${bg}`}
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      {fotoUrl && (
        <>
          <Image
            src={fotoUrl}
            alt={fotoSfondo?.alt ?? ""}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-black/40"
          />
        </>
      )}
      <div className="relative">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            {eyebrow && (
              <p className={`uppercase-tracked text-caption mb-3 ${eyebrowCol}`}>
                {eyebrow}
              </p>
            )}
            <h2 className="font-display text-h1 leading-tight text-balance">
              {heading}
            </h2>
            {sottotitolo && (
              <p
                className={`mt-4 text-body-l whitespace-pre-line ${sottotitoloCol}`}
              >
                {sottotitolo}
              </p>
            )}
            {(ctaPrimaria || ctaSecondaria) && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                {ctaPrimaria && (
                  <Button
                    as="link"
                    href={ctaPrimaria.href}
                    variant="primary"
                    size="lg"
                    target={ctaPrimaria.esterno ? "_blank" : undefined}
                    rel={ctaPrimaria.esterno ? "noopener noreferrer" : undefined}
                    className={
                      isAccent
                        ? "!bg-crema-base !text-rosso-deep hover:!bg-crema-bright"
                        : ""
                    }
                  >
                    {ctaPrimaria.label}
                  </Button>
                )}
                {ctaSecondaria && (
                  <Button
                    as="link"
                    href={ctaSecondaria.href}
                    variant="secondary"
                    size="lg"
                    target={ctaSecondaria.esterno ? "_blank" : undefined}
                    rel={ctaSecondaria.esterno ? "noopener noreferrer" : undefined}
                    className={
                      isAccent
                        ? "!border-crema-base !text-crema-base hover:!bg-crema-base hover:!text-rosso-deep"
                        : ""
                    }
                  >
                    {ctaSecondaria.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}

export default CtaFinale;
