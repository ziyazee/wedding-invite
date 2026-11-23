/* Muslim Royal — vector particle sprites. Inline SVG, tinted with currentColor, no image assets. */

import type { SpriteKind } from '../contract'

export function Sprite({ kind }: { kind: SpriteKind }) {
  switch (kind) {
    case 'sparkle':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0 C12.8 7.2 16.8 11.2 24 12 C16.8 12.8 12.8 16.8 12 24 C11.2 16.8 7.2 12.8 0 12 C7.2 11.2 11.2 7.2 12 0Z" fill="currentColor" />
        </svg>
      )
    case 'petal':
      return (
        <svg viewBox="0 0 24 32" aria-hidden="true">
          <path d="M12 1 C20 8 22 20 12 31 C2 20 4 8 12 1Z" fill="currentColor" />
          <path d="M12 6 C12.6 14 12.4 22 12 28" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" fill="none" />
        </svg>
      )
    case 'leaf':
      return (
        <svg viewBox="0 0 24 32" aria-hidden="true">
          <path d="M12 1 C23 10 21 25 12 31 C3 25 1 10 12 1Z" fill="currentColor" />
          <path d="M12 4 L12 30 M12 12 L7 8 M12 18 L17 13 M12 24 L8 21" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" fill="none" />
        </svg>
      )
    case 'ember':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <defs>
            <radialGradient id="mr-ember-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.45" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="8" cy="8" r="8" fill="url(#mr-ember-g)" />
        </svg>
      )
    case 'firefly':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <radialGradient id="mr-firefly-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.25" stopColor="currentColor" stopOpacity="0.7" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#mr-firefly-g)" />
        </svg>
      )
    case 'star8':
      /* Khatam: an eight-point star from two squares, with a small centre. */
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 1 L15 9 L23 12 L15 15 L12 23 L9 15 L1 12 L9 9Z" fill="currentColor" />
          <path d="M4.2 4.2 L10 8 L8 10Z M19.8 4.2 L16 10 L14 8Z M4.2 19.8 L8 14 L10 16Z M19.8 19.8 L14 16 L16 14Z" fill="currentColor" opacity="0.7" />
          <circle cx="12" cy="12" r="1.7" fill="rgba(255,248,225,0.75)" />
        </svg>
      )
    case 'hilal':
      /* A slim crescent. */
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 2 C8 2 3 7 3 13 C3 19 8 23 14 23 C17.5 23 20.5 21.4 22 19 C19 20.6 14 20 11 16.5 C8 13 9 6.5 16 2Z" fill="currentColor" />
        </svg>
      )
    case 'rose':
      /* A rose petal: cupped, with a soft crease. */
      return (
        <svg viewBox="0 0 24 28" aria-hidden="true">
          <path d="M12 27 C3 22 1 12 6 6 C8.5 3 11 5 12 2 C13 5 15.5 3 18 6 C23 12 21 22 12 27Z" fill="currentColor" />
          <path d="M12 24 C10 18 10 12 12 7 M8 21 C6 16 7 11 9 8 M16 21 C18 16 17 11 15 8" stroke="rgba(60,0,16,0.25)" strokeWidth="0.7" fill="none" />
        </svg>
      )
    case 'mogra':
      /* Jasmine: five narrow petals and a pale heart. */
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 1 C14 5 14 9 12 12 C10 9 10 5 12 1Z M22.5 9 C18.5 9.5 15 11 12 12 C14.5 8.5 18 7.5 22.5 9Z M18.5 22 C15.5 19 13 15.5 12 12 C16 13 18.5 16.5 18.5 22Z M5.5 22 C5.5 16.5 8 13 12 12 C11 15.5 8.5 19 5.5 22Z M1.5 9 C6 7.5 9.5 8.5 12 12 C9 11 5.5 9.5 1.5 9Z" fill="currentColor" />
          <circle cx="12" cy="12" r="1.8" fill="rgba(210,170,70,0.85)" />
        </svg>
      )
    case 'zarr':
      /* Zari dust: a tiny four-point glint with a halo. */
      return (
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <circle cx="6" cy="6" r="5" fill="currentColor" opacity="0.18" />
          <path d="M6 0.5 L7.2 4.8 L11.5 6 L7.2 7.2 L6 11.5 L4.8 7.2 L0.5 6 L4.8 4.8Z" fill="currentColor" />
        </svg>
      )
    case 'flame':
      /* A lamp flame that rises from the wick, warm all the way through. */
      return (
        <svg viewBox="0 0 16 24" aria-hidden="true">
          <defs>
            <radialGradient id="mr-flame-g" cx="0.5" cy="0.7" r="0.6">
              <stop offset="0" stopColor="#FFF3D6" stopOpacity="1" />
              <stop offset="0.4" stopColor="currentColor" stopOpacity="0.95" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M8 1 C12 8 15 12 15 16 C15 20 12 23 8 23 C4 23 1 20 1 16 C1 12 4 8 8 1Z" fill="url(#mr-flame-g)" />
        </svg>
      )
    case 'girih':
      /* A girih bow-tie: two joined kites, edges on the 36-degree grid. */
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12 L2 4 L5 12 L2 20Z M12 12 L22 4 L19 12 L22 20Z" fill="currentColor" fillRule="evenodd" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        </svg>
      )
    case 'mote':
    default:
      return (
        <svg viewBox="0 0 8 8" aria-hidden="true">
          <circle cx="4" cy="4" r="3" fill="currentColor" />
        </svg>
      )
  }
}
