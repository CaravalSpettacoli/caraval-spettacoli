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
        {/* Hotfix Finale 3: 3 colonne orizzontali affiancate da md+, stack mobile. */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8 md:gap-x-10 items-start max-w-5xl mx-auto"
        >
          {gruppi.map((gruppo) => (
            <div key={gruppo.categoria} className="flex flex-col items-center">
              <p
                className={`uppercase-tracked text-caption text-center mb-6 ${
                  isLight ? "text-crema-base/85" : "text-rosso-base"
                }`}
              >
                {gruppo.label}
              </p>
              <PatrociniColonna items={gruppo.items} categoria={gruppo.categoria} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PatrociniColonna({
  items,
  categoria,
}: {
  items: PatrocinioItem[];
  categoria: PatrocinioCategoria;
}) {
  // Una sola colonna: i loghi all'interno si dispongono in flex-wrap centrato.
  // Lo stesso box (140px) per tutte le categorie → simmetria visiva.
  return (
    <ul
      role="list"
      className="flex flex-wrap justify-center items-stretch gap-3 md:gap-4 w-full"
    >
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
          <li
            key={p._key ?? `${categoria}-${idx}`}
            className="w-[130px] sm:w-[140px] flex-shrink-0"
          >
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
