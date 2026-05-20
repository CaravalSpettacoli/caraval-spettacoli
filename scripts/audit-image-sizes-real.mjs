/* eslint-disable */
/** Audit reale dei pesi serviti: per ogni asset Sanity >500KB originale, fa una
 *  HEAD request all'URL CDN con `?w=1920&q=80&auto=format` e legge content-length.
 *  Compara peso originale vs peso servito.
 */
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
  `*[_type == "sanity.imageAsset" && size > 500000]{
    _id, originalFilename, size, url,
    metadata { dimensions }
  } | order(size desc)`
)

function fmt(n) {
  if (n > 1e6) return (n / 1e6).toFixed(2) + ' MB'
  if (n > 1e3) return (n / 1e3).toFixed(0) + ' KB'
  return n + ' B'
}

async function headSize(url) {
  try {
    const r = await fetch(url, { method: 'HEAD' })
    const cl = r.headers.get('content-length')
    const ct = r.headers.get('content-type')
    return cl ? { bytes: parseInt(cl, 10), contentType: ct } : null
  } catch (e) {
    return null
  }
}

console.log(`\n========== Audit pesi reali (${assets.length} asset > 500 KB) ==========\n`)
console.log(`URL trasformato: ?w=1920&q=80&auto=format (default urlFor)`)
console.log(`Dimensioni headers: Accept: image/avif,image/webp\n`)
console.log(`  ${'ORIG'.padStart(8)}  ${'SERVED'.padStart(8)}  ${'RATIO'.padStart(6)}  ${'CTYPE'.padEnd(12)}  FILENAME`)
console.log(`  ${'─'.repeat(8)}  ${'─'.repeat(8)}  ${'─'.repeat(6)}  ${'─'.repeat(12)}  ${'─'.repeat(40)}`)

let totalOrig = 0
let totalServed = 0

for (const a of assets) {
  const optimizedUrl = `${a.url}?w=1920&q=80&auto=format`
  const result = await headSize(optimizedUrl)
  const orig = a.size ?? 0
  const served = result?.bytes ?? 0
  const ratio = served && orig ? `${Math.round((served / orig) * 100)}%` : '?'
  totalOrig += orig
  totalServed += served
  console.log(
    `  ${fmt(orig).padStart(8)}  ${fmt(served).padStart(8)}  ${ratio.padStart(6)}  ${(result?.contentType ?? '?').padEnd(12)}  ${a.originalFilename}`
  )
}

console.log(`\n  ${'─'.repeat(8)}  ${'─'.repeat(8)}`)
console.log(
  `  ${fmt(totalOrig).padStart(8)}  ${fmt(totalServed).padStart(8)}  TOTALE`
)
console.log(`\n  Riduzione media: ${
  totalOrig ? Math.round((1 - totalServed / totalOrig) * 100) : 0
}%`)
console.log(`  Risparmio: ${fmt(totalOrig - totalServed)}\n`)
