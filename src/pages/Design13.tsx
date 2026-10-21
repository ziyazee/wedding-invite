import { useEffect, useRef } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { invitationTemplateSrc } from '../invitations/templateFrame'

function findWeddingDate(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null

  const entries = Object.entries(value)
  for (const preferred of [/(wedding|event).*date|date.*(wedding|event)/i, /date/i]) {
    for (const [key, entry] of entries) {
      if (!preferred.test(key) || typeof entry !== 'string' || !entry.trim()) continue
      const parsed = /^\d{4}-\d{2}-\d{2}/.test(entry)
        ? new Date(`${entry.slice(0, 10)}T00:00:00Z`)
        : new Date(entry)
      return Number.isNaN(parsed.getTime())
        ? entry
        : new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(parsed)
    }
  }

  for (const [, entry] of entries) {
    const nestedDate = findWeddingDate(entry)
    if (nestedDate) return nestedDate
  }

  return null
}

function applyOpeningDate(frame: HTMLIFrameElement | null, details: unknown) {
  const date = findWeddingDate(details)
  const doc = frame?.contentDocument
  if (!date || !doc) return

  doc.querySelectorAll<HTMLElement>('p.d13-text').forEach((element) => {
    if (!/are getting married/i.test(element.textContent ?? '')) return
    element.textContent = date
    element.style.setProperty('font-size', 'calc(1em + 2px)')
  })
}

export default function Design13() {
  const details = useInvitationDetails()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const templateSrc = invitationTemplateSrc('/design13/index.html', 13, details)
  const initialTemplateSrc = useRef(templateSrc)
  const editorPreview = new URLSearchParams(window.location.search).get('editor') === '1'
  const frameSrc = editorPreview ? initialTemplateSrc.current : templateSrc

  useEffect(() => {
    const previousTitle = document.title
    document.title = details ? `${details.groom} & ${details.bride} — Wedding Invitation` : 'KIRAN WEDS RAHUL'
    return () => { document.title = previousTitle }
  }, [details])

  useEffect(() => {
    applyOpeningDate(frameRef.current, details)
    if (editorPreview) frameRef.current?.contentWindow?.postMessage({ type: 'invitation-editor-details', query: new URL(templateSrc, window.location.origin).search }, window.location.origin)
  }, [details, editorPreview, templateSrc])

  return (
    <iframe
      ref={frameRef}
      src={`${frameSrc}${frameSrc.includes('?') ? '&' : '?'}v=story-no-photos`}
      title="Kiran and Rahul wedding invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#fffaf2' }}
      allow="autoplay"
      onLoad={() => {
        applyOpeningDate(frameRef.current, details)
        if (editorPreview && frameRef.current?.contentDocument) frameRef.current.contentDocument.documentElement.style.overflowAnchor = 'none'
        if (editorPreview) frameRef.current?.contentWindow?.postMessage({ type: 'invitation-editor-details', query: new URL(templateSrc, window.location.origin).search }, window.location.origin)
      }}
    />
  )
}
