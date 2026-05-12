import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";

export type PatrocinioItem = {
  _key?: string;
  nome: string;
  logo?: { asset?: { _ref?: string }; alt?: string };
  url?: string;
};

export function PatrociniStrip({
  patrocini,
  eyebrow = "Partner & patrocini",
}: {
  patrocini: PatrocinioItem[] | null;
  eyebrow?: string;
}) {
  if (!patrocini || patrocini.length === 0) return null;

  return (
    <section
      data-theme="dark"
      className="bg-nero-base text-crema-base"
      style={{
        paddingBlock: "var(--space-block-y, clamp(2rem, 4vw, 4rem))",
      }}
    >
      <Container>
        <p className="uppercase-tracked text-caption text-rosso-base text-center mb-8">
          {eyebrow}
        </p>
        <ul
          role="list"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 items-center"
        >
          {patrocini.map((p, idx) => {
            const fotoUrl =
              p.logo?.asset?._ref &&
              urlFor(p.logo as Parameters<typeof urlFor>[0])
                .width(400)
                .height(160)
                .fit("max")
                .url();

            const inner = fotoUrl ? (
              <div className="relative w-full h-20">
                <Image
                  src={fotoUrl}
                  alt={p.logo?.alt ?? p.nome}
                  fill
                  sizes="(min-width: 768px) 20vw, 40vw"
                  className="object-contain"
                />
              </div>
            ) : (
              <div
                className="w-full h-20 border border-rosso-base/30 flex items-center justify-center px-3 text-center"
                style={{ backgroundColor: "rgba(168, 23, 74, 0.08)" }}
              >
                <span className="font-display text-caption text-crema-base/70 leading-tight">
                  {p.nome}
                </span>
              </div>
            );

            const wrapperClass =
              "block transition-transform duration-base hover:scale-105";

            return (
              <li key={p._key ?? idx}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={p.nome}
                    className={wrapperClass}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={wrapperClass}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default PatrociniStrip;
