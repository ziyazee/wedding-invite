/* Garden Wedding — theme: tokens, fonts and the CSS prefix.
   The prefix is baked into styles/*.css and each section's css (`.gw-*`, `--gw-*`).
   To re-skin as a new template, change the tokens/fonts here; to rename the prefix,
   find/replace `gw-` across this folder (see the new-template skill). */

export const PREFIX = 'gw'

export const tokens = {
  /* surfaces: cream, blush and parchment, like sun on the mandap */
  bg: '#fbf3e8',
  bgDeep: '#f3e6d6',
  bgElevated: '#fff9f1',
  /* marigold-gold scale, deepened for contrast on cream */
  gold: '#b8842a',
  goldBright: '#9c6a14',
  goldDim: '#cfa95e',
  goldDeep: '#ead7ae',
  /* text: warm rosewood browns */
  text: '#3a2a1e',
  textSoft: '#4d3a2c',
  textMuted: '#6e5a48',
  textDim: '#8d7a68',
  /* garden atmosphere */
  dawn: '#e0803f',
  ember: '#c0392f',
  teal: '#7d9468',
  lamp: '#e8b94f',
  rose: '#d96b8c',
  /* functional */
  line: 'rgba(184, 132, 42, 0.32)',
  lineStrong: 'rgba(184, 132, 42, 0.6)',
  error: '#c0392f',
  success: '#5f8a45',
  /* shape + motion */
  radius: '2px',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const fonts = {
  display: "'Cormorant Garamond', 'Tiro Devanagari Hindi', Georgia, serif",
  body: "'Jost', system-ui, sans-serif",
  deva: "'Tiro Devanagari Hindi', 'Cormorant Garamond', serif",
  /** Loaded by ThemeRoot. Never @import from CSS. */
  href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&family=Tiro+Devanagari+Hindi&display=swap',
} as const

export const theme = { prefix: PREFIX, tokens, fonts }
export type Theme = typeof theme
export type TokenName = keyof typeof tokens

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Inline CSS variables for the page root: --gw-bg, --gw-gold-bright, --gw-font-display, ... */
export function themeVars(t: Theme = theme): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [k, v] of Object.entries(t.tokens)) vars[`--${t.prefix}-${kebab(k)}`] = v
  vars[`--${t.prefix}-font-display`] = t.fonts.display
  vars[`--${t.prefix}-font-body`] = t.fonts.body
  vars[`--${t.prefix}-font-deva`] = t.fonts.deva
  return vars
}

/** CSS colour for a token name, with a fallback to a raw colour string. */
export function colorVar(t: Theme, name: string | undefined): string {
  if (!name) return `var(--${t.prefix}-gold)`
  return name in t.tokens ? `var(--${t.prefix}-${kebab(name)})` : name
}
