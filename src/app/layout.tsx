import type { Metadata, Viewport } from "next";
import { Inter, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/effects/CustomCursor";
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
  title: {
    default: "Caraval Spettacoli",
    template: "%s — Caraval Spettacoli",
  },
  description:
    "Compagnia teatrale di Soncino. Prosa, teatro di strada, spettacoli di fuoco. Festival Imaginarium.",
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
    <html
      lang="it"
      className={`${inter.variable} ${cinzel.variable}`}
    >
      <head>
        {/* Preload entrambi i loghi: l'header li cross-fade tra le 2 varianti
            in base al tema della sezione corrente. Senza preload, al primo
            paint può vedersi il logo nero per qualche frame prima del bianco. */}
        <link rel="preload" as="image" href="/caraval-logo-white.png" />
        <link rel="preload" as="image" href="/caraval-logo-black.png" />
      </head>
      <body className="bg-nero-base text-crema-base antialiased flex flex-col min-h-screen">
        <SkipLink />
        <CustomCursor />
        <Header mostraCalendario={flags.mostraCalendario} />
        <main id="contenuto" className="flex-1">
          {children}
        </main>
        <Footer mostraCalendario={flags.mostraCalendario} />
      </body>
    </html>
  );
}
