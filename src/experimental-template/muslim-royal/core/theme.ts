/* Muslim Royal — theme: tokens, fonts and the CSS prefix.
   The prefix is baked into styles/*.css and each section's css (`.mr-*`, `--mr-*`).
   To re-skin as a new template, change the tokens/fonts here; to rename the prefix,
   find/replace `mr-` across this folder (see the new-template skill). */

export const PREFIX = 'mr'

export const tokens = {
  /* surfaces: Makrana marble, ivory silk and warm sandstone under lamplight */
  bg: '#F6EEDC',
  bgDeep: '#EADFC4',
  bgElevated: '#FCF7EA',
  /* brass and zardozi gold (gold is the text-safe bronze; goldBright is the bright accent) */
  gold: '#8A6420',
  goldBright: '#C99A3C',
  goldDim: '#DCBE7A',
  goldDeep: '#654514',
  /* ink: deep emerald-black and bottle green, never pure black */
  text: '#14281F',
  textSoft: '#0F5A3E',
  textMuted: '#34493D',
  textDim: '#66786B',
  /* atmosphere: dusk sapphire, ruby, lamp glow */
  dawn: '#D98C4A',
  ember: '#8E1B33',
  teal: '#0F6B4E',
  lamp: '#F5BE5A',
  /* heritage palette */
  emerald: '#0E5A40',
  emeraldDeep: '#093A2A',
  night: '#0A1630',
  sapphire: '#1E3F8C',
  ruby: '#8E1B33',
  rose: '#B8334A',
  ivory: '#FBF5E4',
  /* functional */
  line: 'rgba(138, 100, 32, 0.30)',
  lineStrong: 'rgba(138, 100, 32, 0.62)',
  error: '#8E1B33',
  success: '#0F6B4E',
  /* shape + motion */
  radius: '2px',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const fonts = {
  /** High-contrast royal serif for names and titles. */
  display: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
  body: "'Cormorant Garamond', Georgia, serif",
  /** Inscriptional caps for eyebrows, dates and labels. */
  caps: "'Cinzel', 'Cormorant Garamond', Georgia, serif",
  /** Naskh for calligraphy (Bismillah, dua, short phrases). */
  arabic: "'Amiri', 'Scheherazade New', serif",
  /** Kufi for small headings in Arabic script. */
  kufi: "'Reem Kufi', 'Amiri', serif",
  /** Loaded by ThemeRoot. Never @import from CSS. */
  href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Cinzel:wght@400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400&family=Reem+Kufi:wght@400;500;600&display=swap',
} as const

export const theme = { prefix: PREFIX, tokens, fonts }
export type Theme = typeof theme
export type TokenName = keyof typeof tokens

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Inline CSS variables for the page root: --mr-bg, --mr-gold-bright, --mr-font-display, ... */
export function themeVars(t: Theme = theme): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [k, v] of Object.entries(t.tokens)) vars[`--${t.prefix}-${kebab(k)}`] = v
  vars[`--${t.prefix}-font-display`] = t.fonts.display
  vars[`--${t.prefix}-font-body`] = t.fonts.body
  vars[`--${t.prefix}-font-caps`] = t.fonts.caps
  vars[`--${t.prefix}-font-arabic`] = t.fonts.arabic
  vars[`--${t.prefix}-font-kufi`] = t.fonts.kufi
  return vars
}

/** CSS colour for a token name, with a fallback to a raw colour string. */
export function colorVar(t: Theme, name: string | undefined): string {
  if (!name) return `var(--${t.prefix}-gold)`
  return name in t.tokens ? `var(--${t.prefix}-${kebab(name)})` : name
}
