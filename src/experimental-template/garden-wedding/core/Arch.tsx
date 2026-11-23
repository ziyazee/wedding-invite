/* Garden Wedding — the Mughal cusped-arch cap used by the family cards.
   A multifoil double-line arch with a lotus-bud finial, stretched to the card width
   (strokes stay 1px via non-scaling-stroke). The card body is drawn in CSS. */

const OUTER =
  'M1 90 V64 A18 18 0 0 1 22 44 A18 18 0 0 1 48 28 A19 19 0 0 1 80 16 A19 19 0 0 1 112 8 A22 22 0 0 1 150 2 ' +
  'A22 22 0 0 1 188 8 A19 19 0 0 1 220 16 A19 19 0 0 1 252 28 A18 18 0 0 1 278 44 A18 18 0 0 1 299 64 V90'
const INNER =
  'M9 90 V66 A15 15 0 0 1 28 49 A15 15 0 0 1 52 34 A16 16 0 0 1 82 23 A16 16 0 0 1 113 16 A19 19 0 0 1 150 10 ' +
  'A19 19 0 0 1 187 16 A16 16 0 0 1 218 23 A16 16 0 0 1 248 34 A15 15 0 0 1 272 49 A15 15 0 0 1 291 66 V90'

/** Eight-point Mughal star medallion holding the family initial. */
export function Medallion({ initial }: { initial: string }) {
  return (
    <svg className="gw-arch__medallion" viewBox="0 0 56 56" aria-hidden="true">
      <rect className="gw-arch__line" x="10" y="10" width="36" height="36" />
      <rect className="gw-arch__line" x="10" y="10" width="36" height="36" transform="rotate(45 28 28)" />
      <rect className="gw-arch__line gw-arch__line--soft" x="16" y="16" width="24" height="24" transform="rotate(22.5 28 28)" />
      <rect className="gw-arch__line gw-arch__line--soft" x="16" y="16" width="24" height="24" transform="rotate(67.5 28 28)" />
      <text x="28" y="35" textAnchor="middle" className="gw-arch__initial">
        {initial}
      </text>
    </svg>
  )
}

/** Lotus that sits on the card's bottom border. */
export function BaseLotus() {
  return (
    <svg className="gw-arch__lotus" viewBox="0 0 64 28" aria-hidden="true">
      <path className="gw-arch__lotus-bg" d="M0 27 H64 V28 H0Z" />
      <path className="gw-arch__line" d="M32 2 C38 8 38 18 32 26 C26 18 26 8 32 2Z" />
      <path className="gw-arch__line" d="M32 26 C24 25 17 20 16 11 C23 12 30 17 32 26" />
      <path className="gw-arch__line" d="M32 26 C40 25 47 20 48 11 C41 12 34 17 32 26" />
      <path className="gw-arch__line" d="M32 26 C21 27 11 24 6 18 C14 17 25 20 32 26" />
      <path className="gw-arch__line" d="M32 26 C43 27 53 24 58 18 C50 17 39 20 32 26" />
    </svg>
  )
}

/** Leaf sprig for the lower corners (mirrored in CSS for the right side). */
export function Sprig({ side }: { side: 'l' | 'r' }) {
  return (
    <svg className={`gw-arch__sprig gw-arch__sprig--${side}`} viewBox="0 0 48 48" aria-hidden="true">
      <path className="gw-arch__line" d="M4 44 C4 28 14 16 30 12" />
      <path className="gw-arch__line" d="M8 34 C14 36 20 34 22 28 C16 26 10 28 8 34Z" />
      <path className="gw-arch__line" d="M14 24 C20 26 26 24 28 18 C22 16 16 18 14 24Z" />
      <path className="gw-arch__line" d="M22 17 C26 12 32 12 36 14 C34 18 28 20 22 17Z" />
      <circle className="gw-arch__dot" cx="31" cy="11" r="2.2" />
    </svg>
  )
}

/** Vine flourish under the name. */
export function NameFlourish() {
  return (
    <svg className="gw-arch__flourish" viewBox="0 0 180 18" aria-hidden="true">
      <path className="gw-arch__line" d="M0 9 H62 C70 9 74 4 80 4 C84 4 86 8 83 10 M180 9 H118 C110 9 106 4 100 4 C96 4 94 8 97 10" />
      <path className="gw-arch__line" d="M90 2 L96 9 L90 16 L84 9Z" />
      <circle className="gw-arch__dot" cx="90" cy="9" r="1.6" />
    </svg>
  )
}

export function ArchCap() {
  return (
    <svg className="gw-arch__cap" viewBox="0 -16 300 106" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="gw-jaali" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M7 0 L14 7 L7 14 L0 7Z" fill="none" stroke="rgba(184,132,42,0.22)" strokeWidth="0.6" />
          <circle cx="7" cy="7" r="0.9" fill="rgba(184,132,42,0.3)" />
        </pattern>
      </defs>
      <path className="gw-arch__fill" d={`${OUTER} Z`} />
      <path className="gw-arch__fill gw-arch__fill--jaali" d={`${OUTER} Z`} />
      <path className="gw-arch__line" d={OUTER} />
      <path className="gw-arch__line gw-arch__line--soft" d={INNER} />
      <path className="gw-arch__line" d="M150 2 C143 -4 145 -10 150 -15 C155 -10 157 -4 150 2Z" />
    </svg>
  )
}
