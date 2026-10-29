import { useCallback, useEffect, useRef, useState } from 'react'
import type { InvitationData } from './model'
import type { RsvpTarget } from './rsvp'
import { applyOrderFrame, installOrderFrameRsvp } from './orderFrameAdapter'
import { destinationHTML } from './newOrderTemplates'

const sources: Record<number, string> = { 9: '/templates/maroon-letter/index.html', 10: '/templates/emerald-parchment/index.html', 11: '/templates/shaadipath-t02/index.html', 12: '/templates/destination-wedding/index.html', 13: '/templates/raabta/index.html', 14: '/templates/qubool/index.html' }

/** Compatibility adapter until these designs move to the native renderer.
 * Update the same document so typing never restarts the opening or music. */
export default function OrderFrameInvitation({ details, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [html, setHTML] = useState<string>()
  const currentDetails = useRef(details)
  currentDetails.current = details
  // This prebuilt React export reads its configuration only on mount. Reload
  // for content changes; layout-only edits keep the same document and scroll.
  const contentKey = details.template === 12 ? JSON.stringify({ ...details, textOverrides: undefined }) : ''
  useEffect(() => {
    if (!contentKey) return
    const abort = new AbortController()
    setReady(false)
    fetch(sources[12], { signal: abort.signal }).then(response => { if(!response.ok)throw new Error('Could not load Destination.');return response.text() }).then(source => { if(!abort.signal.aborted)setHTML(destinationHTML(source, currentDetails.current)) }).catch(error => { if(!abort.signal.aborted)setError(error instanceof Error ? error.message : 'Could not load Destination.') })
    return () => abort.abort()
  }, [contentKey])
  const sync = useCallback(() => {
    const doc = frame.current?.contentDocument
    if (!doc?.body || !doc.querySelector('script')) return
    try {
      applyOrderFrame(doc, details)
      setReady(true)
      setError('')
    } catch {
      setError('The invitation could not load. Please reload the page.')
    }
  }, [details])
  useEffect(() => { if (ready) sync() }, [sync, ready])
  const orderId = rsvpTarget?.orderId
  const path = rsvpTarget?.path
  useEffect(() => {
    if(!ready || ![13,14].includes(details.template))return
    const tick=()=>{
      const doc=frame.current?.contentDocument,d=currentDetails.current
      if(!doc)return
      let remaining=Math.max(0,Math.floor((new Date(`${d.date}T${d.time}:00${d.offset}`).getTime()-Date.now())/1000))
      const values=[86400,3600,60,1].map(unit=>{const value=Math.floor(remaining/unit);remaining%=unit;return value})
      const selectors=d.template===13?['#cdDays','#cdHours','#cdMins','#cdSecs']:['[data-cd="days"]','[data-cd="hours"]','[data-cd="mins"]','[data-cd="secs"]']
      selectors.forEach((selector,index)=>{const el=doc.querySelector(selector);if(el)el.textContent=String(values[index]).padStart(2,'0')})
      const section=doc.querySelector<HTMLElement>(d.template===13?'#countdownSection':'#countdown');if(section){section.hidden=false;section.style.removeProperty('display')}
    }
    tick();const timer=window.setInterval(tick,1000);return()=>window.clearInterval(timer)
  },[ready,details])
  useEffect(() => {
    const doc = frame.current?.contentDocument
    if (ready && doc) return installOrderFrameRsvp(doc, details.template, orderId && path ? { orderId, path } : undefined)
  }, [ready, details.template, orderId, path, html])
  return <>
    {!ready && <p role="status">{error || 'Opening your invitation…'}</p>}
    {(details.template !== 12 || html) && <iframe ref={frame} data-order-template={details.template} src={details.template === 12 ? undefined : sources[details.template]} srcDoc={details.template === 12 ? html : undefined} onLoad={sync} title={`${details.groom} & ${details.bride} — Wedding invitation`} allow="autoplay" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, visibility: ready ? 'visible' : 'hidden' }} />}
  </>
}
