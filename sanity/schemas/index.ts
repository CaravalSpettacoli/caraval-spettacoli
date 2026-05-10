import { type SchemaTypeDefinition } from "sanity";

import luogo from "./objects/luogo";
import comeParteciapare from "./objects/comeParteciapare";

import spettacolo from "./spettacolo";
import evento from "./evento";
import edizioneImaginarium from "./edizioneImaginarium";
import spettacoloImaginarium from "./spettacoloImaginarium";
import corso from "./corso";
import membro from "./membro";
import premio from "./premio";
import { paginaChiSiamo, paginaOspita } from "./paginaInfo";
import impostazioniSito from "./impostazioniSito";
import homepageHero from "./homepageHero";
import homepageCopy from "./homepageCopy";
import paginaSpettacoliCopy from "./paginaSpettacoliCopy";
import paginaImaginariumCopy from "./paginaImaginariumCopy";

export const schemaTypes: SchemaTypeDefinition[] = [
  luogo,
  comeParteciapare,
  spettacolo,
  evento,
  edizioneImaginarium,
  spettacoloImaginarium,
  corso,
  membro,
  premio,
  paginaChiSiamo,
  paginaOspita,
  impostazioniSito,
  homepageHero,
  homepageCopy,
  paginaSpettacoliCopy,
  paginaImaginariumCopy,
];

export const singletonTypes = new Set([
  "paginaChiSiamo",
  "paginaOspita",
  "impostazioniSito",
  "homepageHero",
  "homepageCopy",
  "paginaSpettacoliCopy",
  "paginaImaginariumCopy",
]);
