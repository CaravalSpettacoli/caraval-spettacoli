/* eslint-disable */
/** Backfill idempotente dei nuovi campi biglietto su tutti gli spettacoli.
 *  Usa setIfMissing → NON sovrascrive valori già impostati.
 *
 *  Defaults:
 *  - annoProduzione: 2024 (Vera correggerà in Studio)
 *  - durataMinuti: 60 minuti
 *  - postiLimitati: false
 */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const env = fs.readFileSync(path.resolve('.env.local'), 'utf8')
const get = (k) => env.split('\n').find((l) => l.startsWith(k + '='))?.split('=')[1]?.replace(/["']/g, '').trim()

const token = get('SANITY_API_WRITE_TOKEN')
if (!token) {
  console.error('❌ SANITY_API_WRITE_TOKEN mancante in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: get('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: get('NEXT_PUBLIC_SANITY_DATASET') || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const spettacoli = await client.fetch(
  `*[_type == "spettacolo"]{ _id, titolo, "slug": slug.current, annoCreazione, annoProduzione, durataMinuti, postiLimitati }`
)

console.log(`\n========== BACKFILL ${spettacoli.length} spettacoli ==========\n`)

for (const s of spettacoli) {
  const set = {}
  if (s.annoProduzione === undefined || s.annoProduzione === null) {
    set.annoProduzione = s.annoCreazione ?? 2024
  }
  if (s.durataMinuti === undefined || s.durataMinuti === null) {
    set.durataMinuti = 60
  }
  if (s.postiLimitati === undefined || s.postiLimitati === null) {
    set.postiLimitati = false
  }

  if (Object.keys(set).length === 0) {
    console.log(`  SKIP   ${s.slug} (tutti i campi già popolati)`)
    continue
  }

  await client.patch(s._id).setIfMissing(set).commit()
  const changed = Object.entries(set)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')
  const label = (s.slug ?? `(no-slug:${s.titolo})`).padEnd(35)
  console.log(`  OK     ${label} → ${changed}`)
}

console.log('\n✓ Done. Vera può correggere i valori in Studio.')
