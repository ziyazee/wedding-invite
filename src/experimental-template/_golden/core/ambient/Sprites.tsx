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
            <radialGradient id="gd-ember-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.45" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="8" cy="8" r="8" fill="url(#gd-ember-g)" />
        </svg>
      )
    case 'firefly':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <radialGradient id="gd-firefly-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.25" stopColor="currentColor" stopOpacity="0.7" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#gd-firefly-g)" />
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
