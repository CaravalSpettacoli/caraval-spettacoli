import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";

export type PatrocinioCategoria = "patrocinio" | "sponsor" | "partner";

export type PatrocinioItem = {
  _key?: string;
  categoria?: PatrocinioCategoria;
  nome: string;
  logo?: { asset?: { _ref?: string }; alt?: string };
  url?: string;
};

type Palette = "dark" | "light";

const CATEGORIA_LABEL: Record<PatrocinioCategoria, string> = {
  patrocinio: "Con il patrocinio di",
  sponsor: "Sponsor",
  partner: "Partner",
};

const ORDINE: PatrocinioCategoria[] = ["patrocinio", "sponsor", "partner"];

/** Patrocini/sponsor/partner grouped in 3 sezioni distinte.
 *
 *  Hotfix Finale 2: separazione esplicita per categoria, ognuno col proprio
 *  titolo. Patrocinio centrato (di solito 1 logo), sponsor compatto, partner
 *  grid auto-fit. Hover overlay con nome ente da destra. */
export function PatrociniStrip({
  patrocini,
  eyebrow,
  palette = "dark",
}: {
  patrocini: PatrocinioItem[] | null;
  /** Backwards-compatible: se passato sovrascrive il primo gruppo "patrocinio". */
  eyebrow?: string;
  palette?: Palette;
}) {
  if (!patrocini || patrocini.length === 0) return null;

  // Solo entries con logo (placeholder testuali sono filtrati)
  const conLogo = patrocini.filter((p) => p.logo?.asset?._ref);
  if (conLogo.length === 0) return null;

  // Raggruppa per categoria, preservando l'ordine fisso
  const gruppi = ORDINE.map((cat) => ({
    categoria: cat,
    label: cat === "patrocinio" && eyebrow ? eyebrow : CATEGORIA_LABEL[cat],
    items: conLogo.filter((p) => (p.categoria ?? "partner") === cat),
  })).filter((g) => g.items.length > 0);

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
        <div className="space-y-12 md:space-y-16">
          {gruppi.map((gruppo) => (
            <div key={gruppo.categoria}>
              <p
                className={`uppercase-tracked text-caption text-center mb-8 ${
                  isLight ? "text-crema-base/85" : "text-rosso-base"
                }`}
              >
                {gruppo.label}
              </p>
              <PatrociniGrid items={gruppo.items} categoria={gruppo.categoria} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PatrociniGrid({
  items,
  categoria,
}: {
  items: PatrocinioItem[];
  categoria: PatrocinioCategoria;
}) {
  // Patrocinio (1 ente in genere): griglia stretta centrata
  // Sponsor (1-3 enti): griglia media
  // Partner (3-5 enti): griglia ampia
  const gridClass =
    categoria === "patrocinio"
      ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 max-w-xs sm:max-w-sm md:max-w-md mx-auto gap-4 md:gap-6"
      : categoria === "sponsor"
        ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 max-w-2xl mx-auto gap-4 md:gap-6"
        : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6";

  return (
    <ul role="list" className={`${gridClass} items-stretch`}>
      {items.map((p, idx) => {
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
          <li key={p._key ?? `${categoria}-${idx}`}>
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
  );
}

export default PatrociniStrip;
