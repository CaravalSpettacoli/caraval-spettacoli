import { Container } from "@/components/ui/Container";
import type { PremioItem } from "@/components/caraval/StripPremi";

export function PremiSezione({
  eyebrow,
  heading,
  premi,
}: {
  eyebrow?: string;
  heading?: string;
  premi: PremioItem[];
}) {
  if (!premi || premi.length === 0) return null;

  return (
    <section
      data-theme="dark"
      className="bg-nero-base text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        <div className="max-w-2xl mb-12">
          {eyebrow && (
            <p className="uppercase-tracked text-caption text-rosso-base/90 mb-3">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="font-display text-h1 text-crema-base leading-tight text-balance">
              {heading}
            </h2>
          )}
        </div>

        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {premi.map((p) => (
            <li key={p._id} className="h-full">
              <article className="h-full flex flex-col gap-3 p-6 md:p-8 bg-nero-soft border border-rosso-base/40">
                <span
                  className="font-display text-rosso-hover leading-none"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
                >
                  {p.anno}
                </span>
                <h3 className="font-display text-h4 text-crema-base leading-tight">
                  {p.nomePremio}
                </h3>
                {p.rassegna && (
                  <p className="text-body-s text-crema-muted italic">
                    {p.rassegna}
                  </p>
                )}
                {p.spettacoloAssociato?.titolo && (
                  <p className="mt-auto text-body-s text-crema-base/85">
                    {p.spettacoloAssociato.titolo}
                  </p>
                )}
                {p.motivazione && (
                  <p className="text-caption text-crema-muted leading-relaxed">
                    {p.motivazione}
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default PremiSezione;
