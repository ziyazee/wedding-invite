/* Tamil Wedding — page layout. The Opening is fixed first and configured separately.
   Reorder, remove or add a section by editing one line of `layout`. */

import type { GoldenConfig, MediaSpec } from '../core'
import openingSrc from '../assets/opening.mp4'
import musicSrc from '../assets/music.mp3'
import posterSrc from '../assets/opening-poster.jpg'
import valavuSrc from '../assets/generated/countdown-valavu-bg.jpg'
import manavaraiSrc from '../assets/generated/closing-manavarai-scene.jpg'

export const openingVideo: MediaSpec = {
  type: 'video',
  src: openingSrc,
  poster: posterSrc,
  alt: 'A Tamil wedding scene on handmade paper: gopuram, banana trees, jasmine toran and the couple',
  position: '50% 50%',
}

export const openingImage: MediaSpec = {
  type: 'image',
  src: posterSrc,
  alt: 'A Tamil wedding scene on handmade paper: gopuram, banana trees, jasmine toran and the couple',
  position: '50% 50%',
}

export const goldenConfig: GoldenConfig = {
  seed: 20270214,
  /* Music is the opening film's own audio track (the film plays muted), 8s, looped. */
  opening: { media: openingVideo, options: { revealAtSec: 2.4 } },
  music: { src: musicSrc, volume: 0.45 },
  layout: [
    { section: 'couple' },
    {
      section: 'countdown',
      media: { type: 'image', src: valavuSrc, slot: 'background', overlay: 'none', position: '50% 100%', alt: 'A Chettinad courtyard with teak pillars and an Athangudi tile floor' },
    },
    { section: 'celebrations' },
    { section: 'rsvp' },
    {
      section: 'closing',
      media: { type: 'image', src: manavaraiSrc, slot: 'background', overlay: 'none', position: '50% 100%', alt: 'A kalyana manavarai with plantain trees, jasmine garlands and brass lamps' },
    },
  ],
}
