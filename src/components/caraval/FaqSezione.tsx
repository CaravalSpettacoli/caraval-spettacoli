import { Container } from "@/components/ui/Container";

export type FaqItem = { domanda?: string; risposta?: string };

export function FaqSezione({
  items,
  eyebrow = "DOMANDE FREQUENTI",
  heading = "Le risposte alle domande più comuni",
}: {
  items?: FaqItem[] | null;
  eyebrow?: string;
  heading?: string;
}) {
  const valid = (items ?? []).filter(
    (f): f is Required<FaqItem> => Boolean(f?.domanda && f?.risposta),
  );
  if (valid.length === 0) return null;

  return (
    <section
      data-theme="dark"
      className="bg-nero-base text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container width="narrow">
        <div className="text-center mb-10 md:mb-14">
          <p className="uppercase-tracked text-caption text-rosso-base/90 mb-3">
            {eyebrow}
          </p>
          <h2 className="font-display text-display-m leading-tight text-balance">
            {heading}
          </h2>
        </div>
        <ul className="divide-y divide-crema-faint/20 border-y border-crema-faint/20">
          {valid.map((f, i) => (
            <li key={i}>
              <details className="group">
                <summary
                  className="flex items-start justify-between gap-6 cursor-pointer list-none py-5 md:py-6 select-none focus-visible:outline-none focus-visible:bg-crema-faint/5"
                >
                  <span className="font-display text-h4 md:text-h3 leading-snug text-crema-bright">
                    {f.domanda}
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 flex-shrink-0 text-rosso-base text-2xl leading-none transition-transform duration-base group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-10 text-body-l text-crema-muted whitespace-pre-line leading-relaxed">
                  {f.risposta}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default FaqSezione;
