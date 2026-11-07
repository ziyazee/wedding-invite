import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { emptyTextLayout, readTextLayout, textFonts } from '../invitations/textLayout'
import type { TextLayout, TextOverride } from '../invitations/textLayout'
import { textSection, textSelector, textTranslation, watchTextDocuments } from '../invitations/textLayoutDom'
import './OrderTextEditor.css'
import { attachTextResizeHandle } from './textResizeHandle'
import { captureTextSizes, textPosition, withTextSizes } from './textEditorGeometry'
import { openInlineTextEditor } from './inlineTextEditor'

type Selection = { id: string; element: HTMLElement; label: string; size: number; color: string }
type Props = { template: number; value?: TextLayout; onChange: (value: TextLayout) => void; draftStatus: string }
const bounded = (value: number) => Math.max(-1, Math.min(1, value))
const fontLabels: Record<keyof typeof textFonts, string> = { serif: 'Georgia', sans: 'Arial', classic: 'Times New Roman', mono: 'Courier New' }

function EditorIcon({ name }: { name: 'text' | 'eye' | 'pointer' | 'undo' | 'redo' | 'reset' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'text' && <path d="M4 6V4h16v2M12 4v16M8 20h8"/>}
    {name === 'eye' && <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>}
    {name === 'pointer' && <path d="m5 3 14 10-7 1-3 7-4-18Z"/>}
    {name === 'undo' && <path d="m8 5-5 5 5 5M3 10h11a6 6 0 0 1 6 6v3"/>}
    {name === 'redo' && <path d="m16 5 5 5-5 5m5-5H10a6 6 0 0 0-6 6v3"/>}
    {name === 'reset' && <path d="M3 4v6h6M3.5 10a9 9 0 1 1 1 8"/>}
  </svg>
}

export default function OrderTextEditor({ template, value, onChange, draftStatus }: Props) {
  const [host, setHost] = useState<HTMLElement | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [preview, setPreview] = useState(false)
  const [nearCenter, setNearCenter] = useState(false)
  const [history, setHistory] = useState<{ past: TextLayout[]; future: TextLayout[] }>({ past: [], future: [] })
  const current = useRef(readTextLayout(value))
  current.current = readTextLayout(value)
  const change = useRef(onChange)
  change.current = onChange
  function commit(next: TextLayout) {
    const clean = readTextLayout(next)
    if (JSON.stringify(clean) === JSON.stringify(current.current)) return
    const before = current.current
    setHistory(h => ({ past: [...h.past.slice(-49), before], future: [] }))
    current.current = clean
    change.current(clean)
  }
  const save = useRef(commit)
  save.current = commit
  const inline = useRef<ReturnType<typeof openInlineTextEditor> | null>(null)
  const editText = useRef<(element: HTMLElement) => void>(() => {})
  editText.current = element => {
    inline.current?.finish()
    const id = element.dataset.inviteText
    if (!id || !element.isConnected) return
    const sizes = captureTextSizes(element)
    const content = current.current.elements[id]?.content ?? element.textContent ?? ''
    inline.current = openInlineTextEditor(element, content, text => {
      const layout = withTextSizes(current.current, sizes)
      save.current({ version: 1, elements: { ...layout.elements, [id]: { ...layout.elements[id], content: text } } })
    })
  }
  useEffect(() => () => { inline.current?.finish(false); inline.current = null }, [template, preview])

  useEffect(() => {
    selection?.element.setAttribute('data-invite-selected', '')
    return () => selection?.element.removeAttribute('data-invite-selected')
  }, [selection])

  useEffect(() => {
    if (!selection || preview) return
    let sizes: Record<string, number> = {}
    return attachTextResizeHandle(selection.element, fontSize => {
      if (!selection.element.isConnected || selection.element.dataset.inviteText !== selection.id) return
      const layout = withTextSizes(current.current, sizes)
      save.current({ version: 1, elements: { ...layout.elements, [selection.id]: { ...layout.elements[selection.id], fontSize } } })
    }, () => { sizes = captureTextSizes(selection.element) }, () => editText.current(selection.element))
  }, [selection, preview])

  useEffect(() => {
    setHost(document.querySelector('.client-preview-panel'))
    setHistory({ past: [], future: [] })
    setSelection(null)
    setPreview(false)
  }, [template])

  useEffect(() => {
    if (!host || preview) return
    const screen = host.querySelector<HTMLElement>('.client-device-screen')
    if (!screen) return
    return watchTextDocuments(screen, root => {
      const doc = root.ownerDocument
      const win = doc.defaultView!
      const css = doc.createElement('style')
      css.textContent = '[data-invite-text]{cursor:grab;touch-action:none;pointer-events:auto}[data-invite-selected]{outline:2px solid #a57b32!important;outline-offset:4px;user-select:none}[data-invite-guide]{position:fixed;pointer-events:none;width:1px;background:#bc8c36;z-index:2147483647}'
      doc.head.append(css)
      const guide = doc.createElement('div')
      guide.dataset.inviteGuide = ''
      guide.hidden = true
      doc.body.append(guide)
      let drag: { element: HTMLElement; section: HTMLElement; id: string; pointer: number; x: number; y: number; width: number; height: number; start: TextOverride; next: TextOverride; original: string; priority: string; transition: string; transitionPriority: string; moved: boolean } | null = null
      let raf = 0
      const restore = () => {
        const ended = drag
        drag = null
        if (!ended) return
        ended.element.style.setProperty('transition', ended.transition, ended.transitionPriority)
        ended.element.style.setProperty('translate', ended.original, ended.priority)
        try { ended.element.releasePointerCapture(ended.pointer) } catch { /* Pointer already released. */ }
      }
      const hideGuide = () => { guide.hidden = true; setNearCenter(false) }
      const showGuide = (element: HTMLElement, section: HTMLElement) => {
        const box = element.getBoundingClientRect()
        const bounds = section.getBoundingClientRect()
        const near = Math.abs(box.left + box.width / 2 - bounds.left - bounds.width / 2) <= 8
        guide.hidden = !near
        if (near) { guide.style.left = `${bounds.left + bounds.width / 2}px`; guide.style.top = `${bounds.top}px`; guide.style.height = `${bounds.height}px` }
        setNearCenter(near)
      }
      const draw = () => {
        raf = 0
        if (!drag) return
        drag.element.style.setProperty('transition', 'none', 'important')
        drag.element.style.setProperty('translate', textTranslation(drag.element, drag.section, drag.next.x, drag.next.y), 'important')
        const box = drag.element.getBoundingClientRect()
        const bounds = drag.section.getBoundingClientRect()
        const distance = bounds.left + bounds.width / 2 - box.left - box.width / 2
        if (bounds.width && Math.abs(distance) <= 8) {
          drag.next = { ...drag.next, x: bounded((drag.next.x || 0) + distance / bounds.width) }
          drag.element.style.setProperty('translate', textTranslation(drag.element, drag.section, drag.next.x, drag.next.y), 'important')
        }
        showGuide(drag.element, drag.section)
      }
      const down = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0) return
        const target = event.target as Element
        if (target.nodeType === 1 && target.closest('[data-invite-text-resize],[data-invite-text-edit],[data-invite-inline-editor]')) return
        const element = target.nodeType === 1 ? target.closest<HTMLElement>(textSelector) : null
        root.querySelectorAll('[data-invite-selected]').forEach(node => node.removeAttribute('data-invite-selected'))
        if (!element || !root.contains(element)) { setSelection(null); hideGuide(); return }
        const section = textSection(element)
        if (!section) return
        const bounds = section.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return
        event.preventDefault(); event.stopPropagation()
        element.setAttribute('data-invite-selected', '')
        const computed = win.getComputedStyle(element)
        const rgb = computed.color.match(/\d+/g)
        const color = rgb && rgb.length >= 3 ? '#' + rgb.slice(0, 3).map(n => Number(n).toString(16).padStart(2, '0')).join('') : '#333333'
        const id = element.dataset.inviteText!
        setSelection({ id, element, label: element.dataset.inviteLabel || 'Text', size: Math.round(parseFloat(computed.fontSize)), color })
        const start = { ...current.current.elements[id], ...textPosition(element, current.current.elements[id]) }
        drag = { element, section, id, pointer: event.pointerId, x: event.clientX, y: event.clientY, width: bounds.width, height: bounds.height, start, next: start, original: element.style.getPropertyValue('translate'), priority: element.style.getPropertyPriority('translate'), transition: element.style.getPropertyValue('transition'), transitionPriority: element.style.getPropertyPriority('transition'), moved: false }
        element.setPointerCapture(event.pointerId)
        showGuide(element, section)
      }
      const move = (event: PointerEvent) => {
        if (!drag || event.pointerId !== drag.pointer) return
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y
        if (!drag.moved && Math.hypot(dx, dy) < 3) return
        event.preventDefault()
        drag.moved = true
        drag.next = { ...drag.start, x: bounded((drag.start.x || 0) + dx / drag.width), y: bounded((drag.start.y || 0) + dy / drag.height) }
        if (!raf) raf = win.requestAnimationFrame(draw)
      }
      const finish = (event: PointerEvent) => {
        if (!drag || event.pointerId !== drag.pointer) return
        const ended = drag
        if (event.type === 'pointerup') move(event)
        if (raf) { win.cancelAnimationFrame(raf); raf = 0 }
        if (event.type === 'pointerup' && ended.moved) draw()
        restore(); drag = null
        if (event.type === 'pointerup' && ended.moved && ended.element.isConnected) save.current({ version: 1, elements: { ...current.current.elements, [ended.id]: { ...current.current.elements[ended.id], x: ended.next.x, y: ended.next.y } } })
        hideGuide()
      }
      const click = (event: MouseEvent) => {
        const target = event.target as Element
        if (target.nodeType === 1 && target.closest(textSelector)) { event.preventDefault(); event.stopPropagation() }
      }
      root.addEventListener('pointerdown', down, true)
      root.addEventListener('pointermove', move, true)
      root.addEventListener('pointerup', finish, true)
      root.addEventListener('pointercancel', finish, true)
      root.addEventListener('lostpointercapture', finish, true)
      root.addEventListener('click', click, true)
      win.addEventListener('scroll', hideGuide, true)
      return () => {
        if (raf) win.cancelAnimationFrame(raf)
        restore()
        css.remove(); guide.remove()
        root.querySelectorAll('[data-invite-selected]').forEach(node => node.removeAttribute('data-invite-selected'))
        root.removeEventListener('pointerdown', down, true)
        root.removeEventListener('pointermove', move, true)
        root.removeEventListener('pointerup', finish, true)
        root.removeEventListener('pointercancel', finish, true)
        root.removeEventListener('lostpointercapture', finish, true)
        root.removeEventListener('click', click, true)
        win.removeEventListener('scroll', hideGuide, true)
      }
    })
  }, [host, template, preview])

  function update(patch: Partial<TextOverride>) {
    if (!selection?.element.isConnected || selection.element.dataset.inviteText !== selection.id) { setSelection(null); return }
    const changesSize = 'content' in patch || 'fontFamily' in patch || 'fontSize' in patch
    const layout = changesSize ? withTextSizes(current.current, captureTextSizes(selection.element)) : current.current
    const next = { ...layout.elements[selection.id], ...patch }
    commit({ version: 1, elements: { ...layout.elements, [selection.id]: next } })
  }
  function center() {
    if (!selection?.element.isConnected) return
    const section = textSection(selection.element)
    if (!section) return
    const box = selection.element.getBoundingClientRect(), bounds = section.getBoundingClientRect()
    if (bounds.width) update({ x: bounded(textPosition(selection.element, current.current.elements[selection.id]).x + (bounds.left + bounds.width / 2 - box.left - box.width / 2) / bounds.width) })
  }
  function undo(redo = false) {
    const source = redo ? history.future : history.past
    if (!source.length) return
    const next = source[source.length - 1]
    setHistory(redo ? { past: [...history.past, current.current], future: source.slice(0, -1) } : { past: source.slice(0, -1), future: [...history.future, current.current] })
    current.current = next; change.current(next)
  }
  if (!host) return null
  const entry = selection ? current.current.elements[selection.id] || {} : {}
  const position = selection ? textPosition(selection.element, entry) : { x: 0, y: 0 }
  const supported = (template >= 1 && template <= 14) || template === 17
  return createPortal(<section className="order-text-editor" aria-label="Text layout editor">
    <div className="ote-heading"><span className="ote-brand-icon"><EditorIcon name="text"/></span><div className="ote-title"><span>MAKE IT YOURS</span><strong>{preview ? 'Invitation preview' : 'Text studio'}</strong></div><button className="ote-preview" type="button" aria-label={preview ? 'Back to editing' : 'Preview invitation'} onClick={() => { setPreview(!preview); setSelection(null); setNearCenter(false) }}><EditorIcon name={preview ? 'text' : 'eye'}/>{preview ? 'Edit' : 'Preview'}</button></div>
    {!preview && <>
      {selection ? <div className="ote-selection"><span className="ote-selection-dot"/><span><small>SELECTED TEXT</small><strong>{selection.label}</strong></span></div> : <div className="ote-empty"><span className="ote-pointer"><EditorIcon name="pointer"/></span><strong>{supported ? 'Make every detail yours' : 'Text editing is coming'}</strong><p>{supported ? 'Tap text to select it. Drag to move, use the corner handle to resize, or tap Edit to type. Scroll using the space around text.' : 'Editing will be available here once this design is connected.'}</p>{supported && <div className="ote-capabilities"><span>Font</span><span>Size</span><span>Position</span></div>}</div>}
      {selection && <div className="ote-controls">
        <label className="ote-font-control">Font<select value={entry.fontFamily ?? ''} style={{ fontFamily: entry.fontFamily ? textFonts[entry.fontFamily] : undefined }} onChange={event => {
          const font = event.target.value
          if (font && !Object.hasOwn(textFonts, font)) return
          update({ fontFamily: (font || undefined) as TextOverride['fontFamily'] })
        }}><option value="">Template default</option>{(Object.keys(textFonts) as (keyof typeof textFonts)[]).map(font => <option key={font} value={font} style={{ fontFamily: textFonts[font] }}>{fontLabels[font]}</option>)}</select></label>
        <button type="button" onClick={() => editText.current(selection.element)}>Edit text in phone</button>
        <label>Size (px)<input type="number" min="8" max="160" step="1" value={entry.fontSize ?? selection.size} onChange={e => { const n = Number(e.target.value); if (e.target.value && n >= 8 && n <= 160) update({ fontSize: n }) }}/></label>
        <label>Horizontal (%)<input type="number" min="-100" max="100" step="0.5" value={Number((position.x * 100).toFixed(2))} onChange={e => { if (e.target.value) update({ x: bounded(Number(e.target.value) / 100) }) }}/></label>
        <label>Vertical (%)<input type="number" min="-100" max="100" step="0.5" value={Number((position.y * 100).toFixed(2))} onChange={e => { if (e.target.value) update({ y: bounded(Number(e.target.value) / 100) }) }}/></label>
        <button type="button" onClick={center}>{nearCenter ? 'Align to center' : 'Center horizontally'}</button>
        <button type="button" onClick={() => { const elements = { ...current.current.elements }; delete elements[selection.id]; commit({ version: 1, elements }); setSelection(null) }}>Reset text</button>
        <button type="button" className="ote-hide-btn" onClick={() => { commit({ version: 1, elements: { ...current.current.elements, [selection.id]: { ...current.current.elements[selection.id], hidden: true } } }); setSelection(null) }}>Hide</button>
      </div>}
      {(() => { const hidden = Object.entries(current.current.elements).filter(([, v]) => v.hidden); return hidden.length ? <div className="ote-hidden-list"><small>HIDDEN ELEMENTS</small>{hidden.map(([id]) => <div key={id} className="ote-hidden-item"><span>{id.split('.').slice(1).join(' · ')}</span><button type="button" onClick={() => { const elements = { ...current.current.elements }; const { hidden: _, ...rest } = elements[id]; elements[id] = Object.keys(rest).length ? rest : rest; if (!Object.keys(rest).length) delete elements[id]; else elements[id] = rest; commit({ version: 1, elements }) }}>Show</button></div>)}</div> : null })()}
      {supported && <button type="button" className="ote-add-text" onClick={() => { const existing = Object.keys(current.current.elements).filter(k => k.startsWith(`t${template}.custom.`)); const n = existing.length ? Math.max(...existing.map(k => parseInt(k.split('.')[2]) || 0)) + 1 : 1; const id = `t${template}.custom.${n}`; commit({ version: 1, elements: { ...current.current.elements, [id]: { content: 'New text', fontSize: 18 } } }) }}><EditorIcon name="text"/> Add text</button>}
      <div className="ote-actions"><div className="ote-history"><button type="button" disabled={!history.past.length} onClick={() => undo()}><EditorIcon name="undo"/>Undo</button><button type="button" disabled={!history.future.length} onClick={() => undo(true)}><EditorIcon name="redo"/>Redo</button></div><button className="ote-reset" type="button" disabled={!Object.keys(current.current.elements).length} onClick={() => { commit(emptyTextLayout()); setSelection(null) }}><EditorIcon name="reset"/>Reset all</button></div>
    </>}
    <div className={`ote-save-status${draftStatus.startsWith('Browser') ? ' ote-save-error' : ''}`} role="status"><span className="ote-status-dot"/><small>{draftStatus}</small></div>
  </section>, host)
}
