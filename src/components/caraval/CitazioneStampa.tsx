import { cn } from "@/lib/cn";

interface CitazioneStampaProps {
  testo: string;
  fonte: string;
  data?: string;
  className?: string;
}

function VirgoletteSvg({ className }: { className?: string }) {
  return (
    <svg
      width="64"
      height="48"
      viewBox="0 0 64 48"
      fill="currentColor"
      aria-hidden="true"
      className={cn("inline-block", className)}
    >
      {/* Due virgolette decorative stilizzate */}
      <path d="M4 4 L20 4 L20 20 L12 20 C12 28 8 32 4 36 L4 28 C8 26 10 22 10 18 L4 18 Z" />
      <path d="M28 4 L44 4 L44 20 L36 20 C36 28 32 32 28 36 L28 28 C32 26 34 22 34 18 L28 18 Z" />
    </svg>
  );
}

export function CitazioneStampa({
  testo,
  fonte,
  data,
  className,
}: CitazioneStampaProps) {
  return (
    <figure className={cn("relative max-w-2xl", className)}>
      <VirgoletteSvg className="text-rosso-base mb-4" />
      <blockquote className="font-sans italic text-body-l text-crema-base leading-snug">
        {testo}
      </blockquote>
      <figcaption className="mt-6 text-label uppercase-tracked text-rosso-hover">
        {fonte}
        {data && (
          <>
            <span aria-hidden="true" className="mx-2 text-crema-muted">
              ·
            </span>
            <span className="text-crema-muted">{data}</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}

export default CitazioneStampa;
