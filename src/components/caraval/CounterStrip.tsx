import { Container } from "@/components/ui/Container";

export type CounterItem = { valore: string; etichetta: string };

export interface CounterStripProps {
  eyebrow?: string;
  numeri: CounterItem[];
  palette?: "default" | "imaginarium";
}

export function CounterStrip({
  eyebrow,
  numeri,
  palette = "default",
}: CounterStripProps) {
  if (!numeri || numeri.length === 0) return null;
  const isImag = palette === "imaginarium";

  const bg = isImag ? "bg-crema-base text-nero-base" : "bg-nero-base text-crema-base";
  const eyebrowCol = isImag ? "text-rosso-deep/80" : "text-rosso-base/90";
  const valoreCol = isImag ? "text-rosso-deep" : "text-rosso-hover";
  const etichettaCol = isImag ? "text-nero-base/65" : "text-crema-base/80";
  const sepCol = isImag ? "bg-rosso-deep/15" : "bg-crema-faint/30";

  return (
    <section
      className={`relative ${bg}`}
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        {eyebrow && (
          <p
            className={`text-center uppercase-tracked text-caption mb-12 ${eyebrowCol}`}
          >
            {eyebrow}
          </p>
        )}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0 relative"
          role="list"
        >
          {numeri.map((n, i) => (
            <li
              key={`${n.etichetta}-${i}`}
              className="text-center relative"
            >
              <span
                className={`block font-display leading-none ${valoreCol}`}
                style={{
                  fontSize: "clamp(3rem, 7vw, 5rem)",
                  letterSpacing: "0.01em",
                }}
              >
                {n.valore}
              </span>
              <span
                className={`mt-3 block text-caption uppercase-tracked ${etichettaCol}`}
              >
                {n.etichetta}
              </span>
              {i < numeri.length - 1 && (
                <span
                  aria-hidden
                  className={`hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 ${sepCol}`}
                />
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default CounterStrip;
