import { type SchemaTypeDefinition } from "sanity";

import luogo from "./objects/luogo";
import comeParteciapare from "./objects/comeParteciapare";

import spettacolo from "./spettacolo";
import evento from "./evento";
import edizioneImaginarium from "./edizioneImaginarium";
import spettacoloImaginarium from "./spettacoloImaginarium";
import corso from "./corso";
import membro from "./membro";
import { paginaChiSiamo, paginaOspita } from "./paginaInfo";
import impostazioniSito from "./impostazioniSito";

export const schemaTypes: SchemaTypeDefinition[] = [
  luogo,
  comeParteciapare,
  spettacolo,
  evento,
  edizioneImaginarium,
  spettacoloImaginarium,
  corso,
  membro,
  paginaChiSiamo,
  paginaOspita,
  impostazioniSito,
];

export const singletonTypes = new Set([
  "paginaChiSiamo",
  "paginaOspita",
  "impostazioniSito",
]);
