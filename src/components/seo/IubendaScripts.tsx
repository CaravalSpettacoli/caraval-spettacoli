"use client";

import Script from "next/script";

/**
 * Iubenda Cookie Solution — Unified Embed.
 * Widget ID fisso per caraval.it. Carica banner cookie + blocco automatico
 * + consent in un unico script.
 */
const IUBENDA_WIDGET_ID = "cc631e3f-6414-45c1-a294-4ea9695d1b4e";

export function IubendaScripts() {
  return (
    <Script
      id="iubenda-cs"
      src={`https://embeds.iubenda.com/widgets/${IUBENDA_WIDGET_ID}.js`}
      strategy="afterInteractive"
    />
  );
}

export default IubendaScripts;
