/* Muslim Wedding — page layout. The Opening is fixed first and configured separately.
   Reorder, remove or add a section by editing one line of `layout`.
   Generated section art is added in the asset pass (assets/generated/). */

import type { GoldenConfig, MediaSpec } from '../core'
import openingSrc from '../assets/opening.mp4'
import musicSrc from '../assets/music.mp3'
import posterSrc from '../assets/opening-poster.jpg'
import hallSrc from '../assets/generated/countdown-hall.jpg'
import archSrc from '../assets/generated/closing-arch.jpg'

export const openingVideo: MediaSpec = {
  type: 'video',
  src: openingSrc,
  poster: posterSrc,
  alt: 'A modern luxury nikah stage of white roses, carved alabaster arches and brass lanterns, with the couple seated',
  position: '50% 50%',
}

export const openingImage: MediaSpec = {
  type: 'image',
  src: posterSrc,
  alt: 'A modern luxury nikah stage of white roses and carved alabaster arches',
  position: '50% 50%',
}

export const goldenConfig: GoldenConfig = {
  seed: 20270312,
  opening: { media: openingVideo, options: { revealAtSec: 3.6 } },
  music: { src: musicSrc, startAt: 0, volume: 0.35 },
  layout: [
    { section: 'couple' },
    {
      section: 'countdown',
      media: { type: 'image', src: hallSrc, slot: 'background', overlay: 'none', position: '50% 100%', alt: 'A carved alabaster hall with gilt jali pillars, brass lanterns and white roses on a marble floor' },
    },
    { section: 'celebrations' },
    { section: 'rsvp' },
    {
      section: 'closing',
      media: { type: 'image', src: archSrc, slot: 'background', overlay: 'none', position: '50% 100%', alt: 'A carved alabaster arch framed by rose garlands, with brass lanterns and scattered petals' },
    },
  ],
}
