"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";

export type SpettacoloHomepage = {
  _id: string;
  titolo: string;
  sottotitolo?: string;
  slug?: { current?: string };
  categoria: "prosa" | "fuoco" | "strada";
  descrizioneBreve?: string;
  ordineHomepage?: number;
};

export interface SpettacoliAccordionProps {
  spettacoli: SpettacoloHomepage[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
  ctaTesto?: string;
  ctaLink?: string;
}

function ColonnaAccordion({
  titolo,
  spettacoli,
}: {
  titolo: string;
  spettacoli: SpettacoloHomepage[];
}) {
  const [aperto, setAperto] = useState<string | null>(null);

  return (
    <div>
      <h3 className="font-display text-rosso-base/90 uppercase-tracked text-caption mb-6">
        {titolo}
      </h3>
      <ul className="border-t border-rosso-base/20">
        {spettacoli.map((s) => {
          const isOpen = aperto === s._id;
          const slug = s.slug?.current;
          const excerpt =
            s.descrizioneBreve ?? s.sottotitolo ?? "";
          return (
            <li
              key={s._id}
              className="border-b border-rosso-base/20"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setAperto(isOpen ? null : s._id)}
                className="w-full flex items-center justify-between gap-4 text-left group min-h-[5rem] md:min-h-[6rem]"
              >
                <span
                  className="font-display text-crema-base group-hover:text-rosso-hover transition-colors leading-tight line-clamp-2"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                  {s.titolo}
                </span>
                <span
                  aria-hidden
                  className={`flex-shrink-0 text-rosso-base text-2xl transition-transform duration-base ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div className={`accordion-body ${isOpen ? "open" : ""}`}>
                {excerpt ? (
                  <p className="text-body text-crema-muted leading-relaxed">
                    {excerpt}
                  </p>
                ) : (
                  <p className="text-body text-crema-muted/70 italic leading-relaxed">
                    Descrizione in arrivo.
                  </p>
                )}
                {slug && (
                  <Link
                    href={`/spettacoli/${slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-body-s text-crema-base underline underline-offset-4 decoration-rosso-base hover:text-rosso-hover transition-colors uppercase-tracked"
                  >
                    Vai allo spettacolo →
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SpettacoliAccordionHomepage({
  spettacoli,
  eyebrow,
  heading,
  intro,
  ctaTesto = "Vedi tutto il repertorio",
  ctaLink = "/spettacoli",
}: SpettacoliAccordionProps) {
  if (!spettacoli || spettacoli.length === 0) return null;

  const prosa = spettacoli
    .filter((s) => s.categoria === "prosa")
    .sort((a, b) => (a.ordineHomepage ?? 99) - (b.ordineHomepage ?? 99))
    .slice(0, 4);
  const fuocoStrada = spettacoli
    .filter((s) => s.categoria === "fuoco" || s.categoria === "strada")
    .sort((a, b) => (a.ordineHomepage ?? 99) - (b.ordineHomepage ?? 99))
    .slice(0, 4);

  return (
    <section
      data-theme="dark"
      className="bg-nero-base text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        {(eyebrow || heading || intro) && (
          <div className="mb-12 max-w-2xl">
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
            {intro && (
              <p className="mt-4 text-body-l text-crema-muted">{intro}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          <ColonnaAccordion titolo="Prosa" spettacoli={prosa} />
          <ColonnaAccordion titolo="Fuoco e strada" spettacoli={fuocoStrada} />
        </div>

        <div className="mt-16 text-center">
          <Link
            href={ctaLink}
            className="cta-tertiary font-display text-h3 text-crema-base hover:text-rosso-hover transition-colors"
          >
            {ctaTesto} <span aria-hidden>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default SpettacoliAccordionHomepage;
