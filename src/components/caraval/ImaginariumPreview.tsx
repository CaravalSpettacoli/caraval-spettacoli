import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export type EdizioneCorrente = {
  anno?: number;
  titoloEdizione?: string;
  dataInizio?: string;
  dataFine?: string;
  locationPrincipale?: string;
  patrocinio?: string[];
  sponsor?: string[];
  partnerLista?: string[];
};

export type SpettacoloImag = {
  _id: string;
  titolo?: string;
  dataInizio?: string;
  compagnia?: { nome?: string; urlSitoCompagnia?: string };
  linkCompagniaEsterna?: string;
};

const MESI = [
  "gen",
  "feb",
  "mar",
  "apr",
  "mag",
  "giu",
  "lug",
  "ago",
  "set",
  "ott",
  "nov",
  "dic",
];
const GIORNI = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];

function formatData(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const giorno = GIORNI[d.getDay()];
  const num = d.getDate();
  const mese = MESI[d.getMonth()];
  const ore = d.getHours();
  const min = d.getMinutes();
  const oraStr =
    min === 0 ? `ore ${ore}` : `ore ${ore}.${min.toString().padStart(2, "0")}`;
  return `${giorno.charAt(0).toUpperCase() + giorno.slice(1)} ${num} ${mese} · ${oraStr}`;
}

function formatRangeDate(inizio?: string, fine?: string): string {
  if (!inizio || !fine) return "";
  const a = new Date(inizio);
  const b = new Date(fine);
  const meseA = MESI[a.getMonth()];
  const meseB = MESI[b.getMonth()];
  const annoB = b.getFullYear();
  if (meseA === meseB) {
    return `${a.getDate()} — ${b.getDate()} ${meseB} ${annoB}`;
  }
  return `${a.getDate()} ${meseA} — ${b.getDate()} ${meseB} ${annoB}`;
}

export function ImaginariumPreview({
  edizione,
  spettacoli,
  body,
  ctaTesto,
}: {
  edizione: EdizioneCorrente | null;
  spettacoli: SpettacoloImag[] | null;
  body?: string;
  ctaTesto?: string;
}) {
  if (!edizione) return null;
  const dateRange = formatRangeDate(edizione.dataInizio, edizione.dataFine);

  return (
    <section
      data-theme="light"
      className="text-crema-base"
      style={{
        backgroundColor: "#a8174a",
        paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))",
      }}
    >
      <Container>
        <div className="text-center">
          <p className="uppercase-tracked text-caption text-crema-base/80">
            Festival
          </p>
          <h2
            className="font-display text-crema-bright mt-3 leading-none"
            style={{ fontSize: "clamp(3rem, 9vw, 7rem)", letterSpacing: "0.02em" }}
          >
            IMAGINARIUM
          </h2>
          <p className="mt-4 text-body-l text-crema-base">
            Festival di Teatro Itinerante
          </p>
          {(dateRange || edizione.locationPrincipale) && (
            <p className="mt-1 text-body text-crema-base/80">
              {edizione.locationPrincipale}
              {edizione.locationPrincipale && dateRange && " · "}
              {dateRange}
            </p>
          )}
          {body && (
            <p className="mt-6 max-w-[700px] mx-auto text-body text-crema-base/85">
              {body}
            </p>
          )}
        </div>

        {spettacoli && spettacoli.length > 0 && (
          <ul
            role="list"
            className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {spettacoli.map((s) => {
              const linkCompagnia =
                s.linkCompagniaEsterna ?? s.compagnia?.urlSitoCompagnia;
              return (
                <li
                  key={s._id}
                  className="border border-crema-base/20 hover:border-crema-base/50 p-5 transition-colors duration-base"
                  style={{ backgroundColor: "rgba(139, 14, 58, 0.5)" }}
                >
                  <div className="font-display text-h4 text-crema-bright leading-tight">
                    {formatData(s.dataInizio)}
                  </div>
                  <div className="mt-2 text-body font-semibold text-crema-bright">
                    {s.titolo}
                  </div>
                  {s.compagnia?.nome && (
                    <div className="mt-1 text-body-s text-crema-base/75 italic">
                      {linkCompagnia ? (
                        <a
                          href={linkCompagnia}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="hover:text-crema-bright underline underline-offset-4 decoration-crema-base/40"
                        >
                          {s.compagnia.nome}
                        </a>
                      ) : (
                        s.compagnia.nome
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Strip patrocinio / sponsor / partner */}
        <div className="mt-12 border-t border-crema-base/20 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-body-s">
          {edizione.patrocinio && edizione.patrocinio.length > 0 && (
            <div>
              <p className="uppercase-tracked text-caption text-crema-base/80">
                Con il patrocinio di
              </p>
              <p className="mt-1 text-crema-base">
                {edizione.patrocinio.join(" · ")}
              </p>
            </div>
          )}
          {edizione.sponsor && edizione.sponsor.length > 0 && (
            <div>
              <p className="uppercase-tracked text-caption text-crema-base/80">
                Sponsor
              </p>
              <p className="mt-1 text-crema-base">
                {edizione.sponsor.join(" · ")}
              </p>
            </div>
          )}
          {edizione.partnerLista && edizione.partnerLista.length > 0 && (
            <div>
              <p className="uppercase-tracked text-caption text-crema-base/80">
                Partner
              </p>
              <p className="mt-1 text-crema-base">
                {edizione.partnerLista.join(" · ")}
              </p>
            </div>
          )}
        </div>

        {ctaTesto && (
          <div className="mt-12 text-center">
            <Button
              as="link"
              href="/imaginarium"
              variant="primary"
              size="lg"
              className="!bg-nero-base hover:!bg-nero-soft text-crema-base"
            >
              {ctaTesto}
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

export default ImaginariumPreview;
