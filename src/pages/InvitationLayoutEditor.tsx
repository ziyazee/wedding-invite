import { useEffect, useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import './InvitationLayoutEditor.css'
import { useInvitationDetails } from '../invitations/context'

type Placement = { x: number; y: number; scale: number }
type Layout = Record<string, Placement>
// A new revision keeps earlier browser drafts from overriding the approved layout.
const storageKey = 'mohadrahma-text-layout-v3'
const initial: Placement = { x: 0, y: 0, scale: 1 }
const approvedMehfil: Record<string, Placement> = {
  calendar: { x: 0.0136968085106383, y: 0.08959350585937499, scale: 1.2 },
  directions: { x: 0.012890625, y: 0.0963134765625, scale: 0.85 },
  address: { x: 0.0016206781914893619, y: 0.06765747070312499, scale: 1.4 },
  venue: { x: 0.011643949468085104, y: 0.06127319335937499, scale: 1 },
  time: { x: 0.007754321808510638, y: 0.051361083984375, scale: 1 },
  date: { x: 0.0071143617021276594, y: 0.039508056640625, scale: 1 },
  weekday: { x: 0.008061835106382979, y: 0.040655517578125, scale: 1.4 },
  title: { x: 0.00269281914893617, y: 0.046435546875000004, scale: 1 },
}
const defaultLayout: Layout = Object.fromEntries(
  ['mehendi-programme', 'mehendi-mehfil', 'nikah', 'wedding-reception', 'brides-reception-chikmagaluru']
    .flatMap(event => Object.entries(approvedMehfil).map(([field, placement]) => [`${event}:${field}`, { ...placement }])),
)
function readLayout(): Layout {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || '{}')
    if (!value || typeof value !== 'object') return { ...defaultLayout }
    return { ...defaultLayout, ...Object.fromEntries(Object.entries(value).filter(([, p]) =>
      p && Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.scale)
      && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 && p.scale >= .5 && p.scale <= 2)) }
  } catch { return { ...defaultLayout } }
}

export default function InvitationLayoutEditor({ children }: { children: ReactNode }) {
  const personalized = !!useInvitationDetails()
  const enabled = !personalized && new URLSearchParams(window.location.search).get('edit') === '1'
  const [editing, setEditing] = useState(enabled)
  const [layout, setLayout] = useState<Layout>(() => personalized ? { ...defaultLayout } : readLayout())
  const [selected, setSelected] = useState<string | null>(null)
  const [notice, setNotice] = useState('Select text, then drag it or change its size.')
  const root = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: string; pointer: number; x: number; y: number; width: number; height: number; start: Placement } | null>(null)

  useEffect(() => {
    const container = root.current
    if (!container) return
    function apply() {
      container?.querySelectorAll<HTMLElement>('[data-layout-id]').forEach(element => {
        const card = element.closest('.mr-event-paper')?.getBoundingClientRect()
        const id = element.dataset.layoutId!
        const p = layout[id]
        element.style.transform = p && card ? `translate(${p.x * card.width}px, ${p.y * card.height}px) scale(${p.scale})` : ''
        element.classList.toggle('invite-text-selected', editing && id === selected)
      })
    }
    apply()
    const observer = new ResizeObserver(apply)
    container.querySelectorAll('.mr-event-paper').forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [layout, selected, editing])

  function begin(event: PointerEvent<HTMLDivElement>) {
    if (!editing || !event.isPrimary || event.button !== 0) return
    const element = (event.target as HTMLElement).closest<HTMLElement>('[data-layout-id]')
    if (!element) return
    const card = element.closest('.mr-event-paper')!.getBoundingClientRect()
    const id = element.dataset.layoutId!
    event.preventDefault()
    setSelected(id)
    drag.current = { id, pointer: event.pointerId, x: event.clientX, y: event.clientY, width: card.width, height: card.height, start: layout[id] || initial }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d || d.pointer !== event.pointerId) return
    const clamp = (n: number) => Math.max(-.75, Math.min(.75, n))
    setLayout(previous => ({ ...previous, [d.id]: { ...d.start, x: clamp(d.start.x + (event.clientX - d.x) / d.width), y: clamp(d.start.y + (event.clientY - d.y) / d.height) } }))
    setNotice('Unsaved changes')
  }
  function resize(scale: number) {
    if (!selected) return
    setLayout(previous => ({ ...previous, [selected]: { ...(previous[selected] || initial), scale } }))
    setNotice('Unsaved changes')
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(layout)); setNotice('Saved in this browser.') }
    catch { setNotice('Browser storage unavailable. Use Download layout to keep your changes.') }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = 'mohadrahma-layout.json'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <>
    <div ref={root} className={editing ? 'invite-layout-editing' : undefined} onPointerDown={begin} onPointerMove={move} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onClickCapture={event => {
      if (editing && (event.target as HTMLElement).closest('[data-layout-id]')) { event.preventDefault(); event.stopPropagation() }
    }}>{children}</div>
    {enabled && <aside className="invite-editor-toolbar" aria-label="Invitation layout editor">
      <div className="invite-editor-status"><strong>{editing ? 'Edit celebration text' : 'Preview'}</strong><span role="status">{notice}</span></div>
      {editing && <>
        <label className="invite-editor-size">Size {Math.round((selected ? layout[selected]?.scale ?? 1 : 1) * 100)}%
          <input aria-label="Selected text size" type="range" min="50" max="200" step="5" disabled={!selected} value={Math.round((selected ? layout[selected]?.scale ?? 1 : 1) * 100)} onChange={event => resize(Number(event.target.value) / 100)} />
        </label>
        <button disabled={!selected} onClick={() => { if (selected) { setLayout(previous => ({ ...previous, [selected]: { ...(defaultLayout[selected] || initial) } })); setNotice('Selected text restored to the default. Save to keep this change.') } }}>Reset selected</button>
      </>}
      <button onClick={() => setEditing(!editing)}>{editing ? 'Preview' : 'Edit'}</button>
      <button onClick={save}>Save</button>
      <button onClick={download}>Download layout</button>
      <small>Saved on this browser only. Download the layout to share it for publishing.</small>
    </aside>}
  </>
}
