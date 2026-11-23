/* Golden — page layout. The Opening is fixed first and configured separately.
   Reorder, remove or add a section by editing one line of `layout`.
   Any section can take a media slot: { type: 'image' | 'video', src, slot, ... }. */

import type { GoldenConfig, MediaSpec } from '../core'

const KERALA = '/templates/kerala/assets'

export const openingVideo: MediaSpec = {
  type: 'video',
  src: `${KERALA}/opening.mp4`,
  poster: `${KERALA}/opening-poster.jpg`,
  alt: 'The couple, opening film',
  position: '50% 40%',
}

export const openingImage: MediaSpec = {
  type: 'image',
  src: `${KERALA}/opening-poster.jpg`,
  alt: 'The couple',
  position: '50% 40%',
}

export const goldenConfig: GoldenConfig = {
  seed: 20270220,
  opening: { media: openingVideo },
  music: { src: `${KERALA}/music.mp3`, startAt: 4, volume: 0.35 },
  layout: [
    { section: 'couple', media: { type: 'image', src: `${KERALA}/3-couple.png`, slot: 'banner', aspect: '4 / 5', parallax: true, alt: 'Ananya and Rohan', overlay: 'none' } },
    { section: 'countdown' },
    { section: 'celebrations' },
    { section: 'rsvp' },
    { section: 'closing', media: { type: 'image', src: `${KERALA}/2.png`, slot: 'background', overlay: 'strong', parallax: true } },
  ],
}
