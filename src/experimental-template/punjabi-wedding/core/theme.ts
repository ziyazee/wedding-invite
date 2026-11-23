/* Punjabi Wedding (Bagh-e-Anand) — theme: tokens, fonts and the CSS prefix.
   The prefix is baked into styles/*.css and each section's css (`.pb-*`, `--pb-*`).
   Sunlit pearl-ivory, rosewater silk and carved-pavilion gold, with plum-maroon ink. */

export const PREFIX = 'pb'

export const tokens = {
  /* surfaces: sunlit ivory-blush silk */
  bg: '#fdf6f4',
  bgDeep: '#f5e5e2',
  bgElevated: '#fffbfa',
  /* carved pavilion gold */
  gold: '#b58024',
  goldBright: '#d49b35',
  goldDim: '#cca45b',
  goldDeep: '#eed9b0',
  /* text: royal maroon-plum */
  text: '#3d1822',
  textSoft: '#562432',
  textMuted: '#7a4654',
  textDim: '#9b6b78',
  /* garden atmosphere */
  dawn: '#e47a93',
  ember: '#b8294b',
  teal: '#5c7c58',
  lamp: '#f3c969',
  /* functional */
  line: 'rgba(181, 128, 36, 0.30)',
  lineStrong: 'rgba(181, 128, 36, 0.62)',
  error: '#b8294b',
  success: '#5c7c58',
  /* shape + motion */
  radius: '2px',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const fonts = {
  display: "'Cormorant Infant', Georgia, serif",
  body: "'Plus Jakarta Sans', system-ui, sans-serif",
  /** Reserved for the Ik Onkar invocation only. */
  gurmukhi: "'Noto Serif Gurmukhi', 'Cormorant Infant', serif",
  /** Loaded by ThemeRoot. Never @import from CSS. */
  href: 'https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500&family=Noto+Serif+Gurmukhi:wght@400;600&display=swap',
} as const

export const theme = { prefix: PREFIX, tokens, fonts }
export type Theme = typeof theme
export type TokenName = keyof typeof tokens

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Inline CSS variables for the page root: --pb-bg, --pb-gold-bright, --pb-font-display, ... */
export function themeVars(t: Theme = theme): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [k, v] of Object.entries(t.tokens)) vars[`--${t.prefix}-${kebab(k)}`] = v
  vars[`--${t.prefix}-font-display`] = t.fonts.display
  vars[`--${t.prefix}-font-body`] = t.fonts.body
  vars[`--${t.prefix}-font-gurmukhi`] = t.fonts.gurmukhi
  return vars
}

/** CSS colour for a token name, with a fallback to a raw colour string. */
export function colorVar(t: Theme, name: string | undefined): string {
  if (!name) return `var(--${t.prefix}-gold)`
  return name in t.tokens ? `var(--${t.prefix}-${kebab(name)})` : name
}
