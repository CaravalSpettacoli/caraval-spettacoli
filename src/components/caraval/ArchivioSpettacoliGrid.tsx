import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { urlFor } from "@/../sanity/lib/image";

export type ArchivioItem = {
  _id: string;
  titolo?: string;
  annoCreazione?: number;
  regia?: string;
  immagineCover?: { asset?: { _ref?: string }; alt?: string };
  premiAssociati?: Array<{ _id: string; anno?: number; nomePremio?: string }>;
};

export function ArchivioSpettacoliGrid({
  archivio,
}: {
  archivio: ArchivioItem[];
}) {
  if (!archivio || archivio.length === 0) {
    return (
      <p className="text-body text-crema-muted text-center py-12">
        Archivio in arrivo.
      </p>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
    >
      {archivio.map((s) => {
        const fotoUrl =
          s.immagineCover?.asset?._ref &&
          urlFor(s.immagineCover as Parameters<typeof urlFor>[0])
            .width(700)
            .height(875)
            .fit("crop")
            .url();
        const premio = s.premiAssociati?.[0];
        return (
          <li
            key={s._id}
            className="bg-nero-soft border border-crema-faint/40"
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: "4/5" }}
            >
              {fotoUrl ? (
                <Image
                  src={fotoUrl}
                  alt={s.immagineCover?.alt ?? s.titolo ?? ""}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <PlaceholderImage
                  title={s.titolo ?? "Spettacolo"}
                  aspectRatio="4/5"
                />
              )}
              {premio && (
                <div className="absolute top-3 right-3 bg-rosso-deep text-crema-base px-2 py-1 text-[10px] uppercase-tracked font-semibold rounded-sm">
                  Premio {premio.anno}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display text-h4 text-crema-base leading-tight line-clamp-2">
                {s.titolo}
              </h3>
              <div className="mt-2 flex items-baseline justify-between gap-3">
                {s.annoCreazione && (
                  <span className="text-body-s text-crema-muted">
                    {s.annoCreazione}
                  </span>
                )}
                {s.regia && (
                  <span className="text-caption text-crema-muted italic line-clamp-1 text-right">
                    regia {s.regia}
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default ArchivioSpettacoliGrid;
