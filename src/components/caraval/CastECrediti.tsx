import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export type CastItem = { _key?: string; nome?: string; ruolo?: string };

/** Combina cast + regia in lista deduplicata "persona → ruoli[]".
 *  Mantiene l'ordine di prima occorrenza. */
function combinaPersone(
  cast: CastItem[],
  regia?: string | null
): Array<{ nome: string; ruoli: string[] }> {
  const map = new Map<string, string[]>();

  if (regia) {
    map.set(regia, ["Regia"]);
  }

  for (const c of cast) {
    if (!c.nome) continue;
    const ruolo = c.ruolo?.trim();
    if (!ruolo) continue;
    const prev = map.get(c.nome) ?? [];
    if (!prev.includes(ruolo)) prev.push(ruolo);
    map.set(c.nome, prev);
  }

  return Array.from(map.entries()).map(([nome, ruoli]) => ({ nome, ruoli }));
}

export function CastECrediti({
  cast,
  regia,
}: {
  cast?: CastItem[] | null;
  regia?: string | null;
}) {
  if ((!cast || cast.length === 0) && !regia) return null;

  const persone = combinaPersone(cast ?? [], regia);

  return (
    <Section background="nero">
      <Container width="narrow">
        <h2 className="uppercase-tracked text-caption text-rosso-base mb-10 text-center">
          Cast e crediti
        </h2>

        <ul role="list" className="divide-y divide-crema-faint/30">
          {persone.map((p, i) => (
            <li
              key={`${p.nome}-${i}`}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 py-4"
            >
              <span className="font-display text-body-l text-crema-base">
                {p.nome}
              </span>
              <span className="text-body-s text-crema-muted italic">
                {p.ruoli.join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export default CastECrediti;
