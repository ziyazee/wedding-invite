import { useCallback, useEffect, useRef, useState } from 'react'
import type { InvitationData } from './model'
import type { RsvpTarget } from './rsvp'
import { applyOrderFrame, installOrderFrameRsvp } from './orderFrameAdapter'

const sources: Record<number, string> = { 9: '/maroon-letter/index.html', 10: '/emerald-parchment/index.html', 11: '/shaadipath-t02/index.html' }

/** Compatibility adapter until these designs move to the native renderer.
 * Update the same document so typing never restarts the opening or music. */
export default function OrderFrameInvitation({ details, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
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
    const doc = frame.current?.contentDocument
    if (ready && doc) return installOrderFrameRsvp(doc, details.template, orderId && path ? { orderId, path } : undefined)
  }, [ready, details.template, orderId, path])
  return <>
    {!ready && <p role="status">{error || 'Opening your invitation…'}</p>}
    <iframe ref={frame} src={sources[details.template]} onLoad={sync} title={`${details.groom} & ${details.bride} — Wedding invitation`} allow="autoplay" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, visibility: ready ? 'visible' : 'hidden' }} />
  </>
}
