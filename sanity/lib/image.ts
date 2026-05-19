import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Builder Sanity Image URL.
 *
 *  Default optimizations applicate automaticamente:
 *  - `auto("format")`: serve WebP/AVIF se il browser supporta (riduce peso ~30%)
 *  - `quality(80)`: bilancio compressione/qualità (riduce peso ~50% su JPEG)
 *
 *  Risultato: anche se l'asset originale è 8 MB, il CDN serve tipicamente
 *  50-300 KB per dimensione richiesta. Per override, chiamare `.quality(N)`
 *  esplicitamente dopo `urlFor()`. */
export const urlFor = (source: Image) =>
  builder.image(source).auto("format").quality(80);
