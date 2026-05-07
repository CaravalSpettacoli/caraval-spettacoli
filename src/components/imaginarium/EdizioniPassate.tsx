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
}) {
  if (!edizioni || edizioni.length === 0) return null;
  return (
    <section className="py-16 md:py-20 bg-crema-bright text-nero-base border-t border-rosso-deep/20">
      <Container>
        <h2 className="text-center font-display text-display-m text-rosso-deep">
          Edizioni passate
        </h2>
        <ul
          role="list"
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[820px] mx-auto"
        >
          {edizioni.map((e) => (
            <li
              key={e._id}
              className="border border-rosso-deep/30 hover:border-rosso-deep bg-crema-base p-6 transition-colors duration-base"
            >
              <div
                className="font-display text-rosso-deep leading-none"
                style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}
              >
                {e.anno}
              </div>
              {e.titoloEdizione && (
                <p className="mt-3 text-body font-semibold text-nero-base">
                  {e.titoloEdizione}
                </p>
              )}
              <p className="mt-2 text-body-s text-nero-base/75">
                {e.descrizioneBreve ?? "Programma in caricamento."}
              </p>
              <a
                href={`/imaginarium/${e.anno}`}
                className="mt-4 inline-flex items-center text-body-s text-rosso-deep underline underline-offset-4 hover:text-rosso-base"
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
