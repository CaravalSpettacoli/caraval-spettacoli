import { Container } from "@/components/ui/Container";
import { OndaDecorativa } from "@/components/decorative/OndaDecorativa";

export type OspitaCopy = {
  ospitaHeading?: string;
  ospitaBody?: string;
  ospitaCtaTesto?: string;
  ospitaCtaLink?: string;
};

export function OspitaTeaser({ copy }: { copy: OspitaCopy | null }) {
  if (!copy) return null;
  return (
    <section className="relative bg-rosso-base text-crema-base py-20 md:py-24 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 text-crema-base/15"
      >
        <OndaDecorativa className="w-full h-12" />
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 text-crema-base/15 rotate-180"
      >
        <OndaDecorativa className="w-full h-12" />
      </div>

      <Container>
        <div className="max-w-[820px] mx-auto text-center">
          <p className="uppercase-tracked text-caption text-crema-muted">
            Ospita Caraval · B2B
          </p>
          {copy.ospitaHeading && (
            <h2 className="mt-3 font-display text-display-m text-crema-base text-balance">
              {copy.ospitaHeading}
            </h2>
          )}
          {copy.ospitaBody && (
            <p className="mt-6 text-body-l text-crema-base/95">
              {copy.ospitaBody}
            </p>
          )}
          {copy.ospitaCtaTesto && (
            <div className="mt-10">
              <a
                href={copy.ospitaCtaLink ?? "/ospita"}
                className="inline-flex items-center justify-center h-14 px-8 bg-crema-base text-rosso-deep font-semibold rounded-md hover:bg-crema-bright transition-colors duration-base focus-visible:outline-2 focus-visible:outline-crema-base focus-visible:outline-offset-2"
              >
                {copy.ospitaCtaTesto}
              </a>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default OspitaTeaser;
