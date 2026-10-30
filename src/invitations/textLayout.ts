// Persisted with each order. IDs describe a template, section and form field;
// they must never depend on entered text or a celebration's display order.
export const textFonts = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'Arial, Helvetica, sans-serif',
  classic: '"Times New Roman", Times, serif',
  mono: '"Courier New", monospace',
} as const
export type TextOverride = {
  fontSize?: number
  fontFamily?: keyof typeof textFonts
  color?: string
  x?: number
  y?: number
  hidden?: boolean
  content?: string
}
export type TextLayout = { version: 1; elements: Record<string, TextOverride> }
export const emptyTextLayout = (): TextLayout => ({ version: 1, elements: {} })
export const textIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,159}$/

export function readTextLayout(value: unknown): TextLayout {
  const result = emptyTextLayout()
  if (!value || typeof value !== 'object') return result
  const data = value as Partial<TextLayout>
  if (data.version !== 1 || !data.elements || typeof data.elements !== 'object' || Array.isArray(data.elements)) return result
  for (const [id, raw] of Object.entries(data.elements).slice(0, 300)) {
    if (!textIdPattern.test(id) || !raw || typeof raw !== 'object') continue
    const entry: TextOverride = {}
    if (typeof raw.fontSize === 'number' && Number.isFinite(raw.fontSize) && raw.fontSize >= 8 && raw.fontSize <= 160) entry.fontSize = raw.fontSize
    if (typeof raw.fontFamily === 'string' && Object.hasOwn(textFonts, raw.fontFamily)) entry.fontFamily = raw.fontFamily
    if (typeof raw.color === 'string' && /^#[0-9a-f]{6}$/i.test(raw.color)) entry.color = raw.color
    for (const axis of ['x', 'y'] as const) {
      const n = raw[axis]
      if (typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 1) entry[axis] = n
    }
    if (typeof raw.hidden === 'boolean') entry.hidden = raw.hidden
    if (typeof raw.content === 'string' && raw.content.length <= 500) entry.content = raw.content
    if (Object.keys(entry).length) result.elements[id] = entry
  }
  return result
}

export function editableText(template: number | undefined, section: string, field: string, label: string) {
  return template ? { 'data-invite-text': `t${template}.${section}.${field}`, 'data-invite-label': label } : {}
}
