/**
 * Pre-popola il singleton `impostazioniSito` con i dati iniziali Caraval.
 * Richiede SANITY_API_WRITE_TOKEN in .env.local.
 *
 * Run: npm run seed
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!token)
  throw new Error(
    "Missing SANITY_API_WRITE_TOKEN — crea un token con write access da sanity.io/manage"
  );

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const impostazioni = {
  _id: "impostazioniSito",
  _type: "impostazioniSito",
  homepageHero: {
    titoloPrincipale: "Caraval Spettacoli",
    sottotitolo:
      "Una compagnia teatrale di Soncino. Facciamo prosa, teatro di strada e spettacoli di fuoco. Ogni estate, nei borghi della media pianura, c'è Imaginarium.",
    ctaPrincipale: {
      testo: "Prossimi spettacoli",
      link: "#prossimi-spettacoli",
    },
  },
  homepageBlocchi: {
    mostraProssimiEventi: true,
    numeroProssimiEventi: 4,
    mostraTeaserImaginarium: true,
    mostraTeaserOspita: true,
  },
  contattiPubblici: {
    email: "caravalspettacoli@gmail.com",
    telefono: "+39 379 149 7805",
    telefonoVeraDiretto: "+39 348 9143189",
  },
  socialLinks: [
    {
      _key: "social-instagram",
      piattaforma: "instagram",
      url: "https://www.instagram.com/caravalspettacoli",
      mostraInHeader: false,
      mostraInFooter: true,
    },
    {
      _key: "social-facebook",
      piattaforma: "facebook",
      url: "https://www.facebook.com/caravalspettacoli",
      mostraInHeader: false,
      mostraInFooter: true,
    },
    {
      _key: "social-youtube",
      piattaforma: "youtube",
      url: "https://www.youtube.com/@caravalspettacoli",
      mostraInHeader: false,
      mostraInFooter: true,
    },
  ],
  datiAssociazione: {
    ragioneSociale: "Caraval Associazione Culturale",
    partitaIva: "01720800190",
    codiceFiscale: "01720800190",
    indirizzo: "Via Borgo San Martino 8",
    citta: "Soncino",
    cap: "26029",
    provincia: "CR",
    pec: "caravalspettacoli@pec.it",
    sdi: "SU9YNJA",
  },
};

async function main() {
  console.log(`Seeding impostazioniSito → project ${projectId}/${dataset}`);
  await client.createOrReplace(impostazioni);
  console.log("✓ impostazioniSito creato/aggiornato");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
