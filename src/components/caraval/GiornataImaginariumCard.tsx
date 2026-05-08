import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { urlFor } from "@/../sanity/lib/image";
import type { ItemImaginarium } from "@/lib/calendario-utils";

const GIORNI_SETT = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
const MESI_BREVI = [
  "gen", "feb", "mar", "apr", "mag", "giu",
  "lug", "ago", "set", "ott", "nov", "dic",
];

function formatOra(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function GiornataImaginariumCard({
  item,
  className,
}: {
  item: ItemImaginarium;
  className?: string;
}) {
  const { data, edizioneAnno, locationGiornata, spettacoli } = item;

  return (
    <article
      className={cn(
        "flex flex-col md:flex-row gap-4 md:gap-8 items-start p-5 md:p-6 rounded-md bg-crema-base text-nero-base border border-rosso-base/20 hover:border-rosso-base transition-all duration-base hover:-translate-y-1",
        className
      )}
    >
      {/* Data sx */}
      <div className="flex md:flex-col items-baseline md:items-center gap-3 md:gap-1 shrink-0 md:w-20 md:py-2 md:text-center">
        <span className="font-display text-display-m leading-none text-rosso-deep">
          {data.getDate()}
        </span>
        <div className="flex md:flex-col gap-2 md:gap-0">
          <span className="text-label uppercase-tracked text-rosso-base">
            {MESI_BREVI[data.getMonth()]}
          </span>
          <span className="text-caption text-nero-base/60">
            {GIORNI_SETT[data.getDay()]} · {formatOra(data)}
          </span>
        </div>
      </div>

      {/* Contenuto dx */}
      <div className="flex-1 min-w-0 w-full">
        <span className="inline-block mb-3 px-3 py-1 rounded-sm bg-rosso-deep text-crema-base text-label uppercase-tracked font-semibold">
          Imaginarium {edizioneAnno}
        </span>
        <h3 className="font-display text-h4 text-nero-base leading-tight">
          Giornata Imaginarium
        </h3>
        {locationGiornata && (
          <p className="mt-1 text-body-s text-nero-base/70">{locationGiornata}</p>
        )}

        {/* Lista spettacoli giornata */}
        <ul className="mt-4 space-y-2">
          {spettacoli.map((s) => {
            const fotoUrl =
              s.foto?.asset?._ref &&
              urlFor(s.foto as Parameters<typeof urlFor>[0])
                .width(120)
                .height(120)
                .fit("crop")
                .url();
            return (
              <li key={s.id} className="flex items-center gap-3">
                <div className="shrink-0 w-12 h-12 rounded-sm overflow-hidden bg-nero-base/10 border border-nero-base/10">
                  {fotoUrl ? (
                    <Image
                      src={fotoUrl}
                      alt={s.foto?.alt ?? ""}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="text-body-s font-semibold text-nero-base truncate">
                    {s.titolo}
                  </p>
                  {s.compagnia && (
                    <p className="text-caption text-nero-base/60 truncate">
                      {s.compagnia}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5">
          <Link
            href="/imaginarium"
            className="inline-flex items-center gap-1.5 text-body-s font-semibold text-rosso-deep hover:text-rosso-base transition-colors"
          >
            Scopri il festival
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default GiornataImaginariumCard;
