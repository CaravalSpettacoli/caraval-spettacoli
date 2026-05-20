import type { Metadata, Viewport } from "next";
import { Inter, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavMobile } from "@/components/caraval/BottomNavMobile";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { StructuredData } from "@/components/seo/StructuredData";
import { IubendaScripts } from "@/components/seo/IubendaScripts";
import { getFeatureFlags } from "@/lib/feature-flags";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://caraval.it"),
  title: {
    default: "Caraval Spettacoli — Compagnia teatrale di Soncino, Cremona",
    template: "%s | Caraval Spettacoli",
  },
  description:
    "Caraval Spettacoli è la compagnia teatrale di Soncino (Cremona). Prosa, teatro di fuoco, performance di strada. Festival Imaginarium ogni anno.",
  keywords: [
    "compagnia teatrale Soncino",
    "compagnia teatrale Cremona",
    "compagnia teatrale Lombardia",
    "teatro di fuoco",
    "spettacoli prosa Lombardia",
    "festival teatro Soncino",
    "Imaginarium",
    "corsi recitazione Cremona",
  ],
  authors: [{ name: "Caraval Spettacoli" }],
  creator: "Caraval Spettacoli",
  publisher: "Caraval Spettacoli",
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Caraval Spettacoli",
    url: "https://caraval.it",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IT-CR",
    "geo.placename": "Soncino",
    "geo.position": "45.4017;9.8693",
    ICBM: "45.4017, 9.8693",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const flags = await getFeatureFlags();
  return (
    <html lang="it" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        {/* Preload entrambi i loghi: l'header li cross-fade tra le 2 varianti
            in base al tema della sezione corrente. */}
        <link rel="preload" as="image" href="/caraval-logo-white.png" />
        <link rel="preload" as="image" href="/caraval-logo-black.png" />
        <StructuredData />
        <IubendaScripts />
      </head>
      <body className="bg-nero-base text-crema-base antialiased flex flex-col min-h-screen">
        <SkipLink />
        <CustomCursor />
        <Header mostraCalendario={flags.mostraCalendario} />
        <main id="contenuto" className="flex-1">
          {children}
        </main>
        <Footer mostraCalendario={flags.mostraCalendario} />
        <BottomNavMobile />
      </body>
    </html>
  );
}
