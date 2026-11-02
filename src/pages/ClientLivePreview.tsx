import { startTransition, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { InvitationData } from '../invitations/model'
import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const previewKey = 'shaadi-client-live-preview'
const previewQuery = new URLSearchParams(window.location.search)
const isBrowsePreview = previewQuery.get('store') === '1' || previewQuery.get('browse') === '1'

function readPreview(): InvitationData | null {
  const template = Number(new URLSearchParams(window.location.search).get('template'))
  const fallback = invitationExample(template) ?? null
  try {
    const value = sessionStorage.getItem(previewKey)
    const saved = value ? JSON.parse(value) as InvitationData : null
    return template && saved?.template !== template ? fallback : saved ?? fallback
  } catch {
    return fallback
  }
}

export default function ClientLivePreview() {
  const [details, setDetails] = useState<InvitationData | null>(readPreview)
  const renderedTemplate = useRef(details?.template)

  useLayoutEffect(() => {
    if (isBrowsePreview || renderedTemplate.current !== details?.template) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    renderedTemplate.current = details?.template
  }, [details?.template])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('editor') !== '1') return
    const style = document.documentElement.style
    const previous = style.overflowAnchor
    style.overflowAnchor = 'none'
    return () => { style.overflowAnchor = previous }
  }, [])

  useEffect(() => {
    const updatePreview = (next: InvitationData | null) => {
      // Keep the visible invitation while a different template's lazy renderer
      // loads. Edits within the same template retain their immediate behavior.
      if (isBrowsePreview || (next && next.template !== renderedTemplate.current)) startTransition(() => setDetails(next))
      else setDetails(next)
    }
    const syncPreview = (event: StorageEvent) => {
      if (event.key === previewKey) updatePreview(readPreview())
    }
    const syncMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (event.data?.type === 'shaadi-preview-update' && event.data.data) updatePreview(event.data.data as InvitationData)
    }
    window.addEventListener('storage', syncPreview)
    window.addEventListener('message', syncMessage)
    window.parent?.postMessage({ type: 'shaadi-preview-ready' }, window.location.origin)
    return () => { window.removeEventListener('storage', syncPreview); window.removeEventListener('message', syncMessage) }
  }, [])

  if (!details) return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#69746d', font: '14px Arial, sans-serif' }}>Preparing live invitation…</main>
  return <InvitationRenderer details={details} />
}
