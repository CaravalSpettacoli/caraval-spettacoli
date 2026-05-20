import type { Metadata } from "next";
import Image from "next/image";
import { Instagram, Facebook, Mail } from "lucide-react";
import { client } from "@/../sanity/lib/client";
import { urlFor } from "@/../sanity/lib/image";
import { ComingSoonCountdown } from "@/components/caraval/ComingSoonCountdown";

export const revalidate = 60;

type SocialLink = {
  piattaforma?: string;
  url?: string;
};

type ComingSoonData = {
  comingSoon?: {
    titolo?: string;
    sottotitolo?: string;
    dataLancio?: string;
    fotoSfondo?: { asset?: { _ref?: string }; alt?: string } | null;
  } | null;
  contattiPubblici?: { email?: string };
  socialLinks?: SocialLink[];
};

export const metadata: Metadata = {
  title: "Stiamo arrivando",
  description:
    "Il nuovo sito di Caraval Spettacoli sarà online a breve. Restate sintonizzati.",
  robots: { index: false, follow: false },
};

async function getComingSoonData(): Promise<ComingSoonData> {
  try {
    const data = await client.fetch<ComingSoonData | null>(
      `*[_id == "impostazioniSito"][0]{
        comingSoon,
        contattiPubblici{ email },
        socialLinks[]{ piattaforma, url }
      }`
    );
    return data ?? {};
  } catch {
    return {};
  }
}

export default async function ComingSoonPage() {
  const data = await getComingSoonData();
  const cs = data.comingSoon ?? {};
  const titolo = cs.titolo ?? "Stiamo arrivando";
  const sottotitolo =
    cs.sottotitolo ?? "Il nuovo sito di Caraval Spettacoli sarà online a breve.";
  const fotoUrl =
    cs.fotoSfondo?.asset?._ref &&
    urlFor(cs.fotoSfondo as Parameters<typeof urlFor>[0])
      .width(1920)
      .height(1080)
      .fit("crop")
      .url();

  const email = data.contattiPubblici?.email;
  const instagram = data.socialLinks?.find((s) => s.piattaforma === "instagram")?.url;
  const facebook = data.socialLinks?.find((s) => s.piattaforma === "facebook")?.url;

  return (
    <main className="coming-soon-page">
      {fotoUrl && (
        <div className="coming-soon-foto-sfondo" aria-hidden>
          <Image src={fotoUrl} alt="" fill priority sizes="100vw" />
          <div className="coming-soon-overlay" />
        </div>
      )}

      <div className="coming-soon-content">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/caraval-logo-white.png"
          alt="Caraval Spettacoli"
          width={240}
          height={64}
          className="coming-soon-logo"
        />

        <div className="coming-soon-text">
          <h1 className="coming-soon-titolo font-display">{titolo}</h1>
          <p className="coming-soon-sottotitolo">{sottotitolo}</p>

          {cs.dataLancio && <ComingSoonCountdown dataLancio={cs.dataLancio} />}
        </div>

        <div className="coming-soon-social">
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} aria-label="Email">
              <Mail className="w-6 h-6" />
            </a>
          )}
        </div>

        <p className="coming-soon-credits">
          © {new Date().getFullYear()} Caraval Spettacoli · Tutti i diritti riservati
        </p>
      </div>
    </main>
  );
}
