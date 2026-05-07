import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export type ContattiCopy = {
  contattiHeading?: string;
  contattiBody?: string;
};

export type ContattiPubblici = {
  email?: string;
  telefono?: string;
};

function pulisciTel(tel?: string) {
  if (!tel) return "";
  return tel.replace(/\s+/g, "");
}

export function ContattiPrelude({
  copy,
  contatti,
}: {
  copy: ContattiCopy | null;
  contatti: ContattiPubblici | null;
}) {
  if (!copy && !contatti) return null;
  const email = contatti?.email;
  const telefono = contatti?.telefono;

  return (
    <Section background="nero">
      <Container>
        <div className="text-center max-w-[720px] mx-auto">
          {copy?.contattiHeading && (
            <h2 className="font-display text-display-m text-crema-base text-balance">
              {copy.contattiHeading}
            </h2>
          )}
          {copy?.contattiBody && (
            <p className="mt-4 text-body-l text-crema-muted">
              {copy.contattiBody}
            </p>
          )}
        </div>

        {(email || telefono) && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-[820px] mx-auto">
            {email && (
              <a
                href={`mailto:${email}`}
                className="group flex flex-col items-center justify-center text-center border border-rosso-base/60 hover:border-rosso-base bg-nero-soft hover:bg-rosso-muted transition-colors duration-base p-8"
              >
                <span className="uppercase-tracked text-caption text-rosso-base">
                  Scrivici
                </span>
                <span className="mt-3 font-display text-h3 text-crema-base group-hover:text-crema-bright break-all">
                  {email}
                </span>
              </a>
            )}
            {telefono && (
              <a
                href={`tel:${pulisciTel(telefono)}`}
                className="group flex flex-col items-center justify-center text-center border border-rosso-base/60 hover:border-rosso-base bg-nero-soft hover:bg-rosso-muted transition-colors duration-base p-8"
              >
                <span className="uppercase-tracked text-caption text-rosso-base">
                  Chiamaci
                </span>
                <span className="mt-3 font-display text-h3 text-crema-base group-hover:text-crema-bright">
                  {telefono}
                </span>
              </a>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}

export default ContattiPrelude;
