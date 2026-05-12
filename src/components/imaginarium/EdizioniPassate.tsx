import { Container } from "@/components/ui/Container";

export type EdizionePassataItem = {
  _id: string;
  anno?: number;
  titoloEdizione?: string;
  descrizioneBreve?: string;
};

export function EdizioniPassate({
  edizioni,
}: {
  edizioni: EdizionePassataItem[] | null;
  /** Prop legacy mantenuta solo per back-compat call-site; ignorata (Hotfix 1). */
  palette?: "default" | "rosso";
}) {
  if (!edizioni || edizioni.length === 0) return null;
  // Hotfix 1: palette light = rosso pieno con bgSoft per alternanza.
  // Entrambe le palette (default e rosso) ora convergono al rosso su Imaginarium.
  const inlineBg = "#a8174a"; // bg rosso saturo
  const sectionBg = "text-crema-base border-t border-crema-base/20";
  const headingCol = "text-crema-bright";
  const cardCls =
    "border border-crema-base/30 hover:border-crema-base bg-rosso-deep/30";
  const annoCol = "text-crema-bright";
  const titoloCol = "text-crema-bright";
  const bodyCol = "text-crema-base/85";
  const linkCol = "text-crema-base hover:text-crema-bright";

  return (
    <section
      data-theme="light"
      className={sectionBg}
      style={{
        backgroundColor: inlineBg,
        paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))",
      }}
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
