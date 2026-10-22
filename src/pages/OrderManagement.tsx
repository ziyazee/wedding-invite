import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Celebration, InvitationData } from '../invitations/model'
import { cardTextLimit, nameTextLimit, formatDate, formatTime, validateDetails } from '../invitations/model'
import './OrderManagement.css'
import MusicPicker from './MusicPicker'

type Response = { id: number; name: string; attendance: 'yes' | 'no'; guestCount: number; additionalGuests: string[]; message: string; createdAt: string; updatedAt: string }
type ManagementData = { orderId: string; status: string; details: InvitationData; responses: Response[] }
type DetailKey = Exclude<keyof InvitationData, 'template' | 'events'>
type PreviewLocation = { documentIndex: number; path: number[]; target: Element; text: string; documentCenter: number }
type PreviewMatch = { target: Element; location: PreviewLocation }
type ActiveField = { key: string; oldText: string; location: PreviewLocation | null; scrolled: boolean }
// Keep the split preview and field-following behaviour available for reuse.
const SPLIT_PREVIEW_ENABLED = false
const fields: { key: DetailKey; label: string; type?: string; multiline?: boolean }[] = [
  { key: 'groom', label: 'Groom name' }, { key: 'bride', label: 'Bride name' },
  { key: 'date', label: 'Wedding date', type: 'date' }, { key: 'time', label: 'Wedding time', type: 'time' },
  { key: 'offset', label: 'UTC time offset' }, { key: 'venue', label: 'Wedding venue', multiline: true },
  { key: 'address', label: 'Wedding address', multiline: true }, { key: 'map', label: 'Map link', type: 'url' },
  { key: 'groomFamily', label: 'Groom’s family', multiline: true }, { key: 'brideFamily', label: 'Bride’s family', multiline: true },
  { key: 'message', label: 'Welcome message', multiline: true }, { key: 'dressCode', label: 'Dress code', multiline: true },
  { key: 'giftNote', label: 'Gift note', multiline: true },
  { key: 'gallery', label: 'Photo gallery link', type: 'url' },
]

function previewDocuments(frame: HTMLIFrameElement | null) {
  const root = frame?.contentDocument
  if (!root) return []
  const documents = [root]
  for (let index = 0; index < documents.length; index += 1) {
    for (const nested of Array.from(documents[index].querySelectorAll('iframe'))) {
      try { if (nested.contentDocument?.body) documents.push(nested.contentDocument) } catch { /* Ignore cross-origin template frames. */ }
    }
  }
  return documents
}

function findPreviewMatch(frame: HTMLIFrameElement | null, text: string): PreviewMatch | null {
  const needle = text.trim().toLocaleLowerCase()
  if (!needle) return null
  for (const [documentIndex, doc] of previewDocuments(frame).entries()) {
    if (!doc.body) continue
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      const content = node.textContent?.trim().toLocaleLowerCase() || ''
      if (needle.length === 1 ? content !== needle : !content.includes(needle)) continue
      const parent = node.parentElement
      if (!parent || parent.closest('script, style, template, noscript, [hidden], [aria-hidden="true"]')) continue
      if (!parent.getClientRects().length) continue
      let visible = true
      for (let ancestor: Element | null = parent; ancestor; ancestor = ancestor.parentElement) {
        if (doc.defaultView?.getComputedStyle(ancestor).display === 'none') { visible = false; break }
      }
      if (!visible) continue
      const path: number[] = []
      for (let element = parent; element !== doc.body && element.parentElement; element = element.parentElement) {
        path.unshift(Array.from(element.parentElement.children).indexOf(element))
      }
      const range = doc.createRange()
      const start = (node.nodeValue || '').toLocaleLowerCase().indexOf(needle)
      range.setStart(node, Math.max(0, start))
      range.setEnd(node, Math.min((node.nodeValue || '').length, Math.max(0, start) + needle.length))
      const rect = range.getBoundingClientRect()
      return { target: parent, location: { documentIndex, path, target: parent, text, documentCenter: (doc.defaultView?.scrollY || 0) + rect.top + rect.height / 2 } }
    }
  }
  return null
}

function resolvePreviewLocation(frame: HTMLIFrameElement | null, location: PreviewLocation) {
  if (location.target.isConnected) return location.target
  const doc = previewDocuments(frame)[location.documentIndex]
  const marker = location.target.getAttribute('data-editor-node')
  if (marker && doc) {
    const replacement = Array.from(doc.querySelectorAll('[data-editor-node]')).find(element => element.getAttribute('data-editor-node') === marker)
    if (replacement) return replacement
  }
  let element: Element | undefined = doc?.body
  for (const index of location.path) element = element?.children[index]
  return element || null
}

function centerPreviewText(frame: HTMLIFrameElement | null, target: Element, text: string) {
  const doc = target.ownerDocument
  let rect = target.getBoundingClientRect()
  // A name can share a heading with the other name. Center its text range,
  // rather than a section that can be several screens tall.
  const walker = doc.createTreeWalker(target, NodeFilter.SHOW_TEXT)
  const needle = text.trim().toLocaleLowerCase()
  let node: Node | null
  while (needle && (node = walker.nextNode())) {
    const index = (node.nodeValue || '').toLocaleLowerCase().indexOf(needle)
    if (index < 0) continue
    const range = doc.createRange()
    range.setStart(node, index)
    range.setEnd(node, index + needle.length)
    const textRect = range.getBoundingClientRect()
    if (textRect.height) rect = textRect
    break
  }
  scrollPreviewPoint(frame, doc, rect.top + rect.height / 2)
}

function scrollPreviewPoint(frame: HTMLIFrameElement | null, doc: Document, viewportCenter: number) {
  let currentDocument = doc
  let center = viewportCenter
  for (;;) {
    const win = currentDocument.defaultView
    if (!win) break
    const destination = Math.max(0, Math.min(win.scrollY + center - win.innerHeight / 2, Math.max(0, (currentDocument.scrollingElement?.scrollHeight || 0) - win.innerHeight)))
    const movement = destination - win.scrollY
    win.scrollTo({ top: destination, behavior: 'smooth' })
    if (currentDocument === frame?.contentDocument) break
    const parentFrame = win.frameElement
    if (!parentFrame) break
    center = parentFrame.getBoundingClientRect().top + center - movement
    currentDocument = parentFrame.ownerDocument
  }
}

function previewTextForField(key: string, value: string) {
  if (key.endsWith('.date') || key === 'date') return formatDate(value)
  if (key.endsWith('.time') || key === 'time') return formatTime(value)
  return value
}

export default function OrderManagement() {
  const params = useParams()
  const managementId = params.managementId || params.slug || ''
  const [data, setData] = useState<ManagementData | null>(null)
  const [details, setDetails] = useState<InvitationData | null>(null)
  const [section, setSection] = useState<'home' | 'edit' | 'responses'>('home')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const previewFrame = useRef<HTMLIFrameElement>(null)
  const pendingPreviewText = useRef<{ text: string; location: PreviewLocation | null } | null>(null)
  const activeField = useRef<ActiveField | null>(null)

  const load = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setError('Order management is unavailable right now.'); setLoading(false); return }
    const { data: result, error: loadError } = await supabase.rpc('get_order_management', { p_management_id: managementId })
    if (loadError || !result) setError('This management link is invalid or unavailable.')
    else {
      const parsed = result as ManagementData
      try { sessionStorage.setItem('shaadi-client-live-preview', JSON.stringify(parsed.details)) } catch { /* The edit form remains usable without the live preview. */ }
      setData(parsed)
      setDetails(parsed.details)
    }
    setLoading(false)
  }, [managementId])

  useEffect(() => { void load() }, [load])

  useEffect(() => {
    if (!details) return
    try { sessionStorage.setItem('shaadi-client-live-preview', JSON.stringify(details)) } catch { /* Preview remains available when storage is disabled. */ }
  }, [details])

  useEffect(() => {
    const pending = pendingPreviewText.current
    if (!pending || !details) return
    const started = performance.now()
    let timer = 0
    let cancelled = false
    const findAndScroll = () => {
      if (cancelled || pending !== pendingPreviewText.current) return
      const frame = previewFrame.current
      if (!frame || !frame.getBoundingClientRect().height) return
      const anchored = pending.location ? resolvePreviewLocation(frame, pending.location) : null
      const match = anchored ? null : findPreviewMatch(frame, pending.text)
      const target = anchored || match?.target
      const newText = pending.text.trim().toLocaleLowerCase()
      const oldText = pending.location?.text.trim().toLocaleLowerCase()
      if (!newText && pending.location && (!pending.location.target.isConnected || !pending.location.target.textContent?.toLocaleLowerCase().includes(oldText || ''))) {
        const doc = previewDocuments(frame)[pending.location.documentIndex]
        if (doc?.defaultView) {
          scrollPreviewPoint(frame, doc, pending.location.documentCenter - doc.defaultView.scrollY)
          if (activeField.current) activeField.current.scrolled = true
          pendingPreviewText.current = null
          return
        }
      }
      const rendered = target?.textContent?.toLocaleLowerCase() || ''
      const updated = newText ? rendered.includes(newText) : !oldText || !rendered.includes(oldText)
      if (target && updated) {
        centerPreviewText(frame, target, pending.text || pending.location?.text || '')
        if (activeField.current) activeField.current.scrolled = true
        pendingPreviewText.current = null
        return
      }
      // Template generation includes asynchronous fetches; 18 animation frames
      // was too short and silently lost the field's scroll request.
      if (performance.now() - started < 5000) timer = window.setTimeout(findAndScroll, 60)
    }
    timer = window.setTimeout(findAndScroll, 0)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [details])

  function focusField(key: string, oldValue: string) {
    if (!SPLIT_PREVIEW_ENABLED) return
    if (activeField.current?.key === key) return
    pendingPreviewText.current = null
    const oldText = previewTextForField(key, oldValue)
    activeField.current = { key, oldText, location: findPreviewMatch(previewFrame.current, oldText)?.location || null, scrolled: false }
  }
  function queuePreviewScroll(key: string, newValue: string, oldValue: string) {
    if (!SPLIT_PREVIEW_ENABLED) return
    focusField(key, oldValue)
    const field = activeField.current
    if (!field || field.scrolled) return
    pendingPreviewText.current = { text: previewTextForField(key, newValue), location: field.location }
  }
  function setDetail(key: DetailKey, value: string) {
    const limit=nameTextLimit(details?.template ?? 0,key) ?? cardTextLimit(details?.template ?? 0,key)
    if(limit!==undefined)value=value.slice(0,limit)
    queuePreviewScroll(`detail.${key}`, value, String(details?.[key] || ''))
    setDetails(current => current ? { ...current, [key]: value } : current)
  }
  function setEvent(index: number, key: keyof Celebration, value: string) {
    const limit=cardTextLimit(details?.template ?? 0,key)
    if(limit!==undefined)value=value.slice(0,limit)
    queuePreviewScroll(`event.${index}.${key}`, value, details?.events[index]?.[key] || '')
    setDetails(current => current ? { ...current, events: current.events.map((item, i) => i === index ? { ...item, [key]: value } : item) } : current)
  }
  function addEvent() {
    setDetails(current => current && current.events.length < 10 ? { ...current, events: [...current.events, { title: '', date: current.date, time: current.time, venue: current.venue, address: current.address, map: '' }] } : current)
  }
  function removeEvent(index: number) {
    setDetails(current => current && current.events.length > 1 ? { ...current, events: current.events.filter((_, i) => i !== index) } : current)
  }
  async function saveDetails(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !details) return
    setBusy(true); setError(''); setNotice('')
    try {
      const valid = validateDetails(details, true)
      const { data: saved, error: saveError } = await supabase.rpc('update_order_management', { p_management_id: managementId, p_form_data: valid })
      if (saveError || saved?.saved !== true) throw saveError || new Error('Could not save invitation details.')
      setDetails(valid); setData(current => current ? { ...current, details: valid } : current)
      setNotice('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save invitation details.')
    } finally { setBusy(false) }
  }

  if (loading) return <main className="order-manage-page"><div className="om-card om-loading">Loading your wedding details…</div></main>
  if (error && !data) return <main className="order-manage-page"><div className="om-card om-error"><span>SHAADI INVITES</span><h1>Link unavailable</h1><p>{error}</p></div></main>
  if (!data || !details) return null

  return <main className="order-manage-page"><div className={`om-shell ${section === 'edit' ? (SPLIT_PREVIEW_ENABLED ? 'om-shell-edit' : 'om-shell-form') : ''}`}>
    {section !== 'edit' && <header className="om-header"><span className="om-brand">SHAADI INVITES</span><span className="om-order">ORDER #{data.orderId}</span><h1>{details.groom} <i>&</i> {details.bride}</h1><p>Your private wedding invitation space</p></header>}
    {error && <p className="om-alert" role="alert">{error}</p>}{notice && section !== 'edit' && <p className="om-success" role="status">{notice}</p>}
    {section === 'home' && <section className="om-options" aria-label="Manage your invitation">
      <button className="om-option" onClick={() => { setSection('edit'); setError(''); setNotice('') }}><span className="om-option-icon">✎</span><span><strong>Update invitation details</strong><small>Edit names, wedding information and celebrations</small></span><b>→</b></button>
      <button className="om-option" onClick={() => { setSection('responses'); setError(''); setNotice('') }}><span className="om-option-icon">♡</span><span><strong>Read RSVP responses</strong><small>{data.responses.length} {data.responses.length === 1 ? 'response' : 'responses'} received</small></span><b>→</b></button>
    </section>}
    {section === 'edit' && <div className="om-edit-layout">{SPLIT_PREVIEW_ENABLED && <section className="om-preview-panel" aria-label="Live invitation preview"><iframe ref={previewFrame} src="/client/live-preview?editor=1" title="Live wedding invitation preview" /><button className="om-save-top" type="submit" form="order-details-form" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></section>}<section className="om-card om-edit-card"><div className="om-edit-toolbar"><button className="om-back" onClick={() => setSection('home')}>← Back</button>{!SPLIT_PREVIEW_ENABLED && <button className="om-form-save" type="submit" form="order-details-form" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>}</div><h2>Invitation details</h2><p className="om-description">{SPLIT_PREVIEW_ENABLED ? 'Your preview updates as you edit.' : 'Edit your invitation details, then tap Save.'}</p><form id="order-details-form" onKeyDown={event => { if (event.key === 'Enter' && event.target instanceof HTMLInputElement) event.preventDefault() }} onSubmit={event => void saveDetails(event)}>
      <div className="om-fields">{fields.map(field => <label key={field.key}>{field.label}{field.multiline ? <textarea value={String(details[field.key] || '')} onFocus={() => focusField(`detail.${field.key}`, String(details[field.key] || ''))} onChange={event => setDetail(field.key, event.target.value)} rows={3} maxLength={nameTextLimit(details.template,field.key) ?? cardTextLimit(details.template,field.key) ?? 600} required={['groom','bride','venue','address'].includes(field.key)}/> : <input type={field.type || 'text'} value={String(details[field.key] || '')} onFocus={() => focusField(`detail.${field.key}`, String(details[field.key] || ''))} onChange={event => setDetail(field.key, event.target.value)} required={['groom','bride','date','time','offset','venue','address'].includes(field.key)}/>}</label>)}</div>
      {[2,3,5,6,7].includes(details.template)&&<label style={{display:'flex',alignItems:'center',gap:12,margin:'24px 0'}}><input type="checkbox" checked={details.showCoupleIllustrations!==false} onChange={event=>{const show=event.target.checked;setDetails(current=>current?{...current,showCoupleIllustrations:show}:current)}} style={{width:20,height:20,minHeight:0,margin:0,padding:0}}/>Show Bride &amp; Groom Illustrations</label>}
      <MusicPicker value={details.music} onChange={value => setDetail('music', value)}/>
      <div className="om-events-title"><h3>Celebrations</h3><button type="button" onClick={addEvent} disabled={details.events.length >= 10}>＋ Add celebration</button></div>
      {details.events.map((item, index) => <fieldset className="om-event" key={index}><legend>Celebration {index + 1}</legend><button className="om-remove" type="button" onClick={() => removeEvent(index)} disabled={details.events.length <= 1}>Remove</button><div className="om-fields">{(['title','date','time','venue','address','map'] as const).map(key => <label key={key}>{({title:'Name',date:'Date',time:'Time',venue:'Venue',address:'Address',map:'Map link'})[key]}{['title','venue','address'].includes(key) ? <textarea rows={2} value={item[key]} maxLength={cardTextLimit(details.template,key) ?? 600} onFocus={() => focusField(`event.${index}.${key}`, item[key])} onChange={event => setEvent(index,key,event.target.value)} required/> : <input type={key === 'date' || key === 'time' ? key : key === 'map' ? 'url' : 'text'} value={item[key]} onFocus={() => focusField(`event.${index}.${key}`, item[key])} onChange={event => setEvent(index,key,event.target.value)} required={key !== 'map'}/>}</label>)}</div></fieldset>)}
      <button className="om-save" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
    </form></section></div>}
    {section === 'responses' && <section className="om-card"><button className="om-back" onClick={() => setSection('home')}>← Back</button><h2>RSVP responses</h2><p className="om-description">Guest replies and messages for your invitation.</p>{data.responses.length ? <div className="om-response-list">{data.responses.map(reply => <article className="om-response" key={reply.id}><div className="om-response-head"><strong>{reply.name}</strong><span className={reply.attendance === 'yes' ? 'om-attending' : 'om-declined'}>{reply.attendance === 'yes' ? 'Attending' : 'Unable to attend'}</span></div><p>{reply.attendance === 'yes' ? `${reply.guestCount} guest${reply.guestCount === 1 ? '' : 's'}${reply.additionalGuests.length ? ` · ${reply.additionalGuests.join(', ')}` : ''}` : '0 guests'}</p>{reply.message && <blockquote>{reply.message}</blockquote>}<time>{new Date(reply.updatedAt || reply.createdAt).toLocaleString()}</time></article>)}</div> : <div className="om-empty"><span>♡</span><strong>No responses yet</strong><p>Guest replies will appear here.</p></div>}</section>}
    <footer className="om-footer">Keep this link private. Anyone with it can manage this invitation.</footer>
  </div></main>
}
