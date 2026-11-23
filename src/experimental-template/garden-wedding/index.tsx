/* Garden Wedding — Garden Wedding (North Indian). Route: /experimental/garden-wedding
   ?opening=image switches the Opening to image mode. */

import { useMemo } from 'react'
import { GoldenRenderer } from './core'
import { sampleWedding } from './config/sample'
import { goldenConfig, openingImage, openingVideo } from './config/layout'
import './styles/garden.css' // core first, so section css can override it
import './sections'

export default function GardenWedding() {
  const config = useMemo(() => {
    const mode = new URLSearchParams(window.location.search).get('opening')
    return { ...goldenConfig, opening: { ...goldenConfig.opening, media: mode === 'image' ? openingImage : openingVideo } }
  }, [])

  return (
    <GoldenRenderer
      config={config}
      data={sampleWedding}
      onRsvp={(response) => {
        console.info('[garden-wedding] RSVP', response)
      }}
    />
  )
}
