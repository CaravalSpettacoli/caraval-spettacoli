/* eslint-disable */
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
    descrizioneBreve, regia, cast, schedaTecnica,
    "blockCount": count(descrizioneNarrativa),
    "narrativaText": coalesce(descrizioneNarrativa[0].children[0].text, "")
  }`
)

console.log('\n========== DESCRIZIONI SPETTACOLI ==========')
for (const s of spettacoli) {
  const hasNarrativa = (s.blockCount ?? 0) > 0 && (s.narrativaText?.length ?? 0) > 30
  const hasBreve = (s.descrizioneBreve?.length ?? 0) > 0
  const hasRegia = !!s.regia
  const hasCast = (s.cast?.length ?? 0) > 0
  const hasScheda = !!s.schedaTecnica?.durataMinuti
  console.log(
    `  ${s.inRepertorio ? '★' : '·'} ${(s.slug ?? '?').padEnd(35)} ` +
    `narr:${hasNarrativa ? '✓' : '✗'} breve:${hasBreve ? '✓' : '✗'} ` +
    `regia:${hasRegia ? '✓' : '✗'} cast:${hasCast ? '✓' : '✗'} sched:${hasScheda ? '✓' : '✗'} | ${s.titolo}`
  )
}
