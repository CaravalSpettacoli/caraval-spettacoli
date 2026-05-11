import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";

type FotoSezione = { asset?: { _ref?: string }; alt?: string };

export function SezioneStoria({
  eyebrow,
  heading,
  body,
  foto,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  foto?: FotoSezione | null;
}) {
  if (!body && !heading) return null;
  const fotoUrl =
    foto?.asset?._ref &&
    urlFor(foto as Parameters<typeof urlFor>[0])
      .width(1200)
      .height(900)
      .fit("crop")
      .url();

  return (
    <section
      data-theme="dark"
      className="bg-nero-base text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
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
              <p className="mt-6 text-body-l text-crema-muted whitespace-pre-line leading-relaxed">
                {body}
              </p>
            )}
          </div>

          <div className="md:order-last order-first">
            <div
              className="relative w-full overflow-hidden border border-crema-faint/30"
              style={{ aspectRatio: "4/3" }}
            >
              {fotoUrl ? (
                <Image
                  src={fotoUrl}
                  alt={foto?.alt ?? ""}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center bg-nero-soft"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/caraval-logo-white.png"
                    alt=""
                    className="w-2/3 max-w-[420px] opacity-10"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SezioneStoria;
