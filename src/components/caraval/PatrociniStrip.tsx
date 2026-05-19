import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";

export type PatrocinioItem = {
  _key?: string;
  nome: string;
  logo?: { asset?: { _ref?: string }; alt?: string };
  url?: string;
};

type Palette = "dark" | "light";

/** Strip patrocini/sponsor/partner con loghi.
 *
 *  Hotfix 4: usato in /imaginarium con `palette="light"` (sfondo rosso saturo
 *  della pagina). I loghi PNG hanno sfondo bianco proprio, quindi vanno
 *  inseriti in box bianchi/crema per non perderne la leggibilità.
 *  Aspect-ratio 4/3 fisso → tutti i box hanno stessa dimensione.
 *  object-fit: contain → i loghi non vengono tagliati. */
export function PatrociniStrip({
  patrocini,
  eyebrow = "Partner & patrocini",
  palette = "dark",
}: {
  patrocini: PatrocinioItem[] | null;
  eyebrow?: string;
  palette?: Palette;
}) {
  if (!patrocini || patrocini.length === 0) return null;

  // Filtra entries senza logo (placeholder testuali) — non li mostriamo più
  // visivamente. Il fix completo dei duplicati va fatto manualmente in Studio.
  const conLogo = patrocini.filter((p) => p.logo?.asset?._ref);
  if (conLogo.length === 0) return null;

  const isLight = palette === "light";

  return (
    <section
      data-theme={isLight ? "light" : "dark"}
      className={isLight ? "text-crema-base" : "bg-nero-base text-crema-base"}
      style={{
        paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))",
        ...(isLight ? { backgroundColor: "#a8174a" } : {}),
      }}
    >
      <Container>
        <p
          className={`uppercase-tracked text-caption text-center mb-10 ${
            isLight ? "text-crema-base/85" : "text-rosso-base"
          }`}
        >
          {eyebrow}
        </p>
        <ul
          role="list"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 items-stretch"
        >
          {conLogo.map((p, idx) => {
            // Hotfix pre-golive: aumentata risoluzione (era 400×300 con .fit("max") che
            // poteva sgranare loghi piccoli). Ora 600 px lato lungo, fit("max") preserva
            // proporzioni originali senza tagli.
            const fotoUrl =
              p.logo?.asset?._ref &&
              urlFor(p.logo as Parameters<typeof urlFor>[0])
                .width(600)
                .fit("max")
                .url();

            const box = (
              <div
                className="logo-box group relative flex items-center justify-center rounded-md overflow-hidden transition-shadow duration-base hover:shadow-md"
                style={{
                  backgroundColor: "#ffffff",
                  aspectRatio: "4 / 3",
                  padding: "0.75rem",
                }}
                title={p.nome}
              >
                {fotoUrl && (
                  <>
                    {/* Hotfix Finale: <img> nativo + width/height 100% + object-contain
                        garantisce uniformità visiva — ogni logo riempie lo spazio max
                        possibile mantenendo proporzioni. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fotoUrl}
                      alt={p.logo?.alt ?? p.nome}
                      loading="lazy"
                      decoding="async"
                      className="logo-box-img"
                    />
                    <div className="logo-hover-overlay" aria-hidden>
                      <span className="font-display">{p.nome}</span>
                    </div>
                  </>
                )}
              </div>
            );

            return (
              <li key={p._key ?? idx}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={p.nome}
                    className="block h-full"
                  >
                    {box}
                  </a>
                ) : (
                  box
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
