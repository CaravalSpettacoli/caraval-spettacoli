import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export type CastItem = { _key?: string; nome?: string; ruolo?: string };

const RE_ATTORE = /attor/i;

function dividi(cast: CastItem[]) {
  const attori: CastItem[] = [];
  const crediti: CastItem[] = [];
  for (const c of cast) {
    if (c.ruolo && RE_ATTORE.test(c.ruolo)) attori.push(c);
    else crediti.push(c);
  }
  return { attori, crediti };
}

function ListaCrediti({ items, titolo }: { items: CastItem[]; titolo: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="uppercase-tracked text-caption text-rosso-base mb-4">
        {titolo}
      </h3>
      <dl className="space-y-3">
        {items.map((c, i) => (
          <div
            key={c._key ?? `${c.nome}-${i}`}
            className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-1 sm:gap-6 items-baseline"
          >
            <dt className="font-display text-body-l text-crema-base">{c.nome}</dt>
            <dd className="text-body-s text-crema-muted italic">{c.ruolo}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CastECrediti({
  cast,
  regia,
}: {
  cast?: CastItem[] | null;
  regia?: string | null;
}) {
  if (!cast || cast.length === 0) {
    if (!regia) return null;
  }
  const { attori, crediti } = dividi(cast ?? []);

  return (
    <Section background="nero">
      <Container width="narrow">
        <h2 className="uppercase-tracked text-caption text-rosso-base mb-8 text-center">
          Cast e crediti
        </h2>

        {regia && (
          <div className="text-center mb-12 pb-10 border-b border-crema-faint">
            <p className="uppercase-tracked text-caption text-crema-muted">
              Regia
            </p>
            <p className="mt-2 font-display text-h2 text-crema-base">{regia}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ListaCrediti items={attori} titolo="Attori" />
          <ListaCrediti items={crediti} titolo="Crediti tecnici" />
        </div>
      </Container>
    </Section>
  );
}

export default CastECrediti;
