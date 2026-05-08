import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MascheraTeatrale } from "@/components/decorative/MascheraTeatrale";

export function LaboratoriScuoleSection({
  eyebrow,
  heading,
  body,
  ctaTesto,
  ctaHref,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  ctaTesto: string;
  ctaHref: string;
}) {
  return (
    <Section className="bg-nero-soft border-y border-crema-faint/30">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <p className="text-label uppercase-tracked text-rosso-hover mb-3">
              {eyebrow}
            </p>
            <h2 className="font-display text-h2 text-crema-base leading-tight">
              {heading}
            </h2>
            <p className="mt-6 max-w-[640px] text-body-l text-crema-muted whitespace-pre-line">
              {body}
            </p>
            <a
              href={ctaHref}
              className="mt-8 inline-flex items-center text-body-l text-crema-base underline underline-offset-8 decoration-rosso-base hover:text-rosso-hover transition-colors"
            >
              {ctaTesto} →
            </a>
          </div>
          <div className="hidden lg:flex justify-end items-start opacity-30">
            <MascheraTeatrale style="A" tipo="commedia" className="w-32 h-32 text-rosso-hover" />
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default LaboratoriScuoleSection;
