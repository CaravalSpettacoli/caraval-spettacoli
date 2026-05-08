"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { EventoCard } from "@/components/caraval/EventoCard";
import { GiornataImaginariumCard } from "@/components/caraval/GiornataImaginariumCard";
import { groupByMese, type CalendarioItem } from "@/lib/calendario-utils";

type Filtro = "tutti" | "prosa" | "fuoco-strada" | "imaginarium";

const FILTRI: Array<{ value: Filtro; label: string }> = [
  { value: "tutti", label: "Tutti" },
  { value: "prosa", label: "Prosa" },
  { value: "fuoco-strada", label: "Fuoco e strada" },
  { value: "imaginarium", label: "Imaginarium" },
];

export function CalendarioFilter({
  items,
  emptyText,
}: {
  items: CalendarioItem[];
  emptyText: string;
}) {
  const [filtro, setFiltro] = useState<Filtro>("tutti");

  const filtered = useMemo(() => {
    if (filtro === "tutti") return items;
    if (filtro === "imaginarium") {
      return items.filter((i) => i.tipo === "imaginarium");
    }
    if (filtro === "prosa") {
      return items.filter((i) => i.tipo === "evento" && i.categoria === "prosa");
    }
    if (filtro === "fuoco-strada") {
      return items.filter(
        (i) =>
          i.tipo === "evento" &&
          (i.categoria === "fuoco" || i.categoria === "strada")
      );
    }
    return items;
  }, [filtro, items]);

  const grouped = useMemo(() => groupByMese(filtered), [filtered]);

  return (
    <div>
      {/* Strip filtri */}
      <div
        role="tablist"
        aria-label="Filtri calendario"
        className="flex flex-wrap gap-2 md:gap-3 mb-12"
      >
        {FILTRI.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filtro === f.value}
            onClick={() => setFiltro(f.value)}
            className={cn(
              "px-4 py-2 rounded-md text-body-s uppercase-tracked transition-colors",
              filtro === f.value
                ? "bg-rosso-base text-crema-base"
                : "bg-nero-soft text-crema-muted hover:text-crema-base hover:bg-nero-base"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stato vuoto */}
      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-body-l text-crema-muted">{emptyText}</p>
        </div>
      )}

      {/* Lista raggruppata per mese */}
      <div className="space-y-16">
        {Array.from(grouped.entries()).map(([mese, items]) => (
          <section key={mese} aria-labelledby={`mese-${mese}`}>
            <h2
              id={`mese-${mese}`}
              className="font-display text-h3 uppercase-tracked text-rosso-hover/80 mb-6"
            >
              {mese}
            </h2>
            <div className="space-y-5">
              {items.map((item) =>
                item.tipo === "evento" ? (
                  <EventoCard key={item.id} item={item} />
                ) : (
                  <GiornataImaginariumCard key={item.id} item={item} />
                )
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default CalendarioFilter;
