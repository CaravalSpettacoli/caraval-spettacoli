/** Feature flags letti da Sanity (`impostazioniSito.featureFlags`).
 *
 *  Pattern: una funzione async per ogni flag, con fetch ad-hoc + revalidate
 *  esteso (5 min). I componenti che importano `getFeatureFlags()` la chiamano
 *  in Server Component context; in caso di errore Sanity, fallback a default.
 *  Header (Client Component) riceve il flag come prop dal layout Server. */
import { client } from "../../sanity/lib/client";

export type FeatureFlags = {
  mostraCalendario: boolean;
};

const DEFAULTS: FeatureFlags = {
  mostraCalendario: false,
};

export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    const data = await client.fetch<{
      featureFlags?: { mostraCalendario?: boolean };
    } | null>(
      `*[_type == "impostazioniSito"][0]{ featureFlags }`,
      {},
      { next: { revalidate: 300 } }
    );
    return {
      mostraCalendario:
        data?.featureFlags?.mostraCalendario ?? DEFAULTS.mostraCalendario,
    };
  } catch {
    return DEFAULTS;
  }
}
