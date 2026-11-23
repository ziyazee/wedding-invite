/* Punjabi Heritage (Viah) — theme: tokens, fonts and the CSS prefix.
   The prefix is baked into styles/*.css and each section's css (`.ph-*`, `--ph-*`).
   To re-skin as a new template, change the tokens/fonts here; to rename the prefix,
   find/replace `ph-` across this folder (see the new-template skill). */

export const PREFIX = 'ph'

export const tokens = {
  /* surfaces: khaddar parchment, lime-wash and sandstone, lit by winter dusk */
  bg: '#F3E4C6',
  bgDeep: '#E6CFA4',
  bgElevated: '#FAF1DF',
  /* brass and pat-silk gold (gold is the text-safe bronze; goldBright is the bright accent) */
  gold: '#8C5A22',
  goldBright: '#C9973F',
  goldDim: '#D9B26A',
  goldDeep: '#6E4A1C',
  /* ink: tahli walnut and suha maroon, never black */
  text: '#3B2519',
  textSoft: '#5A1A14',
  textMuted: '#5B3A22',
  textDim: '#85603F',
  /* atmosphere: aathan dusk, suha crimson, kanak olive, diya flame */
  dawn: '#E8914B',
  ember: '#9C1D2B',
  teal: '#5E7A2A',
  lamp: '#F6A84A',
  /* heritage palette */
  suha: '#A3191E',
  madder: '#6C1624',
  brick: '#A84A2C',
  mustard: '#F2C21C',
  ivory: '#F7EEDC',
  /* functional */
  line: 'rgba(140, 90, 34, 0.30)',
  lineStrong: 'rgba(140, 90, 34, 0.62)',
  error: '#9C1D2B',
  success: '#5E7A2A',
  /* shape + motion */
  radius: '2px',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const fonts = {
  /** Poster-weight heritage serif for names and titles. */
  display: "'Rozha One', Georgia, serif",
  body: "'Spectral', Georgia, serif",
  /** Engraved small caps for eyebrows, dates and labels. */
  caps: "'Marcellus SC', 'Spectral', Georgia, serif",
  /** Loaded by ThemeRoot. Never @import from CSS. */
  href: 'https://fonts.googleapis.com/css2?family=Rozha+One&family=Marcellus+SC&family=Spectral:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap',
} as const

export const theme = { prefix: PREFIX, tokens, fonts }
export type Theme = typeof theme
export type TokenName = keyof typeof tokens

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Inline CSS variables for the page root: --ph-bg, --ph-gold-bright, --ph-font-display, ... */
export function themeVars(t: Theme = theme): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [k, v] of Object.entries(t.tokens)) vars[`--${t.prefix}-${kebab(k)}`] = v
  vars[`--${t.prefix}-font-display`] = t.fonts.display
  vars[`--${t.prefix}-font-body`] = t.fonts.body
  vars[`--${t.prefix}-font-caps`] = t.fonts.caps
  return vars
}

/** CSS colour for a token name, with a fallback to a raw colour string. */
export function colorVar(t: Theme, name: string | undefined): string {
  if (!name) return `var(--${t.prefix}-gold)`
  return name in t.tokens ? `var(--${t.prefix}-${kebab(name)})` : name
}
