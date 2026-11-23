/* Garden Wedding — vector particle sprites. Inline SVG, tinted with currentColor, no image assets. */

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
    case 'marigold': {
      /* Ruffled marigold head: two rings of round petals around a centre. */
      const outer = Array.from({ length: 10 }, (_, i) => i * 36)
      const inner = Array.from({ length: 7 }, (_, i) => i * (360 / 7) + 12)
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {outer.map((a) => (
            <ellipse key={a} cx="16" cy="6.5" rx="4" ry="6" fill="currentColor" transform={`rotate(${a} 16 16)`} />
          ))}
          {inner.map((a) => (
            <ellipse key={a} cx="16" cy="10" rx="3" ry="4.6" fill="rgba(255,255,255,0.22)" transform={`rotate(${a} 16 16)`} />
          ))}
          <circle cx="16" cy="16" r="3" fill="rgba(0,0,0,0.25)" />
        </svg>
      )
    }
    case 'rosepetal':
      return (
        <svg viewBox="0 0 24 28" aria-hidden="true">
          <path d="M12 2 C20 2 24 10 20 18 C17 24 7 24 4 18 C0 10 4 2 12 2Z" fill="currentColor" />
          <path d="M12 4 C11 10 11 16 12 22" stroke="rgba(0,0,0,0.14)" strokeWidth="0.7" fill="none" />
        </svg>
      )
    case 'jasmine': {
      const petals = [0, 72, 144, 216, 288]
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {petals.map((a) => (
            <ellipse key={a} cx="12" cy="6" rx="3" ry="6" fill="currentColor" transform={`rotate(${a} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="1.8" fill="rgba(184,132,42,0.9)" />
        </svg>
      )
    }
    case 'ember':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <defs>
            <radialGradient id="gw-ember-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.45" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="8" cy="8" r="8" fill="url(#gw-ember-g)" />
        </svg>
      )
    case 'firefly':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <radialGradient id="gw-firefly-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.25" stopColor="currentColor" stopOpacity="0.7" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#gw-firefly-g)" />
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
