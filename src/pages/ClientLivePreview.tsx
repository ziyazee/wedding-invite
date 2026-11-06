import { startTransition, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { InvitationData } from '../invitations/model'
import InvitationRenderer from '../invitations/InvitationRenderer'
import InvitationLoading from '../invitations/InvitationLoading'
import { invitationExample } from '../invitations/templateData'
import { createPreviewSongPlayback } from '../invitations/previewSongPlayback'

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
  const [songReplay, setSongReplay] = useState(0)
  const renderedTemplate = useRef(details?.template)

  useEffect(() => {
    if (previewQuery.get('editor') !== '1') return
    const playback = createPreviewSongPlayback(document)
    const selectSong = (event: Event) => {
      const selection = (event as CustomEvent<{ music: string; musicStart?: number; musicEnd?: number }>).detail
      if (!selection || typeof selection.music !== 'string') return
      const { music, musicStart, musicEnd } = selection
      // Reset the design as well as the song, including repeated song taps.
      // Keep this synchronous so native players retain the click gesture.
      playback.dispose()
      flushSync(() => {
        setDetails(previous => previous ? { ...previous, music, musicStart, musicEnd } : previous)
        setSongReplay(previous => previous + 1)
      })
      playback.play(music, musicStart)
    }
    document.addEventListener('shaadi-preview-song', selectSong)
    return () => { document.removeEventListener('shaadi-preview-song', selectSong); playback.dispose() }
  }, [details?.template])

  useLayoutEffect(() => {
    if (isBrowsePreview || songReplay > 0 || renderedTemplate.current !== details?.template) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    renderedTemplate.current = details?.template
  }, [details?.template, songReplay])

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

  if (!details) return <InvitationLoading />
  return <InvitationRenderer key={songReplay} details={details} />
}
