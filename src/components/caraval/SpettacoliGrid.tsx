"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  SpettacoloCardLarge,
  type SpettacoloCardLargeData,
} from "@/components/caraval/SpettacoloCardLarge";

type Filtro = "tutti" | "prosa" | "fuoco" | "strada";

const LABELS: Record<Filtro, string> = {
  tutti: "Tutti",
  prosa: "Prosa",
  fuoco: "Fuoco",
  strada: "Strada",
};

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
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {visibili.map((s) => (
            <li key={s._id}>
              <SpettacoloCardLarge spettacolo={s} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default SpettacoliGrid;
