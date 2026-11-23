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
            <radialGradient id="mw-ember-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.45" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="8" cy="8" r="8" fill="url(#mw-ember-g)" />
        </svg>
      )
    case 'firefly':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <radialGradient id="mw-firefly-g">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.25" stopColor="currentColor" stopOpacity="0.7" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#mw-firefly-g)" />
        </svg>
      )
    case 'motia':
      /* Jasmine (motia): five rounded petals around a small heart. */
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="12" cy="6.2" rx="3.1" ry="5.4" fill="currentColor" transform={`rotate(${a} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="1.8" fill="rgba(110,80,20,0.45)" />
        </svg>
      )
    case 'khatam':
      /* Khatam: the eight-pointed star of two overlaid squares, drawn as an outline. */
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 1 L17.7 6.3 L23 12 L17.7 17.7 L12 23 L6.3 17.7 L1 12 L6.3 6.3 Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M5 5 H19 V19 H5 Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      )
    case 'rosepetal':
      /* Garden-rose petal: broad, softly notched at the crown, with a faint vein. */
      return (
        <svg viewBox="0 0 24 30" aria-hidden="true">
          <path d="M12 4 C14 1 19 1 21 5 C24 11 21 21 15 27 C13.5 28.5 12.6 29 12 29 C11.4 29 10.5 28.5 9 27 C3 21 0 11 3 5 C5 1 10 1 12 4Z" fill="currentColor" />
          <path d="M12 6 C12.8 13 12.4 21 12 27" stroke="rgba(90,40,40,0.2)" strokeWidth="0.8" fill="none" />
          <path d="M12 10 C8 12 6 15 6 19 M12 10 C16 12 18 15 18 19" stroke="rgba(90,40,40,0.14)" strokeWidth="0.7" fill="none" />
        </svg>
      )
    case 'mogra':
      /* Mogra (Arabian jasmine) bud: a slim teardrop in a small green calyx. */
      return (
        <svg viewBox="0 0 16 30" aria-hidden="true">
          <path d="M8 1 C11.5 7 12.5 14 8 24 C3.5 14 4.5 7 8 1Z" fill="currentColor" />
          <path d="M8 9 C8.4 14 8.2 19 8 23" stroke="rgba(110,90,40,0.28)" strokeWidth="0.7" fill="none" />
          <path d="M8 22 C5 22 4 26 6 29 C7 27 7.6 26 8 26 C8.4 26 9 27 10 29 C12 26 11 22 8 22Z" fill="rgba(79,95,60,0.75)" />
        </svg>
      )
    case 'zari':
      /* Zardozi fleck: a thin gold sequin with a bright spine. */
      return (
        <svg viewBox="0 0 12 28" aria-hidden="true">
          <path d="M6 0 C9 8 9 20 6 28 C3 20 3 8 6 0Z" fill="currentColor" />
          <path d="M6 3 V25" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" />
        </svg>
      )
    case 'pearl':
      /* Hyderabadi pearl: a round bead with a soft highlight. */
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <defs>
            <radialGradient id="mw-pearl-g" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="0.45" stopColor="currentColor" stopOpacity="0.95" />
              <stop offset="1" stopColor="rgba(120,100,70,0.55)" />
            </radialGradient>
          </defs>
          <circle cx="8" cy="8" r="7" fill="url(#mw-pearl-g)" />
        </svg>
      )
    case 'attar':
      /* Attar droplet: rose-water falling from the itardan. */
      return (
        <svg viewBox="0 0 16 24" aria-hidden="true">
          <path d="M8 1 C8 1 2 9 2 15 C2 19.5 4.7 23 8 23 C11.3 23 14 19.5 14 15 C14 9 8 1 8 1Z" fill="currentColor" />
          <path d="M5.2 14 C5.2 16.5 6.2 18.6 8 19.6" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" strokeLinecap="round" />
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
