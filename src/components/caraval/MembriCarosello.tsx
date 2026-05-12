"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { OndaDecorativa } from "@/components/decorative/OndaDecorativa";
import { urlFor } from "@/../sanity/lib/image";
import { cn } from "@/lib/cn";
import type { MembroItem } from "@/components/caraval/MembriGrid";

const AUTOPLAY_MS = 5000;

function initials(name?: string): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function MembroSlide({
  membro,
  active,
  side,
}: {
  membro: MembroItem;
  active: boolean;
  side: "left" | "center" | "right";
}) {
  const fotoUrl =
    membro.foto?.asset?._ref &&
    urlFor(membro.foto as Parameters<typeof urlFor>[0])
      .width(700)
      .height(875)
      .fit("crop")
      .url();

  return (
    <article
      className={cn(
        "flex flex-col text-left transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        active
          ? "opacity-100 scale-100 blur-0"
          : "opacity-40 scale-[0.82] blur-[1px]"
      )}
      style={{
        transformOrigin: side === "left" ? "right center" : side === "right" ? "left center" : "center",
      }}
      aria-hidden={!active}
    >
      <div
        className="relative w-full overflow-hidden bg-rosso-muted"
        style={{ aspectRatio: "4/5" }}
      >
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={membro.foto?.alt ?? membro.nome ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 80vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-rosso-base/15"
          >
            <span
              className="font-display text-rosso-base/55 leading-none select-none"
              style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}
            >
              {initials(membro.nome)}
            </span>
          </div>
        )}
      </div>
      <div className="mt-5 min-h-[8rem]">
        <h3 className="font-display text-h3 text-crema-base leading-tight">
          {membro.nome}
        </h3>
        {membro.ruoli && membro.ruoli.length > 0 && (
          <p className="mt-1 uppercase-tracked text-caption text-rosso-base/90">
            {membro.ruoli.join(" · ")}
          </p>
        )}
        {membro.bioBreve && (
          <p className="mt-3 text-body-s text-crema-base/85 leading-relaxed">
            {membro.bioBreve}
          </p>
        )}
      </div>
    </article>
  );
}

export function MembriCarosello({
  eyebrow,
  heading,
  intro,
  membri,
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  membri: MembroItem[];
}) {
  const sorted = [...(membri ?? [])].sort(
    (a, b) => (a.ordinamento ?? 99) - (b.ordinamento ?? 99)
  );
  const total = sorted.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(total, 1));
  }, [total]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % Math.max(total, 1));
  }, [total]);

  useEffect(() => {
    if (paused || reducedRef.current || total <= 1) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, next, total]);

  if (total === 0) return null;

  const slotIndex = (offset: number) => (index + offset + total) % total;

  return (
    <section
      data-theme="dark"
      className="bg-nero-soft text-crema-base"
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex justify-center mb-4">
            <OndaDecorativa
              width={120}
              variant="sottile"
              className="text-rosso-base/50"
            />
          </div>
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

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Desktop / tablet: 3 card visibili (prev / current / next) */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            <MembroSlide
              membro={sorted[slotIndex(-1)]}
              active={false}
              side="left"
            />
            <MembroSlide
              membro={sorted[slotIndex(0)]}
              active
              side="center"
            />
            <MembroSlide
              membro={sorted[slotIndex(1)]}
              active={false}
              side="right"
            />
          </div>

          {/* Mobile: 1 card centrale + anteprima parziale */}
          <div className="md:hidden flex gap-4 overflow-hidden">
            <div className="flex-1 min-w-0">
              <MembroSlide
                membro={sorted[slotIndex(0)]}
                active
                side="center"
              />
            </div>
            <div className="w-[20%] shrink-0 -mr-4 opacity-30 pointer-events-none">
              <MembroSlide
                membro={sorted[slotIndex(1)]}
                active={false}
                side="right"
              />
            </div>
          </div>

          {/* Frecce navigazione */}
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Membro precedente"
                onClick={prev}
                className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-rosso-base/40 bg-nero-base/80 backdrop-blur-sm text-crema-base hover:bg-rosso-base hover:border-rosso-base transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Membro successivo"
                onClick={next}
                className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-rosso-base/40 bg-nero-base/80 backdrop-blur-sm text-crema-base hover:bg-rosso-base hover:border-rosso-base transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Indicatori (dots) */}
          {total > 1 && (
            <div
              role="tablist"
              aria-label="Membri della compagnia"
              className="mt-8 flex justify-center gap-2"
            >
              {sorted.map((m, i) => (
                <button
                  key={m._id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Vai al membro ${m.nome ?? i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-base",
                    i === index
                      ? "w-8 bg-rosso-base"
                      : "w-1.5 bg-crema-base/30 hover:bg-crema-base/60"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default MembriCarosello;
