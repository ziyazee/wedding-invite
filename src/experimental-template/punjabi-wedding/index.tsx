/* Punjabi Wedding — Route: /experimental/punjabi-wedding
   ?opening=image switches the Opening to image mode. */

import { useMemo } from 'react'
import { GoldenRenderer } from './core'
import { sampleWedding } from './config/sample'
import { goldenConfig, openingImage, openingVideo } from './config/layout'
import './styles/punjabi.css' // core first, so section css can override it
import './sections'

export default function PunjabiWedding() {
  const config = useMemo(() => {
    const mode = new URLSearchParams(window.location.search).get('opening')
    return { ...goldenConfig, opening: { ...goldenConfig.opening, media: mode === 'image' ? openingImage : openingVideo } }
  }, [])

  return (
    <GoldenRenderer
      config={config}
      data={sampleWedding}
      onRsvp={(response) => {
        console.info('[punjabi-wedding] RSVP', response)
      }}
    />
  )
}
