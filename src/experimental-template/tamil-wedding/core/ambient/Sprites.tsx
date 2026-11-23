/* Golden — vector particle sprites. Inline SVG, tinted with currentColor, no image assets. */

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
            <radialGradient id="tm-ember-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.45" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="8" cy="8" r="8" fill="url(#tm-ember-g)" />
        </svg>
      )
    case 'firefly':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <radialGradient id="tm-firefly-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.25" stopColor="currentColor" stopOpacity="0.7" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#tm-firefly-g)" />
        </svg>
      )
    case 'malli': // jasmine bud: closed teardrop with a short calyx
      return (
        <svg viewBox="0 0 16 28" aria-hidden="true">
          <path d="M8 1 C13 8 13 17 8 24 C3 17 3 8 8 1Z" fill="currentColor" />
          <path d="M8 5 C9 11 9 17 8 22" stroke="rgba(110,70,20,0.28)" strokeWidth="0.7" fill="none" />
          <path d="M5 24 L8 27 L11 24 C9.5 25 6.5 25 5 24Z" fill="#6d9a4a" />
        </svg>
      )
    case 'kanakambaram': // crossandra: five-lobed fan blossom
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12 C6 9 4 3 8 2 C11 2 12 8 12 12Z M12 12 C14 5 20 3 22 7 C22 11 16 12 12 12Z M12 12 C18 12 23 16 20 19 C17 21 13 16 12 12Z M12 12 C9 17 5 22 2 19 C1 16 7 13 12 12Z M12 12 C6 13 1 10 2 7 C4 5 10 9 12 12Z" fill="currentColor" />
          <circle cx="12" cy="12" r="1.8" fill="rgba(255,240,200,0.85)" />
        </svg>
      )
    case 'shenbagam': // champaca: slim, pointed, overlapping petals
      return (
        <svg viewBox="0 0 24 32" aria-hidden="true">
          <path d="M12 1 C16 8 16 19 12 28 C8 19 8 8 12 1Z" fill="currentColor" />
          <path d="M12 6 C20 8 22 18 14 27 C16 19 15 11 12 6Z" fill="currentColor" opacity="0.75" />
          <path d="M12 6 C4 8 2 18 10 27 C8 19 9 11 12 6Z" fill="currentColor" opacity="0.6" />
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
