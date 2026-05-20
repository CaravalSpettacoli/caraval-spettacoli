"use client";

import Script from "next/script";

type Props = {
  cookieBannerSiteId?: string;
  cookiePolicyId?: string;
};

/** Iubenda cookie banner — caricato solo se siteId valorizzato.
 *
 *  Lascia gli ID vuoti in Sanity per disabilitare il banner. Quando Edo
 *  avrà i codici Iubenda reali, basta popolare i campi in
 *  impostazioniSito.iubenda e il banner si attiva automaticamente. */
export function IubendaScripts({ cookieBannerSiteId, cookiePolicyId }: Props) {
  if (!cookieBannerSiteId) return null;

  const config = {
    siteId: Number(cookieBannerSiteId),
    cookiePolicyId: cookiePolicyId ? Number(cookiePolicyId) : undefined,
    lang: "it",
    storage: { useSiteId: true },
    banner: {
      acceptButtonDisplay: true,
      customizeButtonDisplay: true,
      rejectButtonDisplay: true,
      position: "float-bottom-center",
      backgroundColor: "#0a0a0a",
      textColor: "#f5e6d3",
      acceptButtonColor: "#a8174a",
      acceptButtonCaptionColor: "#f5e6d3",
      rejectButtonColor: "transparent",
      rejectButtonCaptionColor: "#f5e6d3",
      customizeButtonColor: "transparent",
      customizeButtonCaptionColor: "#f5e6d3",
    },
  };

  return (
    <>
      <Script
        id="iubenda-cs-configuration"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `var _iub = _iub || []; _iub.csConfiguration = ${JSON.stringify(config)};`,
        }}
      />
      <Script
        id="iubenda-autoblocking"
        src={`https://cs.iubenda.com/autoblocking/${cookieBannerSiteId}.js`}
        strategy="afterInteractive"
      />
      <Script
        id="iubenda-cs"
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="afterInteractive"
      />
    </>
  );
}

export default IubendaScripts;
