import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";

export type PremioItem = {
  _id: string;
  anno?: number;
  nomePremio?: string;
  rassegna?: string;
  motivazione?: string;
  spettacoloAssociato?: { titolo?: string; slug?: { current?: string } };
};

export function StripPremi({
  premi,
  heading,
}: {
  premi: PremioItem[] | null;
  heading?: string;
}) {
  if (!premi || premi.length === 0) return null;
  return (
    <Section background="nero-soft" className="py-16 md:py-20" glow="bottom-left">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-start">
          <div>
            <p className="uppercase-tracked text-caption text-rosso-base mb-2">
              Riconoscimenti
            </p>
            <h2 className="font-display text-h2 text-crema-base text-balance">
              {heading ?? "Tre premi in quattro anni."}
            </h2>
          </div>
          <Reveal
            as="ul"
            className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            {premi.map((p) => (
              <li
                key={p._id}
                className="border border-rosso-base/40 hover:border-rosso-base p-6 transition-colors duration-base bg-nero-base"
              >
                <div className="font-display text-h2 text-rosso-base leading-none">
                  {p.anno ?? ""}
                </div>
                <div className="mt-3 text-body text-crema-base font-semibold">
                  {p.nomePremio}
                  {p.rassegna && (
                    <span className="text-crema-muted font-normal">
                      {" "}
                      · {p.rassegna}
                    </span>
                  )}
                </div>
                {p.spettacoloAssociato?.titolo && (
                  <div className="mt-1 text-body-s text-crema-muted italic">
                    {p.spettacoloAssociato.titolo}
                  </div>
                )}
                {p.motivazione && (
                  <p className="mt-4 text-caption text-crema-muted leading-relaxed">
                    “{p.motivazione}”
                  </p>
                )}
              </li>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default StripPremi;
