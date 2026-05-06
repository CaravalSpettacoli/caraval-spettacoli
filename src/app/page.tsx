import { Sipario } from "@/components/layout/Sipario";

export default function Home() {
  return (
    <>
      <Sipario />
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <span className="label-section text-rosso mb-8">Soncino · Compagnia teatrale</span>
      <h1
        className="font-display text-5xl md:text-7xl text-crema text-center"
        style={{ fontFamily: "var(--font-stonehead)" }}
      >
        CARAVAL SPETTACOLI
      </h1>
      <p className="mt-8 max-w-xl text-center text-crema/80 text-lg">
        Una compagnia. Tre anime. Un festival.
      </p>
      <p className="mt-4 max-w-2xl text-center text-crema/60">
        Prosa, teatro di strada, spettacoli di fuoco. Ogni estate, nei borghi della
        media pianura, c&apos;è Imaginarium.
      </p>
      <div className="mt-12 flex gap-4">
        <a
          href="/demo"
          className="px-6 py-3 bg-rosso text-crema rounded-sm hover:opacity-90 transition"
        >
          Demo Sanity
        </a>
        <a
          href="/studio"
          className="px-6 py-3 border border-crema/40 text-crema rounded-sm hover:bg-crema/10 transition"
        >
          Studio CMS
        </a>
      </div>
      <footer className="mt-24 text-xs text-crema/40">
        Sessione 1 — setup tecnico. Il design arriverà nelle sessioni successive.
      </footer>
    </main>
    </>
  );
}
