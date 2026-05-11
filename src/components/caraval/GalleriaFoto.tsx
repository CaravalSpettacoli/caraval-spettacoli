"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/../sanity/lib/image";

export type GalleriaItem = {
  _key?: string;
  asset?: { _ref?: string };
  alt?: string;
};

export function GalleriaFoto({ immagini }: { immagini: GalleriaItem[] | null }) {
  const [aperto, setAperto] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (aperto !== null && !d.open) d.showModal();
    if (aperto === null && d.open) d.close();
  }, [aperto]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAperto(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!immagini || immagini.length === 0) return null;

  const grandeUrl =
    aperto !== null && immagini[aperto]?.asset?._ref
      ? urlFor(immagini[aperto] as Parameters<typeof urlFor>[0])
          .width(2000)
          .fit("max")
          .url()
      : null;

  return (
    <section data-theme="dark" className="bg-nero-soft py-16 md:py-20">
      <Container>
        <h2 className="uppercase-tracked text-caption text-rosso-base mb-8">
          Galleria
        </h2>
        <ul
          role="list"
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {immagini.map((img, i) => {
            const url =
              img.asset?._ref &&
              urlFor(img as Parameters<typeof urlFor>[0])
                .width(700)
                .height(700)
                .fit("crop")
                .url();
            if (!url) return null;
            return (
              <li key={img._key ?? i}>
                <button
                  type="button"
                  onClick={() => setAperto(i)}
                  className="group relative block w-full overflow-hidden bg-nero-base focus-visible:outline-2 focus-visible:outline-rosso-hover"
                  style={{ aspectRatio: "1/1" }}
                  aria-label={`Apri immagine ${i + 1} di ${immagini.length}`}
                >
                  <Image
                    src={url}
                    alt={img.alt ?? ""}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-base group-hover:scale-105"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </Container>

      <dialog
        ref={dialogRef}
        onClose={() => setAperto(null)}
        className="bg-nero-deep/95 text-crema-base backdrop:bg-black/80 max-w-[95vw] max-h-[95vh] p-0 border-0"
      >
        {grandeUrl && (
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              type="button"
              onClick={() => setAperto(null)}
              className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-10 w-10 bg-nero-base/80 text-crema-base rounded-full hover:bg-rosso-base"
              aria-label="Chiudi"
            >
              <X size={18} />
            </button>
            <Image
              src={grandeUrl}
              alt={
                aperto !== null
                  ? immagini[aperto]?.alt ?? `Immagine ${aperto + 1}`
                  : ""
              }
              width={2000}
              height={1400}
              className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain"
            />
          </div>
        )}
      </dialog>
    </section>
  );
}

export default GalleriaFoto;
