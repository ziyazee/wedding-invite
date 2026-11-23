/* Punjabi Heritage — vector particle sprites. Inline SVG, tinted with currentColor, no image assets. */

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
            <radialGradient id="ph-ember-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.45" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="8" cy="8" r="8" fill="url(#ph-ember-g)" />
        </svg>
      )
    case 'firefly':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <radialGradient id="ph-firefly-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.25" stopColor="currentColor" stopOpacity="0.7" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#ph-firefly-g)" />
        </svg>
      )
    case 'sarhon':
      /* Mustard blossom: four notched petals around a small heart. */
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 C15 4 15 8 12 11 C9 8 9 4 12 2Z" fill="currentColor" />
          <path d="M22 12 C20 15 16 15 13 12 C16 9 20 9 22 12Z" fill="currentColor" />
          <path d="M12 22 C9 20 9 16 12 13 C15 16 15 20 12 22Z" fill="currentColor" />
          <path d="M2 12 C4 9 8 9 11 12 C8 15 4 15 2 12Z" fill="currentColor" />
          <circle cx="12" cy="12" r="2" fill="rgba(110,74,28,0.55)" />
        </svg>
      )
    case 'kanak':
      /* A single ear of wheat with awns. */
      return (
        <svg viewBox="0 0 16 40" aria-hidden="true">
          <path d="M8 38 V12" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M8 14 C4 12 4 7 8 4 C12 7 12 12 8 14Z M8 22 C3 20 3 14 8 11 C13 14 13 20 8 22Z M8 30 C3 28 3 22 8 19 C13 22 13 28 8 30Z" fill="currentColor" />
          <path d="M8 4 V0 M6 6 L4 1 M10 6 L12 1" stroke="currentColor" strokeWidth="0.8" fill="none" />
        </svg>
      )
    case 'genda':
      /* A marigold petal: broad, fluted tip. */
      return (
        <svg viewBox="0 0 24 28" aria-hidden="true">
          <path d="M12 27 C4 20 2 11 6 5 C8 2 10 4 12 2 C14 4 16 2 18 5 C22 11 20 20 12 27Z" fill="currentColor" />
          <path d="M12 24 V8 M9 22 C8 16 8 12 9 8 M15 22 C16 16 16 12 15 8" stroke="rgba(110,74,28,0.28)" strokeWidth="0.7" fill="none" />
        </svg>
      )
    case 'flame':
      /* A diya flame that rises from the lamp, warm all the way through. */
      return (
        <svg viewBox="0 0 16 24" aria-hidden="true">
          <defs>
            <radialGradient id="ph-flame-g" cx="0.5" cy="0.7" r="0.6">
              <stop offset="0" stopColor="#FFF3D6" stopOpacity="1" />
              <stop offset="0.4" stopColor="currentColor" stopOpacity="0.95" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M8 1 C12 8 15 12 15 16 C15 20 12 23 8 23 C4 23 1 20 1 16 C1 12 4 8 8 1Z" fill="url(#ph-flame-g)" />
        </svg>
      )
    case 'kalire':
      /* A small dome ornament hanging on a thread. */
      return (
        <svg viewBox="0 0 20 34" aria-hidden="true">
          <path d="M10 0 V9" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M2 20 C2 13 6 9 10 9 C14 9 18 13 18 20 Z" fill="currentColor" />
          <path d="M2 20 C4 22 6 20 7 22 C8 20 12 20 13 22 C14 20 16 22 18 20" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="4" cy="27" r="1.6" fill="currentColor" />
          <circle cx="10" cy="29" r="1.8" fill="currentColor" />
          <circle cx="16" cy="27" r="1.6" fill="currentColor" />
          <path d="M4 22 V26 M10 22 V28 M16 22 V26" stroke="currentColor" strokeWidth="0.7" fill="none" />
        </svg>
      )
    case 'bagh':
      /* A counted-stitch diamond: the phulkari motif, edges at 45 and 90 degrees only. */
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 1 L23 12 L12 23 L1 12Z M12 6 L18 12 L12 18 L6 12Z" fill="currentColor" fillRule="evenodd" />
          <rect x="10.4" y="10.4" width="3.2" height="3.2" fill="currentColor" />
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
