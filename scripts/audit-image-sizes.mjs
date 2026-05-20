/* eslint-disable */
/** Audit dimensioni asset Sanity. Restituisce lista asset > 1 MB con suggerimento
 *  upload manuale di versione compressa, anche se grazie a `urlFor().auto("format").quality(80)`
 *  ora il CDN serve sempre WebP a 80 anche degli originali pesanti. */
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

const assets = await client.fetch(
  `*[_type == "sanity.imageAsset"]{
    _id, originalFilename, size, metadata { dimensions }
  } | order(size desc)`
)

function fmtBytes(n) {
  if (n > 1e6) return (n / 1e6).toFixed(2) + ' MB'
  if (n > 1e3) return (n / 1e3).toFixed(1) + ' KB'
  return n + ' B'
}

console.log(`\n========== ASSET SANITY (${assets.length} totali, ordinati per size desc) ==========\n`)

const heavy = []
for (const a of assets) {
  const size = a.size ?? 0
  const dim = a.metadata?.dimensions
    ? `${a.metadata.dimensions.width}×${a.metadata.dimensions.height}`
    : '?'
  const flag = size > 1_000_000 ? '⚠️ ' : '   '
  console.log(`${flag} ${fmtBytes(size).padStart(10)}  ${dim.padStart(12)}  ${a.originalFilename}`)
  if (size > 1_000_000) heavy.push(a)
}

console.log(`\n========== ${heavy.length} ASSET > 1 MB ==========`)
console.log('Note: il CDN Sanity ora serve WebP+quality(80) di default via urlFor(),')
console.log('quindi il peso effettivo servito è ~10-30% dell\'originale anche per questi.')
console.log('Upload di versioni pre-compresse è opzionale, non urgente.\n')
for (const a of heavy) {
  console.log(`  ${fmtBytes(a.size).padStart(10)}  ${a.originalFilename}`)
}
