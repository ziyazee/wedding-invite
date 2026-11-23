/* Tamil Wedding (Thirumanam) — Route: /experimental/tamil-wedding
   ?opening=image switches the Opening to image mode. */

import { useMemo } from 'react'
import { GoldenRenderer } from './core'
import { sampleWedding } from './config/sample'
import { goldenConfig, openingImage, openingVideo } from './config/layout'
import './styles/tamil.css' // core first, so section css can override it
import './sections'

export default function TamilWedding() {
  const config = useMemo(() => {
    const mode = new URLSearchParams(window.location.search).get('opening')
    return { ...goldenConfig, opening: { ...goldenConfig.opening, media: mode === 'image' ? openingImage : openingVideo } }
  }, [])

  return (
    <GoldenRenderer
      config={config}
      data={sampleWedding}
      onRsvp={(response) => {
        console.info('[tamil-wedding] RSVP', response)
      }}
    />
  )
}
