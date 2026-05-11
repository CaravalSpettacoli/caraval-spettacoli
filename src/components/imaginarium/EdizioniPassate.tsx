import { Container } from "@/components/ui/Container";

export type EdizionePassataItem = {
  _id: string;
  anno?: number;
  titoloEdizione?: string;
  descrizioneBreve?: string;
};

export function EdizioniPassate({
  edizioni,
  palette = "default",
}: {
  edizioni: EdizionePassataItem[] | null;
  palette?: "default" | "rosso";
}) {
  if (!edizioni || edizioni.length === 0) return null;
  const isRosso = palette === "rosso";
  const sectionBg = isRosso
    ? "bg-rosso-base text-crema-base"
    : "bg-crema-bright text-nero-base border-t border-rosso-deep/20";
  const headingCol = isRosso ? "text-crema-bright" : "text-rosso-deep";
  const cardCls = isRosso
    ? "border border-crema-base/30 hover:border-crema-base bg-rosso-deep/30"
    : "border border-rosso-deep/30 hover:border-rosso-deep bg-crema-base";
  const annoCol = isRosso ? "text-crema-bright" : "text-rosso-deep";
  const titoloCol = isRosso ? "text-crema-bright" : "text-nero-base";
  const bodyCol = isRosso ? "text-crema-base/85" : "text-nero-base/75";
  const linkCol = isRosso
    ? "text-crema-base hover:text-crema-bright"
    : "text-rosso-deep hover:text-rosso-base";

  return (
    <section
      data-theme={isRosso ? "accent" : "light"}
      className={sectionBg}
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        <h2 className={`text-center font-display text-display-m ${headingCol}`}>
          Edizioni passate
        </h2>
        <ul
          role="list"
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[820px] mx-auto"
        >
          {edizioni.map((e) => (
            <li
              key={e._id}
              className={`${cardCls} p-6 transition-colors duration-base`}
            >
              <div
                className={`font-display leading-none ${annoCol}`}
                style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}
              >
                {e.anno}
              </div>
              {e.titoloEdizione && (
                <p className={`mt-3 text-body font-semibold ${titoloCol}`}>
                  {e.titoloEdizione}
                </p>
              )}
              <p className={`mt-2 text-body-s ${bodyCol}`}>
                {e.descrizioneBreve ?? "Programma in caricamento."}
              </p>
              <a
                href={`/imaginarium/${e.anno}`}
                className={`mt-4 inline-flex items-center text-body-s underline underline-offset-4 ${linkCol}`}
              >
                Scopri →
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default EdizioniPassate;
