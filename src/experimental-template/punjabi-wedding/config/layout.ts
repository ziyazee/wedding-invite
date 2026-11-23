/* Punjabi Wedding — page layout. The Opening is fixed first and configured separately.
   Reorder, remove or add a section by editing one line of `layout`. */

import type { GoldenConfig, MediaSpec } from '../core'
import openingSrc from '../assets/opening.mp4'
import musicSrc from '../assets/music.mp3'
import posterSrc from '../assets/opening-poster.jpg'
import baghSrc from '../assets/generated/bagh-countdown-bg.jpg'
import pavilionSrc from '../assets/generated/closing-pavilion-scene.jpg'

export const openingVideo: MediaSpec = {
  type: 'video',
  src: openingSrc,
  poster: posterSrc,
  alt: 'A rose-draped golden pavilion on a sunlit lawn, Anand Karaj opening film',
  position: '50% 50%',
}

export const openingImage: MediaSpec = {
  type: 'image',
  src: posterSrc,
  alt: 'A rose-draped golden pavilion on a sunlit lawn',
  position: '50% 50%',
}

export const goldenConfig: GoldenConfig = {
  seed: 20270220,
  /* Music is the opening film's own audio track (the film plays muted), 8s, looped. */
  opening: { media: openingVideo, options: { revealAtSec: 4.5 } },
  music: { src: musicSrc, volume: 0.45 },
  layout: [
    { section: 'couple' },
    {
      section: 'countdown',
      media: { type: 'image', src: baghSrc, slot: 'background', overlay: 'none', position: '50% 0%', alt: 'A sunlit palace lawn with rose arches' },
    },
    { section: 'celebrations' },
    { section: 'rsvp' },
    {
      section: 'closing',
      media: { type: 'image', src: pavilionSrc, slot: 'background', overlay: 'none', position: '50% 100%', alt: 'A golden pavilion on a daisy lawn at golden hour' },
    },
  ],
}
