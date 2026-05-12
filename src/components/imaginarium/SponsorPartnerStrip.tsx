import { Container } from "@/components/ui/Container";

export type SponsorPartnerData = {
  patrocinio?: string[];
  sponsor?: string[];
  partnerLista?: string[];
};

export function SponsorPartnerStrip({ data }: { data: SponsorPartnerData | null }) {
  if (!data) return null;
  const { patrocinio, sponsor, partnerLista } = data;
  const haContenuto =
    (patrocinio && patrocinio.length > 0) ||
    (sponsor && sponsor.length > 0) ||
    (partnerLista && partnerLista.length > 0);
  if (!haContenuto) return null;

  return (
    <section
      data-theme="light"
      className="py-12 md:py-16 text-crema-base border-t border-crema-base/20"
      style={{ backgroundColor: "#8a1340" }}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-body-s">
          {patrocinio && patrocinio.length > 0 && (
            <div>
              <p className="uppercase-tracked text-caption text-crema-base/85">
                Con il patrocinio di
              </p>
              <p className="mt-2 text-body text-crema-bright">
                {patrocinio.join(" · ")}
              </p>
            </div>
          )}
          {sponsor && sponsor.length > 0 && (
            <div>
              <p className="uppercase-tracked text-caption text-crema-base/85">
                Sponsor
              </p>
              <p className="mt-2 text-body text-crema-bright">
                {sponsor.join(" · ")}
              </p>
            </div>
          )}
          {partnerLista && partnerLista.length > 0 && (
            <div>
              <p className="uppercase-tracked text-caption text-crema-base/85">
                Partner
              </p>
              <p className="mt-2 text-body text-crema-bright">
                {partnerLista.join(" · ")}
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default SponsorPartnerStrip;
