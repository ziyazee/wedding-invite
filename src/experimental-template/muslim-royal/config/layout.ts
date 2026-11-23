/* Muslim Royal — page layout. The Opening is fixed first and configured separately.
   Reorder, remove or add a section by editing one line of `layout`.
   Countdown, Couple, Celebrations, RSVP and Closing place their own artwork (media: 'none'
   semantics): every scene is composed from the painted assets so text always sits in a quiet band. */

import type { GoldenConfig, MediaSpec } from '../core'
import openingSrc from '../assets/generated/opening-near.webp'

export const openingImage: MediaSpec = {
  type: 'image',
  src: openingSrc,
  alt: 'A white marble iwan with a cusped arch, opening to a reflecting pool and the Taj Mahal at dusk',
  position: '50% 50%',
}

export const goldenConfig: GoldenConfig = {
  seed: 20270417,
  /* Image opening: no gate, slow push, names reveal once the painting has landed. */
  opening: { media: openingImage },
  layout: [
    { section: 'couple' },
    { section: 'countdown' },
    { section: 'celebrations' },
    { section: 'rsvp' },
    { section: 'closing' },
  ],
}
