import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";

export type Testimonianza = {
  citazione?: string;
  autore?: string;
  ente?: string;
};

export function TestimonianzeStrip({
  eyebrow,
  heading,
  testimonianze,
}: {
  eyebrow?: string;
  heading?: string;
  testimonianze: Testimonianza[];
}) {
  if (!testimonianze || testimonianze.length === 0) return null;

  return (
    <section
      className="bg-nero-base text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-14">
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
          {testimonianze.map((t, i) => (
            <li
              key={i}
              className="flex flex-col gap-4 p-6 md:p-8 bg-nero-soft border border-crema-faint/30"
            >
              <Quote
                size={32}
                strokeWidth={1.4}
                className="text-rosso-base/70 -ml-1"
                aria-hidden
              />
              <blockquote className="text-body italic text-crema-base/90 leading-relaxed">
                {t.citazione}
              </blockquote>
              <footer className="mt-auto pt-4 border-t border-crema-faint/30">
                {t.autore && (
                  <p className="text-body-s font-semibold text-crema-base">
                    {t.autore}
                  </p>
                )}
                {t.ente && (
                  <p className="text-caption text-crema-muted mt-0.5">
                    {t.ente}
                  </p>
                )}
              </footer>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default TestimonianzeStrip;
