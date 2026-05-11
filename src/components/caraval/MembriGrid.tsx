import Image from "next/image";
import { User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";

export type MembroItem = {
  _id: string;
  nome?: string;
  ruoli?: string[];
  bioBreve?: string;
  foto?: { asset?: { _ref?: string }; alt?: string };
  ordinamento?: number;
};

export function MembriGrid({
  eyebrow,
  heading,
  intro,
  membri,
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  membri: MembroItem[];
}) {
  const sorted = [...(membri ?? [])].sort(
    (a, b) => (a.ordinamento ?? 99) - (b.ordinamento ?? 99)
  );
  if (sorted.length === 0) return null;

  return (
    <section
      data-theme="dark"
      className="bg-nero-soft text-crema-base"
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
          {intro && (
            <p className="mt-4 text-body-l text-crema-muted">{intro}</p>
          )}
        </div>

        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {sorted.map((m) => {
            const fotoUrl =
              m.foto?.asset?._ref &&
              urlFor(m.foto as Parameters<typeof urlFor>[0])
                .width(700)
                .height(875)
                .fit("crop")
                .url();
            return (
              <li key={m._id} className="text-left">
                <div
                  className="relative w-full overflow-hidden bg-rosso-muted"
                  style={{ aspectRatio: "4/5" }}
                >
                  {fotoUrl ? (
                    <Image
                      src={fotoUrl}
                      alt={m.foto?.alt ?? m.nome ?? ""}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center bg-rosso-deep/15"
                    >
                      <User
                        size={64}
                        strokeWidth={1.2}
                        className="text-rosso-base/45"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-5">
                  <h3 className="font-display text-h3 text-crema-base leading-tight">
                    {m.nome}
                  </h3>
                  {m.ruoli && m.ruoli.length > 0 && (
                    <p className="mt-1 uppercase-tracked text-caption text-rosso-base/90">
                      {m.ruoli.join(" · ")}
                    </p>
                  )}
                  {m.bioBreve && (
                    <p className="mt-3 text-body-s text-crema-base/85 leading-relaxed">
                      {m.bioBreve}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default MembriGrid;
