import { useEffect, useRef } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { invitationExample } from '../invitations/templateData'
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
  const details = useInvitationDetails() || invitationExample(8) || null
  const frameRef = useRef<HTMLIFrameElement>(null)
  const templateSrc = invitationTemplateSrc('/templates/the-artful-love-story/index.html', 8, details)
  const initialTemplateSrc = useRef(templateSrc)
  const editorPreview = new URLSearchParams(window.location.search).get('editor') === '1'
  const frameSrc = editorPreview ? initialTemplateSrc.current : templateSrc

  useEffect(() => {
    const previousTitle = document.title
    document.title = details ? `${details.groom} & ${details.bride} — Wedding Invitation` : 'Wedding Invitation'

    const w = window.innerWidth <= 640 ? 640 : window.innerWidth <= 960 ? 960 : 1600
    const preloadPaths = [
      `/templates/the-artful-love-story/assets/optimized/xZKlIX9XaacbmAvyKmu8rqVXE-${w}.webp`,
      `/templates/the-artful-love-story/assets/optimized/J6YiMAQTDPTAlfG2On7An1Q5lB4-${w}.webp`,
      `/templates/the-artful-love-story/assets/optimized/VrdsdVM2OwyjQkw6YWOB0OowTQ-${w}.webp`,
    ]
    const preloadLinks = preloadPaths.map(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = href
      document.head.appendChild(link)
      return link
    })

    return () => {
      document.title = previousTitle
      preloadLinks.forEach(link => link.remove())
    }
  }, [details])

  useEffect(() => {
    applyOpeningDate(frameRef.current, details)
    if (editorPreview) frameRef.current?.contentWindow?.postMessage({ type: 'invitation-editor-details', query: new URL(templateSrc, window.location.origin).search }, window.location.origin)
  }, [details, editorPreview, templateSrc])

  return (
    <iframe
      ref={frameRef}
      src={`${frameSrc}${frameSrc.includes('?') ? '&' : '?'}v=story-no-photos`}
      title="Wedding invitation preview"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#fffaf2' }}
      allow="autoplay"
      onLoad={() => {
        applyOpeningDate(frameRef.current, details)
        if (editorPreview && frameRef.current?.contentDocument) frameRef.current.contentDocument.documentElement.style.overflowAnchor = 'none'
        if (editorPreview) frameRef.current?.contentWindow?.postMessage({ type: 'invitation-editor-details', query: new URL(templateSrc, window.location.origin).search }, window.location.origin)
        const iframeDoc = frameRef.current?.contentDocument
        if (iframeDoc && details && (details.companyLogo || details.companyName)) {
          const existing = iframeDoc.querySelector('.designed-by-footer')
          if (!existing) {
            const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
            const footer = iframeDoc.createElement('footer')
            footer.className = 'designed-by-footer'
            footer.innerHTML = `<span class="designed-by-label">Designed by</span>${details.companyLogo ? `<img class="designed-by-logo" src="${esc(details.companyLogo)}" alt="${esc(details.companyName || 'Company')}"/>` : `<span class="designed-by-name">${esc(details.companyName!)}</span>`}`
            const style = iframeDoc.createElement('style')
            style.textContent = `.designed-by-footer{display:flex;align-items:center;justify-content:center;gap:6px;padding:14px 16px;background:rgba(0,0,0,.03);border-top:1px solid rgba(0,0,0,.06);font-family:system-ui,-apple-system,sans-serif}.designed-by-label{font-size:11px;letter-spacing:.04em;color:rgba(0,0,0,.4);text-transform:uppercase}.designed-by-logo{max-height:22px;width:auto;object-fit:contain;opacity:.7}.designed-by-name{font-size:13px;font-weight:600;color:rgba(0,0,0,.5)}`
            iframeDoc.head.appendChild(style)
            iframeDoc.body.appendChild(footer)
          }
        }
      }}
    />
  )
}
