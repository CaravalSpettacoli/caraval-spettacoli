import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  SpettacoloCardLarge,
  type SpettacoloCardLargeData,
} from "@/components/caraval/SpettacoloCardLarge";

export function SpettacoliCorrelati({
  correlati,
}: {
  correlati: SpettacoloCardLargeData[] | null;
}) {
  if (!correlati || correlati.length === 0) return null;
  return (
    <Section background="nero">
      <Container>
        <h2 className="uppercase-tracked text-caption text-rosso-base mb-2">
          Continua a esplorare
        </h2>
        <p className="font-display text-h2 text-crema-base mb-10">
          Spettacoli correlati
        </p>
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {correlati.map((s) => (
            <li key={s._id}>
              <SpettacoloCardLarge spettacolo={s} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export default SpettacoliCorrelati;
