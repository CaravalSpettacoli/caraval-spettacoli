import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export type SpettacoloRepertorio = {
  _id: string;
  titolo?: string;
  sottotitolo?: string;
  slug?: { current?: string };
  categoria?: "prosa" | "fuoco" | "strada";
  descrizioneBreve?: string;
  ordineHomepage?: number;
};

export type RepertorioCopy = {
  repertorioEyebrow?: string;
  repertorioHeading?: string;
  repertorioIntro?: string;
  repertorioCtaTesto?: string;
  repertorioCtaLink?: string;
};

function ColonnaSpettacoli({
  eyebrow,
  spettacoli,
}: {
  eyebrow: string;
  spettacoli: SpettacoloRepertorio[];
}) {
  if (spettacoli.length === 0) return null;
  return (
    <div>
      <p className="uppercase-tracked text-caption text-rosso-base mb-6">
        {eyebrow}
      </p>
      <ul role="list" className="space-y-5">
        {spettacoli.map((s) => (
          <li
            key={s._id}
            className="border-b border-crema-faint pb-5 last:border-b-0 last:pb-0"
          >
            <a
              href={
                s.slug?.current ? `/spettacoli/${s.slug.current}` : "/spettacoli"
              }
              className="group block"
            >
              <h3 className="font-display text-h3 text-crema-base leading-tight group-hover:text-rosso-base transition-colors duration-base">
                {s.titolo}
              </h3>
              {s.descrizioneBreve && (
                <p className="mt-2 text-body-s text-crema-muted line-clamp-2">
                  {s.descrizioneBreve}
                </p>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RepertorioPreview({
  spettacoli,
  copy,
}: {
  spettacoli: SpettacoloRepertorio[] | null;
  copy: RepertorioCopy | null;
}) {
  if (!spettacoli || spettacoli.length === 0) return null;
  const prosa = spettacoli.filter((s) => s.categoria === "prosa");
  const fuocoEStrada = spettacoli.filter(
    (s) => s.categoria === "fuoco" || s.categoria === "strada"
  );

  return (
    <Section background="nero">
      <Container>
        <div className="text-center max-w-[720px] mx-auto">
          {copy?.repertorioEyebrow && (
            <p className="uppercase-tracked text-caption text-rosso-base">
              {copy.repertorioEyebrow}
            </p>
          )}
          {copy?.repertorioHeading && (
            <h2 className="mt-3 font-display text-display-m text-crema-base text-balance">
              {copy.repertorioHeading}
            </h2>
          )}
          {copy?.repertorioIntro && (
            <p className="mt-4 text-body-l text-crema-muted">
              {copy.repertorioIntro}
            </p>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <ColonnaSpettacoli eyebrow="Prosa contemporanea" spettacoli={prosa} />
          <ColonnaSpettacoli
            eyebrow="Fuoco e strada"
            spettacoli={fuocoEStrada}
          />
        </div>

        {copy?.repertorioCtaTesto && (
          <div className="mt-16 text-center">
            <Button
              as="link"
              href={copy.repertorioCtaLink ?? "/spettacoli"}
              variant="secondary"
              size="lg"
            >
              {copy.repertorioCtaTesto}
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}

export default RepertorioPreview;
