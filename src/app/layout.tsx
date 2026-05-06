import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/effects/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={inter.variable}>
      <body className="bg-nero-base text-crema-base antialiased flex flex-col min-h-screen">
        <SkipLink />
        <CustomCursor />
        <Header />
        <main id="contenuto" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
