import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export type CitazioneItem = {
  _key?: string;
  testo?: string;
  fonte?: string;
  data?: string;
};

export function CitazioniStampaList({
  citazioni,
}: {
  citazioni?: CitazioneItem[] | null;
}) {
  if (!citazioni || citazioni.length === 0) return null;
  return (
    <Section background="nero-soft">
      <Container width="narrow">
        <h2 className="uppercase-tracked text-caption text-rosso-base mb-8 text-center">
          Stampa
        </h2>
        <ul role="list" className="space-y-10">
          {citazioni.map((c, i) => (
            <li
              key={c._key ?? i}
              className="relative pl-10 md:pl-16"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 font-display text-display-l text-rosso-base/40 leading-none select-none"
                style={{ lineHeight: 0.9 }}
              >
                “
              </span>
              <p className="font-display text-h3 md:text-h2 text-crema-base italic leading-tight">
                {c.testo}
              </p>
              {(c.fonte || c.data) && (
                <p className="mt-4 text-body-s text-crema-muted uppercase-tracked">
                  {c.fonte}
                  {c.fonte && c.data && " · "}
                  {c.data && new Date(c.data).getFullYear()}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export default CitazioniStampaList;
