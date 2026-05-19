/* eslint-disable */
// Audit script: lista slug + foto per spettacoli, identifica bug routing
// e foto mancanti. Esegui da root: npx tsx scripts/audit-spettacoli.mjs
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const env = fs.readFileSync(path.resolve('.env.local'), 'utf8')
const get = (k) => env.split('\n').find((l) => l.startsWith(k + '='))?.split('=')[1]?.replace(/["']/g, '').trim()

const client = createClient({
  projectId: get('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: get('NEXT_PUBLIC_SANITY_DATASET') || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const spettacoli = await client.fetch(
  `*[_type == "spettacolo"] | order(inRepertorio desc, titolo asc){
    _id, titolo, "slug": slug.current, inRepertorio,
    "hasCover": defined(immagineCover.asset),
    "hasHero": defined(fotoHero.asset)
  }`
)

const membri = await client.fetch(
  `*[_type == "membro"] | order(ordinamento asc){
    _id, nome, "hasFoto": defined(foto.asset)
  }`
)

const imag = await client.fetch(
  `*[_type == "spettacoloImaginarium"] | order(dataInizio asc){
    _id, titolo, "edizioneAnno": edizioneRif->anno, "hasCover": defined(immagineCover.asset)
  }`
)

const hero = await client.fetch(
  `{
    "homepageHero": *[_id == "homepageHero"][0]{ "hasFoto": defined(fotoSfondo.asset) },
    "imag": *[_id == "paginaImaginariumCopy"][0]{ "hasFoto": defined(heroFotoSfondo.asset) },
    "chiSiamo": *[_id == "paginaChiSiamoCopy"][0]{ "heroFoto": defined(heroFotoSfondo.asset), "storiaFoto": defined(storiaFotoSezione.asset), "scuolaFoto": defined(scuolaMagiaFoto.asset) },
    "contatti": *[_id == "paginaContattiCopy"][0]{ "hasFoto": defined(heroFotoSfondo.asset) },
    "ospita": *[_id == "paginaOspitaCopy"][0]{ "hasFoto": defined(heroFotoSfondo.asset) },
    "spettacoli": *[_id == "paginaSpettacoliCopy"][0]{ "hasFoto": defined(heroFotoSfondo.asset) },
    "homepageCopy": *[_id == "homepageCopy"][0]{ "calendarioHero": defined(calendarioHeroFotoSfondo.asset), "formazioneHero": defined(formazioneHeroFotoSfondo.asset) }
  }`
)

const assets = await client.fetch(
  `*[_type == "sanity.imageAsset"]{ _id, originalFilename } | order(originalFilename asc)`
)

console.log('\n========== SPETTACOLI ==========')
console.log(`Totale: ${spettacoli.length}`)
console.log(`In repertorio: ${spettacoli.filter(s => s.inRepertorio).length}`)
console.log(`In archivio: ${spettacoli.filter(s => !s.inRepertorio).length}`)
console.log(`Senza slug: ${spettacoli.filter(s => !s.slug).length}`)

console.log('\n--- IN REPERTORIO ---')
for (const s of spettacoli.filter(x => x.inRepertorio)) {
  console.log(`  ${s.slug ?? '(NO SLUG!)'.padEnd(20)} | cover:${s.hasCover ? '✓' : '✗'} hero:${s.hasHero ? '✓' : '✗'} | ${s.titolo}`)
}
console.log('\n--- ARCHIVIO ---')
for (const s of spettacoli.filter(x => !x.inRepertorio)) {
  console.log(`  ${(s.slug ?? '(NO SLUG!)').padEnd(35)} | cover:${s.hasCover ? '✓' : '✗'} hero:${s.hasHero ? '✓' : '✗'} | ${s.titolo}`)
}

console.log('\n========== MEMBRI ==========')
for (const m of membri) {
  console.log(`  foto:${m.hasFoto ? '✓' : '✗'} | ${m.nome}`)
}

console.log('\n========== IMAGINARIUM SHOWS ==========')
for (const s of imag) {
  console.log(`  ${(s.edizioneAnno ?? '?')} cover:${s.hasCover ? '✓' : '✗'} | ${s.titolo}`)
}

console.log('\n========== HERO SINGLETONS ==========')
console.log(JSON.stringify(hero, null, 2))

console.log('\n========== ASSETS UPLOADED (originalFilename) ==========')
console.log(`Totale: ${assets.length}`)
for (const a of assets) {
  console.log(`  ${a.originalFilename}`)
}
