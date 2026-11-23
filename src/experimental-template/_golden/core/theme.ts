/* Golden — theme: tokens, fonts and the CSS prefix.
   The prefix is baked into styles/*.css and each section's css (`.gd-*`, `--gd-*`).
   To re-skin as a new template, change the tokens/fonts here; to rename the prefix,
   find/replace `gd-` across this folder (see the new-template skill). */

export const PREFIX = 'gd'

export const tokens = {
  /* surfaces */
  bg: '#0e1420',
  bgDeep: '#080c14',
  bgElevated: '#151d2d',
  /* gold scale */
  gold: '#d4a843',
  goldBright: '#e8c65a',
  goldDim: '#9a7b2e',
  goldDeep: '#5c4410',
  /* text */
  text: '#faf3e6',
  textSoft: '#f5e6c8',
  textMuted: '#c9b89a',
  textDim: '#8a7d6a',
  /* atmosphere (kerala-dawn warmth) */
  dawn: '#e8a076',
  ember: '#d4763a',
  teal: '#2e5e5a',
  lamp: '#ffe4a0',
  /* functional */
  line: 'rgba(212, 168, 67, 0.28)',
  lineStrong: 'rgba(212, 168, 67, 0.55)',
  error: '#e8665a',
  success: '#6aaf6a',
  /* shape + motion */
  radius: '2px',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const fonts = {
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Outfit', system-ui, sans-serif",
  /** Loaded by ThemeRoot. Never @import from CSS. */
  href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500&display=swap',
} as const

export const theme = { prefix: PREFIX, tokens, fonts }
export type Theme = typeof theme
export type TokenName = keyof typeof tokens

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Inline CSS variables for the page root: --gd-bg, --gd-gold-bright, --gd-font-display, ... */
export function themeVars(t: Theme = theme): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [k, v] of Object.entries(t.tokens)) vars[`--${t.prefix}-${kebab(k)}`] = v
  vars[`--${t.prefix}-font-display`] = t.fonts.display
  vars[`--${t.prefix}-font-body`] = t.fonts.body
  return vars
}

/** CSS colour for a token name, with a fallback to a raw colour string. */
export function colorVar(t: Theme, name: string | undefined): string {
  if (!name) return `var(--${t.prefix}-gold)`
  return name in t.tokens ? `var(--${t.prefix}-${kebab(name)})` : name
}
