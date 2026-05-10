import Image from "next/image";
import Link from "next/link";
import { CategoriaBadge, type Categoria } from "@/components/caraval/CategoriaBadge";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { urlFor } from "@/../sanity/lib/image";
import { cn } from "@/lib/cn";

export type SpettacoloCardLargeData = {
  _id: string;
  titolo?: string;
  sottotitolo?: string;
  slug?: { current?: string };
  categoria?: Categoria;
  descrizioneBreve?: string;
  immagineCover?: { asset?: { _ref?: string }; alt?: string };
  premiAssociati?: Array<{ _id: string; anno?: number; nomePremio?: string }>;
};

export function SpettacoloCardLarge({
  spettacolo,
  className,
}: {
  spettacolo: SpettacoloCardLargeData;
  className?: string;
}) {
  const slug = spettacolo.slug?.current;
  const href = slug ? `/spettacoli/${slug}` : "/spettacoli";
  const fotoUrl =
    spettacolo.immagineCover?.asset?._ref &&
    urlFor(spettacolo.immagineCover as Parameters<typeof urlFor>[0])
      .width(800)
      .height(1000)
      .fit("crop")
      .url();
  const premio = spettacolo.premiAssociati?.[0];

  return (
    <Link
      href={href}
      className={cn(
        "group block bg-nero-soft border border-crema-faint hover:border-rosso-base transition-all duration-base hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(168,23,74,0.15)]",
        className
      )}
    >
      <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={spettacolo.immagineCover?.alt ?? spettacolo.titolo ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <PlaceholderImage
            title={spettacolo.titolo ?? "Spettacolo"}
            aspectRatio="4/5"
          />
        )}
        {spettacolo.categoria && (
          <div className="absolute top-3 left-3">
            <CategoriaBadge categoria={spettacolo.categoria} />
          </div>
        )}
        {premio && (
          <div className="absolute top-3 right-3 bg-rosso-deep text-crema-base px-2 py-1 text-[10px] uppercase-tracked font-semibold rounded-sm">
            Premio {premio.anno}
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent md:opacity-0 md:transition-opacity md:duration-base group-hover:opacity-100"
        />
      </div>

      <div className="p-5 flex flex-col">
        <h3 className="font-display text-h4 text-crema-base group-hover:text-rosso-hover leading-tight transition-colors">
          {spettacolo.titolo}
        </h3>
        {spettacolo.sottotitolo && (
          <p className="mt-1 text-body-s text-crema-muted italic line-clamp-1">
            {spettacolo.sottotitolo}
          </p>
        )}
        {spettacolo.descrizioneBreve && (
          <p className="mt-3 text-body-s text-crema-muted line-clamp-2">
            {spettacolo.descrizioneBreve}
          </p>
        )}
        <span
          aria-hidden
          className="mt-4 inline-flex items-center gap-2 text-caption uppercase-tracked text-rosso-base/90 md:opacity-0 md:translate-x-[-4px] md:transition-all md:duration-base group-hover:opacity-100 group-hover:translate-x-0"
        >
          Scopri di più →
        </span>
      </div>
    </Link>
  );
}

export default SpettacoloCardLarge;
