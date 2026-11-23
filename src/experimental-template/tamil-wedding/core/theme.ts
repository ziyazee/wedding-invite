/* Tamil Wedding — theme: tokens, fonts and the CSS prefix.
   The prefix is baked into styles/*.css and each section's css (`.tm-*`, `--tm-*`).
   To re-skin as a new template, change the tokens/fonts here; to rename the prefix,
   find/replace `tm-` across this folder (see the new-template skill). */

export const PREFIX = 'tm'

export const tokens = {
  /* surfaces: malli-ivory cotton-rag parchment */
  bg: '#f2ead9',
  bgDeep: '#e8dcc3',
  bgElevated: '#faf4e6',
  /* zari + antique brass */
  gold: '#9e6f24',
  goldBright: '#c48f34',
  goldDim: '#b69358',
  goldDeep: '#e4cfa3',
  /* text: arakku lac-maroon and burma-teak ink (never black) */
  text: '#4a1815',
  textSoft: '#6b2520',
  textMuted: '#824b3a',
  textDim: '#9e705c',
  /* atmosphere: kanakambaram, kungumam, mayil, manjal */
  dawn: '#e07856',
  ember: '#b8291e',
  teal: '#28665f',
  lamp: '#e0a024',
  /* functional */
  line: 'rgba(158, 111, 36, 0.28)',
  lineStrong: 'rgba(158, 111, 36, 0.58)',
  error: '#b8291e',
  success: '#4e8a2c',
  /* shape + motion */
  radius: '2px',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const fonts = {
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Plus Jakarta Sans', system-ui, sans-serif",
  /** Reserved for the Pillaiyar Suzhi invocation and the Tamil eyebrow only. */
  tamil: "'Noto Serif Tamil', 'Cormorant Garamond', serif",
  /** Loaded by ThemeRoot. Never @import from CSS. */
  href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500&family=Noto+Serif+Tamil:wght@400;600&display=swap',
} as const

export const theme = { prefix: PREFIX, tokens, fonts }
export type Theme = typeof theme
export type TokenName = keyof typeof tokens

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Inline CSS variables for the page root: --tm-bg, --tm-gold-bright, --tm-font-display, ... */
export function themeVars(t: Theme = theme): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [k, v] of Object.entries(t.tokens)) vars[`--${t.prefix}-${kebab(k)}`] = v
  vars[`--${t.prefix}-font-display`] = t.fonts.display
  vars[`--${t.prefix}-font-body`] = t.fonts.body
  vars[`--${t.prefix}-font-tamil`] = t.fonts.tamil
  return vars
}

/** CSS colour for a token name, with a fallback to a raw colour string. */
export function colorVar(t: Theme, name: string | undefined): string {
  if (!name) return `var(--${t.prefix}-gold)`
  return name in t.tokens ? `var(--${t.prefix}-${kebab(name)})` : name
}
