import { client } from "../../../sanity/lib/client";

type Spettacolo = {
  _id: string;
  titolo: string;
  categoria: "prosa" | "strada" | "fuoco";
  annoCreazione: number;
  descrizioneBreve?: string;
};

async function getSpettacoli(): Promise<Spettacolo[]> {
  return client.fetch(
    `*[_type == "spettacolo"] | order(annoCreazione desc){
      _id, titolo, categoria, annoCreazione, descrizioneBreve
    }`
  );
}

export const revalidate = 30;

export default async function Demo() {
  let spettacoli: Spettacolo[] = [];
  let error: string | null = null;
  try {
    spettacoli = await getSpettacoli();
  } catch (e) {
    error = e instanceof Error ? e.message : "Errore sconosciuto";
  }

  return (
    <main className="min-h-screen px-6 py-16 max-w-4xl mx-auto">
      <a href="/" className="text-rosso hover:underline">← Home</a>
      <h1 className="mt-8 text-3xl font-display">Demo — query Sanity</h1>
      <p className="mt-2 text-crema/60">
        Questa pagina interroga lo schema <code>spettacolo</code> dal dataset Sanity
        per validare la connessione end-to-end.
      </p>

      {error && (
        <pre className="mt-8 p-4 bg-rosso/20 border border-rosso text-sm whitespace-pre-wrap">
          {error}
        </pre>
      )}

      {!error && spettacoli.length === 0 && (
        <p className="mt-8 text-crema/60 italic">
          Nessuno spettacolo in Sanity. Vai su <a className="text-rosso" href="/studio">/studio</a> e creane uno per testare.
        </p>
      )}

      <ul className="mt-8 space-y-4">
        {spettacoli.map((s) => (
          <li key={s._id} className="border border-crema/20 p-4">
            <span className="label-section text-rosso">{s.categoria}</span>
            <h2 className="mt-2 text-xl">{s.titolo} <span className="text-crema/50">({s.annoCreazione})</span></h2>
            {s.descrizioneBreve && <p className="mt-2 text-crema/70">{s.descrizioneBreve}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
