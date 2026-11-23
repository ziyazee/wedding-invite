/* Muslim Royal — experimental template. Route: /experimental/muslim-royal
   A Muslim royal wedding: a marble iwan at dusk, emerald and zardozi, mogra, roses and Arabic calligraphy.
   Aniconic by design: no people or animals (see planning/cultural-direction.md). */

import { GoldenRenderer } from './core'
import { sampleWedding } from './config/sample'
import { goldenConfig } from './config/layout'
import './styles/golden.css' // core first, so section css can override it
import './sections'

export default function MuslimRoyal() {
  return (
    <GoldenRenderer
      config={goldenConfig}
      data={sampleWedding}
      onRsvp={(response) => {
        console.info('[muslim-royal] RSVP', response)
      }}
    />
  )
}
