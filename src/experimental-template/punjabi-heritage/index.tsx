/* Punjabi Heritage (Viah) — experimental template. Route: /experimental/punjabi-heritage
   A culture-led Punjabi wedding: a brick deorhi at winter dusk, phulkari, sarhon and brass lamplight.
   No religious symbols by design (see planning/cultural-direction.md). */

import { GoldenRenderer } from './core'
import { sampleWedding } from './config/sample'
import { goldenConfig } from './config/layout'
import './styles/golden.css' // core first, so section css can override it
import './sections'

export default function PunjabiHeritage() {
  return (
    <GoldenRenderer
      config={goldenConfig}
      data={sampleWedding}
      onRsvp={(response) => {
        console.info('[punjabi-heritage] RSVP', response)
      }}
    />
  )
}
