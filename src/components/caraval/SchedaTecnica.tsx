import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export type SchedaTecnicaData = {
  durataMinuti?: number;
  numeroAttori?: string;
  spazioScenico?: string;
  audio?: string;
  pubblicoTarget?: string;
  noteTecniche?: string;
} | null;

function isEmpty(s?: SchedaTecnicaData) {
  if (!s) return true;
  return !(
    s.durataMinuti ||
    s.numeroAttori ||
    s.spazioScenico ||
    s.audio ||
    s.pubblicoTarget ||
    s.noteTecniche
  );
}

function Riga({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-1 md:gap-6 py-3 border-b border-crema-faint last:border-b-0">
      <dt className="uppercase-tracked text-caption text-rosso-base">{label}</dt>
      <dd className="text-body text-crema-base">{value}</dd>
    </div>
  );
}

export function SchedaTecnica({ scheda }: { scheda: SchedaTecnicaData }) {
  if (isEmpty(scheda)) return null;
  const s = scheda!;
  return (
    <Section background="nero-soft">
      <Container width="narrow">
        <h2 className="uppercase-tracked text-caption text-rosso-base mb-2">
          Scheda tecnica
        </h2>
        <p className="font-display text-h3 text-crema-base mb-8">
          Cosa serve per ospitarci
        </p>
        <dl>
          <Riga
            label="Durata"
            value={
              s.durataMinuti ? `${s.durataMinuti} minuti` : undefined
            }
          />
          <Riga label="Attori in scena" value={s.numeroAttori} />
          <Riga label="Spazio scenico" value={s.spazioScenico} />
          <Riga label="Audio / impianto" value={s.audio} />
          <Riga label="Pubblico" value={s.pubblicoTarget} />
          <Riga label="Note tecniche" value={s.noteTecniche} />
        </dl>
      </Container>
    </Section>
  );
}

export default SchedaTecnica;
