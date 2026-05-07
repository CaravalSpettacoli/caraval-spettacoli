import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function DescrizioneNarrativa({
  blocks,
}: {
  blocks?: PortableTextBlock[] | null;
}) {
  return (
    <Section background="nero">
      <Container width="narrow">
        {blocks && blocks.length > 0 ? (
          <div className="prose-narrative space-y-6 text-body-l text-crema-base/95 leading-relaxed">
            <PortableText
              value={blocks}
              components={{
                block: {
                  normal: ({ children }) => <p>{children}</p>,
                },
              }}
            />
          </div>
        ) : (
          <p className="italic text-body-l text-crema-muted text-center">
            Descrizione in arrivo.
          </p>
        )}
      </Container>
    </Section>
  );
}

export default DescrizioneNarrativa;
