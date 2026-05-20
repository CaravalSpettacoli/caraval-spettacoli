import { Container } from "@/components/ui/Container";
import { OndaDecorativa } from "@/components/decorative/OndaDecorativa";

export type StepIngaggio = {
  numero?: string;
  titolo?: string;
  descrizione?: string;
};

export function ProcessoIngaggio({
  eyebrow,
  heading,
  step,
}: {
  eyebrow?: string;
  heading?: string;
  step: StepIngaggio[];
}) {
  if (!step || step.length === 0) return null;

  return (
    <section
      data-theme="dark"
      className="bg-nero-soft text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex justify-center mb-4">
            <OndaDecorativa
              width={120}
              variant="sottile"
              className="text-rosso-base/50"
            />
          </div>
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

        <div className="relative">
          {/* Linea connessione desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-rosso-base/0 via-rosso-base/40 to-rosso-base/0"
          />
          <ol
            role="list"
            className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
          >
            {step.map((s, i) => (
              <li key={i} className="text-center md:text-left">
                <div className="flex md:flex-col items-center md:items-start gap-4">
                  <span
                    className="font-display text-rosso-hover leading-none bg-nero-base px-2"
                    style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
                  >
                    {s.numero}
                  </span>
                  <h3 className="font-display text-h3 text-crema-base leading-tight md:mt-4">
                    {s.titolo}
                  </h3>
                </div>
                <p className="mt-3 text-body text-crema-muted leading-relaxed">
                  {s.descrizione}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export default ProcessoIngaggio;
