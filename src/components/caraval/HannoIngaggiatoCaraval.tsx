import { Container } from "@/components/ui/Container";

export function HannoIngaggiatoCaraval({
  eyebrow,
  enti,
}: {
  eyebrow?: string;
  enti: string[];
}) {
  if (!enti || enti.length === 0) return null;

  return (
    <section
      data-theme="dark"
      className="bg-nero-soft text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          {eyebrow && (
            <p className="uppercase-tracked text-caption text-rosso-base/90 mb-6">
              {eyebrow}
            </p>
          )}
          <p
            className="font-display text-crema-base/85 leading-relaxed text-balance"
            style={{ fontSize: "clamp(1.125rem, 2vw, 1.5rem)" }}
          >
            {enti.map((e, i) => (
              <span key={i}>
                {e}
                {i < enti.length - 1 && (
                  <span aria-hidden className="text-rosso-base mx-3">
                    ·
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      </Container>
    </section>
  );
}

export default HannoIngaggiatoCaraval;
