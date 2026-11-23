/* Garden Wedding — page layout. The Opening is fixed first and configured separately.
   Reorder, remove or add a section by editing one line of `layout`. */

import type { GoldenConfig, MediaSpec } from '../core'
import openingSrc from '../assets/opening.mp4'
import musicSrc from '../assets/music.mp3'
import posterSrc from '../assets/opening-poster.jpg'

export const openingVideo: MediaSpec = {
  type: 'video',
  src: openingSrc,
  poster: posterSrc,
  alt: 'A flower-draped garden mandap, opening film',
  position: '50% 50%',
}

export const openingImage: MediaSpec = {
  type: 'image',
  src: posterSrc,
  alt: 'A flower-draped garden mandap',
  position: '50% 50%',
}

export const goldenConfig: GoldenConfig = {
  seed: 20270221,
  /* Music is the opening film's own audio track (the film plays muted), 8s, looped. */
  opening: { media: openingVideo },
  music: { src: musicSrc, volume: 0.45 },
  layout: [
    { section: 'couple' },
    { section: 'countdown' },
    { section: 'celebrations' },
    { section: 'rsvp' },
    { section: 'closing' },
  ],
}
