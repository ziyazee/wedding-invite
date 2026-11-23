/* Muslim Wedding (Noor-e-Alabaster) — theme: tokens, fonts and the CSS prefix.
   The prefix is baked into styles/*.css and each section's css (`.mw-*`, `--mw-*`).
   To re-skin as a new template, change the tokens/fonts here; to rename the prefix,
   find/replace `mw-` across this folder (see the new-template skill). */

export const PREFIX = 'mw'

export const tokens = {
  /* surfaces: warm alabaster, taken from the sunlit Opening film */
  bg: '#F6F0E6',
  bgDeep: '#EBE1D1',
  bgElevated: '#FCF9F4',
  /* antique brass / champagne zardozi */
  gold: '#A87C2D',
  goldBright: '#C99E48',
  goldDim: '#846022',
  goldDeep: '#4E3710',
  /* ink: walnut espresso */
  text: '#261C14',
  textSoft: '#423326',
  textMuted: '#6E5A47',
  textDim: '#96826D',
  /* atmosphere */
  dawn: '#D9C2A3',
  ember: '#B8894A',
  teal: '#586B53',
  lamp: '#F3DFB2',
  /* nikah accents: deep rose, jade, pearl, blush petal */
  rose: '#8E3B4A',
  jade: '#1F4B47',
  pearl: '#EFE9DE',
  blush: '#E3BFB6',
  /* functional */
  line: 'rgba(168, 124, 45, 0.26)',
  lineStrong: 'rgba(168, 124, 45, 0.52)',
  error: '#B4483C',
  success: '#4F7A4F',
  /* shape + motion */
  radius: '2px',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const fonts = {
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Plus Jakarta Sans', system-ui, sans-serif",
  /** Loaded by ThemeRoot. Never @import from CSS. */
  href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap',
} as const
export const theme = { prefix: PREFIX, tokens, fonts }
export type Theme = typeof theme
export type TokenName = keyof typeof tokens

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Inline CSS variables for the page root: --mw-bg, --mw-gold-bright, --mw-font-display, ... */
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
