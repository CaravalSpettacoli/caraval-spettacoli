import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";

type Foto = { asset?: { _ref?: string }; alt?: string };

export function ScuolaMagiaBox({
  eyebrow,
  heading,
  body,
  url,
  foto,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  url?: string;
  foto?: Foto | null;
}) {
  if (!body && !heading) return null;
  const fotoUrl =
    foto?.asset?._ref &&
    urlFor(foto as Parameters<typeof urlFor>[0])
      .width(900)
      .height(1100)
      .fit("crop")
      .url();

  return (
    <section
      className="bg-nero-soft text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-5">
            <div
              className="relative w-full overflow-hidden border border-crema-faint/30"
              style={{ aspectRatio: "4/5" }}
            >
              {fotoUrl ? (
                <Image
                  src={fotoUrl}
                  alt={foto?.alt ?? heading ?? ""}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center bg-nero-deep"
                >
                  <Sparkles
                    size={120}
                    strokeWidth={1}
                    className="text-rosso-base/40"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-7">
            {eyebrow && (
              <p className="uppercase-tracked text-caption text-rosso-base/90 mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display text-h1 text-crema-base leading-tight text-balance">
                {heading}
              </h2>
            )}
            {body && (
              <p className="mt-5 text-body-l text-crema-muted whitespace-pre-line leading-relaxed">
                {body}
              </p>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-crema-base text-crema-base hover:bg-crema-base hover:text-nero-base transition-colors duration-base text-body-s uppercase-tracked font-semibold"
              >
                Visita Scuola di Magia Italiana →
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ScuolaMagiaBox;
