import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MascheraTeatrale } from "@/components/decorative/MascheraTeatrale";

export type OfficinaCopy = {
  officinaEyebrow?: string;
  officinaHeading?: string;
  officinaBody?: string;
  officinaTagline?: string;
  officinaCtaTesto?: string;
  officinaCtaLink?: string;
};

export function OfficinaTeaser({ copy }: { copy: OfficinaCopy | null }) {
  if (!copy) return null;
  return (
    <Section background="nero-soft">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
          <div className="max-w-[640px]">
            {copy.officinaEyebrow && (
              <p className="uppercase-tracked text-caption text-rosso-base">
                {copy.officinaEyebrow}
              </p>
            )}
            {copy.officinaHeading && (
              <h2 className="mt-3 font-display text-display-m text-crema-base text-balance">
                {copy.officinaHeading}
              </h2>
            )}
            {copy.officinaTagline && (
              <p className="mt-4 text-h4 text-crema-base italic font-light">
                {copy.officinaTagline}
              </p>
            )}
            {copy.officinaBody && (
              <p className="mt-6 text-body-l text-crema-muted">
                {copy.officinaBody}
              </p>
            )}
            {copy.officinaCtaTesto && (
              <div className="mt-8">
                <Button
                  as="link"
                  href={copy.officinaCtaLink ?? "/formazione"}
                  variant="secondary"
                  size="md"
                >
                  {copy.officinaCtaTesto}
                </Button>
              </div>
            )}
          </div>

          <div
            aria-hidden
            className="hidden lg:flex items-center justify-center text-rosso-base/60"
          >
            <div className="flex gap-4">
              <MascheraTeatrale tipo="commedia" size={140} />
              <MascheraTeatrale tipo="tragedia" size={140} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default OfficinaTeaser;
