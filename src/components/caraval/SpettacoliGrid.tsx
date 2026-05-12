"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { urlFor } from "@/../sanity/lib/image";
import { CategoriaBadge } from "@/components/caraval/CategoriaBadge";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { SpettacoloCardLargeData } from "@/components/caraval/SpettacoloCardLarge";
import { Reveal } from "@/components/effects/Reveal";

type Filtro = "tutti" | "prosa" | "fuoco" | "strada";

const LABELS: Record<Filtro, string> = {
  tutti: "Tutti",
  prosa: "Prosa",
  fuoco: "Fuoco",
  strada: "Strada",
};

function SpettacoloRow({
  spettacolo,
  reverse,
}: {
  spettacolo: SpettacoloCardLargeData;
  reverse: boolean;
}) {
  const slug = spettacolo.slug?.current;
  const href = slug ? `/spettacoli/${slug}` : "/spettacoli";
  const fotoUrl =
    spettacolo.immagineCover?.asset?._ref &&
    urlFor(spettacolo.immagineCover as Parameters<typeof urlFor>[0])
      .width(900)
      .height(1125)
      .fit("crop")
      .url();
  const premio = spettacolo.premiAssociati?.[0];

  return (
    <Link
      href={href}
      className={cn(
        "group grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-center border-b border-crema-faint/20 py-8 md:py-12 transition-colors duration-base hover:border-rosso-base/50"
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          reverse && "md:order-last"
        )}
        style={{ aspectRatio: "4/5" }}
      >
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={spettacolo.immagineCover?.alt ?? spettacolo.titolo ?? ""}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <PlaceholderImage
            title={spettacolo.titolo ?? "Spettacolo"}
            aspectRatio="4/5"
          />
        )}
        {premio && (
          <div className="absolute top-3 right-3 bg-rosso-deep text-crema-base px-2 py-1 text-[10px] uppercase-tracked font-semibold rounded-sm">
            Premio {premio.anno}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {spettacolo.categoria && (
          <CategoriaBadge categoria={spettacolo.categoria} />
        )}
        <h3
          className="mt-4 font-display text-crema-base group-hover:text-rosso-hover leading-tight transition-colors"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          {spettacolo.titolo}
        </h3>
        {spettacolo.sottotitolo && (
          <p className="mt-2 text-body-l text-crema-muted italic">
            {spettacolo.sottotitolo}
          </p>
        )}
        {spettacolo.descrizioneBreve && (
          <p className="mt-4 text-body text-crema-muted leading-relaxed line-clamp-3">
            {spettacolo.descrizioneBreve}
          </p>
        )}
        <span
          aria-hidden
          className="mt-6 inline-flex items-center gap-2 text-body-s uppercase-tracked text-rosso-base group-hover:text-rosso-hover transition-all duration-base group-hover:translate-x-1"
        >
          Scopri di più →
        </span>
      </div>
    </Link>
  );
}

export function SpettacoliGrid({
  spettacoli,
}: {
  spettacoli: SpettacoloCardLargeData[];
}) {
  const [filtro, setFiltro] = useState<Filtro>("tutti");

  const counts = useMemo(() => {
    return {
      tutti: spettacoli.length,
      prosa: spettacoli.filter((s) => s.categoria === "prosa").length,
      fuoco: spettacoli.filter((s) => s.categoria === "fuoco").length,
      strada: spettacoli.filter((s) => s.categoria === "strada").length,
    };
  }, [spettacoli]);

  const visibili = useMemo(() => {
    if (filtro === "tutti") return spettacoli;
    return spettacoli.filter((s) => s.categoria === filtro);
  }, [spettacoli, filtro]);

  return (
    <>
      <div
        role="group"
        aria-label="Filtra per categoria"
        className="flex flex-wrap gap-2 md:gap-3 mb-10"
      >
        {(Object.keys(LABELS) as Filtro[]).map((k) => {
          const attivo = filtro === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setFiltro(k)}
              aria-pressed={attivo}
              className={cn(
                "inline-flex items-center gap-2 px-4 h-10 text-body-s font-semibold uppercase-tracked rounded-sm border transition-colors duration-base",
                attivo
                  ? "bg-rosso-base text-crema-base border-rosso-base"
                  : "bg-transparent text-crema-base border-rosso-base/60 hover:border-rosso-base"
              )}
            >
              {LABELS[k]}
              <span
                className={cn(
                  "text-[10px] font-normal",
                  attivo ? "text-crema-base/80" : "text-crema-muted"
                )}
              >
                {counts[k]}
              </span>
            </button>
          );
        })}
      </div>

      {visibili.length === 0 ? (
        <p className="text-center text-body text-crema-muted py-12">
          Nessuno spettacolo in questa categoria.
        </p>
      ) : (
        <Reveal as="ul" className="reveal-stagger border-t border-crema-faint/20">
          {visibili.map((s, i) => (
            <li key={s._id}>
              <SpettacoloRow spettacolo={s} reverse={i % 2 === 1} />
            </li>
          ))}
        </Reveal>
      )}
    </>
  );
}

export default SpettacoliGrid;
