import { createContext, createElement, useContext, useMemo } from 'react'
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { emptyTextLayout, readTextLayout, textFonts } from '../textLayout'
import type { TextLayout } from '../textLayout'
import { applyTextRule, getRuleForElement } from '../textRules'
import { useSectionGeometry } from './InvitationSection'
import './EditableText.css'

const LayoutContext = createContext<TextLayout>(emptyTextLayout())
export function InvitationLayoutProvider({ layout, children }: { layout?: TextLayout; children: ReactNode }) {
  const value = useMemo(() => readTextLayout(layout), [layout])
  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export type BaseTextTransform = { x: number; y: number; scale: number }
type TextProps = HTMLAttributes<HTMLElement> & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> & {
  as?: 'p' | 'span' | 'strong' | 'small' | 'i' | 'h1' | 'h2' | 'h3' | 'h4' | 'a' | 'button' | 'time'
  textId?: string
  label?: string
  'data-invite-text'?: string
  'data-invite-label'?: string
  'data-layout-id'?: string
  baseTransform?: BaseTextTransform
  dateTime?: string
  type?: 'button' | 'submit' | 'reset'
  animation?: 'fade-up' | 'masked-rise' | 'blur-rise' | 'letter-rise' | 'gentle-rise' | 'stagger-lines'
  animationDuration?: number
  animationDelay?: number
  animationDistance?: number
  animationStagger?: number
  animationReplay?: boolean
}

/** Render the original HTML tag with its saved styles. This component contains
 * no editor listeners, DOM searches, animation loops or persistence calls. */
function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (typeof node === 'object' && 'props' in node) return extractText(node.props.children)
  return ''
}

export function EditableText({ as = 'span', textId, label, baseTransform, style, children, animation, animationDuration, animationDelay, animationDistance, animationStagger, animationReplay, ...props }: TextProps) {
  const layout = useContext(LayoutContext)
  const id = textId || props['data-invite-text']
  const override = id ? layout.elements[id] : undefined
  const positioned = !!override && (override.x !== undefined || override.y !== undefined)
  const section = useSectionGeometry(positioned || !!baseTransform)
  const rule = id ? getRuleForElement(id) : undefined
  const ruleStyle = rule ? applyTextRule(extractText(children), rule) : undefined
  return createElement(as, {
    ...props,
    'data-invite-text': id,
    'data-invite-label': label || props['data-invite-label'],
    'data-invite-custom-size': override?.fontSize !== undefined ? '' : undefined,
    'data-invite-custom-font': override?.fontFamily ? '' : undefined,
    'data-invite-custom-color': override?.color ? '' : undefined,
    'data-invite-animation': animation,
    'data-invite-animation-replay': animationReplay ? '' : undefined,
    style: {
      ...style,
      ...(animationDuration !== undefined ? { '--invite-motion-duration': `${animationDuration}ms` } : {}),
      ...(animationDelay !== undefined ? { '--invite-motion-delay': `${animationDelay}ms` } : {}),
      ...(animationDistance !== undefined ? { '--invite-motion-distance': `${animationDistance}px` } : {}),
      ...(animationStagger !== undefined ? { '--invite-motion-stagger': `${animationStagger}ms` } : {}),
      ...ruleStyle,
      ...(baseTransform ? { transform: `translate(${baseTransform.x * section.borderWidth}px, ${baseTransform.y * section.borderHeight}px) scale(${baseTransform.scale})` } : {}),
      ...(override?.fontSize !== undefined ? { '--invite-font-size': `${override.fontSize}px` } : {}),
      ...(override?.fontFamily ? { '--invite-font-family': textFonts[override.fontFamily] } : {}),
      ...(override?.color ? { '--invite-color': override.color } : {}),
      ...(positioned ? { translate: `${(override.x || 0) * section.width}px ${(override.y || 0) * section.height}px` } : {}),
    },
  }, children)
}
