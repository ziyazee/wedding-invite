import type { CSSProperties } from 'react'

// --- Rule config per element ---

export type TextRuleConfig = {
  /** Characters before any scaling kicks in */
  maxChars: number
  /** Stop shrinking at this scale (0–1). Below this, text wraps instead. */
  minScale: number
  /** How many lines to allow once wrapping kicks in (default 2) */
  maxLines?: number
}

// --- Per-template rule map ---

/** Maps element textId suffixes (e.g. "opening.groom") to their rule config */
export type TemplateTextRules = Record<string, TextRuleConfig>

// --- Engine ---

export function applyTextRule(
  text: string,
  rule: TextRuleConfig | undefined,
): CSSProperties | undefined {
  if (!rule || text.length <= rule.maxChars) return undefined

  const overflow = text.length - rule.maxChars
  const scaleRange = rule.maxChars
  const rawScale = 1 - overflow / scaleRange

  const clampedScale = Math.max(rule.minScale, Math.min(1, rawScale))

  if (clampedScale > rule.minScale) {
    return { fontSize: `${clampedScale}em`, whiteSpace: 'nowrap' }
  }

  const lines = rule.maxLines ?? 2
  return {
    fontSize: `${rule.minScale}em`,
    whiteSpace: 'normal',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    wordBreak: 'break-word',
  }
}

// --- Registry ---

const registry = new Map<string, TemplateTextRules>()

export function registerTemplateRules(templatePrefix: string, rules: TemplateTextRules) {
  registry.set(templatePrefix, rules)
}

export function getRuleForElement(textId: string): TextRuleConfig | undefined {
  const dot = textId.indexOf('.')
  if (dot < 0) return undefined
  const prefix = textId.slice(0, dot)
  const field = textId.slice(dot + 1)
  return registry.get(prefix)?.[field]
}
