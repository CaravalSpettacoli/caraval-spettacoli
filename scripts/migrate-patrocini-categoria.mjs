/* eslint-disable */
/** Migrazione idempotente: assegna `categoria` alle entries `patrociniHomepage[]`
 *  esistenti su `homepageCopy`. Solo entries SENZA categoria già impostata
 *  vengono toccate (preserva eventuali correzioni manuali in Studio). */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const env = fs.readFileSync(path.resolve('.env.local'), 'utf8')
const get = (k) => env.split('\n').find((l) => l.startsWith(k + '='))?.split('=')[1]?.replace(/["']/g, '').trim()

const token = get('SANITY_API_WRITE_TOKEN')
if (!token) {
  console.error('❌ SANITY_API_WRITE_TOKEN mancante')
  process.exit(1)
}

const client = createClient({
  projectId: get('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: get('NEXT_PUBLIC_SANITY_DATASET') || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const MAPPING = {
  'Comune di Soncino': 'patrocinio',
  'Danesi': 'sponsor',
  'Bacco da Seta': 'partner',
  'Bacco da seta': 'partner',
  'Pro Loco Soncino': 'partner',
  'I Viaggiastorie': 'partner',
  'Viaggia Storie': 'partner',
}

const doc = await client.fetch(
  `*[_type == "homepageCopy"][0]{ _id, patrociniHomepage }`
)

if (!doc) {
  console.error('homepageCopy not found')
  process.exit(1)
}

const items = doc.patrociniHomepage ?? []
console.log(`\n========== ${items.length} patrocini da analizzare ==========\n`)

const newItems = items.map((it) => {
  if (it.categoria) {
    console.log(`  KEEP   "${it.nome}" → ${it.categoria} (già settata)`)
    return it
  }
  const cat = MAPPING[it.nome] ?? 'partner'
  console.log(`  SET    "${it.nome}" → ${cat}`)
  return { ...it, categoria: cat }
})

await client
  .patch(doc._id)
  .set({ patrociniHomepage: newItems })
  .commit()

console.log('\n✓ Done')
