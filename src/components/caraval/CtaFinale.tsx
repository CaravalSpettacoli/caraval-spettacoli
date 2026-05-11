import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ctaVariantToTheme } from "@/lib/theme-system";

type CTA = { label: string; href: string; esterno?: boolean };

export function CtaFinale({
  eyebrow,
  heading,
  body,
  ctaPrimaria,
  ctaSecondaria,
  variant = "default",
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  ctaPrimaria?: CTA;
  ctaSecondaria?: CTA;
  /** "rosso": sfondo rosso pieno con CTA crema (B2B/finale forte). "default": nero. */
  variant?: "default" | "rosso";
}) {
  const isRosso = variant === "rosso";
  const bg = isRosso ? "bg-rosso-base text-crema-base" : "bg-nero-base text-crema-base";
  const eyebrowCol = isRosso ? "text-crema-base/80" : "text-rosso-base/90";
  const bodyCol = isRosso ? "text-crema-base/90" : "text-crema-muted";

  return (
    <section
      data-theme={ctaVariantToTheme[variant]}
      className={bg}
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
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
          {body && (
            <p className={`mt-4 text-body-l whitespace-pre-line ${bodyCol}`}>
              {body}
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
                    isRosso
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
                    isRosso
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
    </section>
  );
}

export default CtaFinale;
