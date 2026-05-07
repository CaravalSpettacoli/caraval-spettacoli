import { cn } from "@/lib/cn";

export interface PlaceholderImageProps {
  title: string;
  aspectRatio?: string;
  className?: string;
}

export function PlaceholderImage({
  title,
  aspectRatio = "16/9",
  className,
}: PlaceholderImageProps) {
  const showLabel = title.trim().length > 0;
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-nero-soft border border-rosso-muted",
        className
      )}
      style={{ aspectRatio }}
      role="img"
      aria-label={showLabel ? `${title} — foto in arrivo` : "Foto in arrivo"}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,23,74,0.18)_0%,transparent_60%)]"
      />
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="font-display text-h3 md:text-h2 text-crema-base leading-tight max-w-[90%]">
            {title.toUpperCase()}
          </span>
          <span className="mt-3 font-sans text-caption uppercase tracking-widest text-crema-faint">
            Foto in arrivo
          </span>
        </div>
      )}
    </div>
  );
}

export default PlaceholderImage;
