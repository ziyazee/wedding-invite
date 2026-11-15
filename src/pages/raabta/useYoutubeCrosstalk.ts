import { useEffect, useRef } from 'react'

const YT_ORIGIN = 'https://www.youtube.com'
const PLAYING = 1
const PAUSED = 2
const ENDED = 0

export function useYoutubeCrosstalk(iframeRef: React.RefObject<HTMLIFrameElement | null>, youtubeUrl: string | undefined) {
  const iframeIdRef = useRef('preWeddingVideo')

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !youtubeUrl) return

    const rawSrc = youtubeUrl
    if (!rawSrc || rawSrc.includes('{{')) return

    const loc = window.location
    const canUseOrigin = !!(loc && loc.origin && loc.origin !== 'null' && /^https?:/.test(loc.origin))
    if (!canUseOrigin) return

    let url: URL
    try { url = new URL(rawSrc, window.location.href) }
    catch { return }
    if (url.origin !== 'https://www.youtube.com') return

    const needsApi = url.searchParams.get('enablejsapi') !== '1'
    const needsOrigin = url.searchParams.get('origin') !== loc.origin
    if (needsApi || needsOrigin) {
      if (needsApi) url.searchParams.set('enablejsapi', '1')
      if (needsOrigin) url.searchParams.set('origin', loc.origin)
      iframe.src = url.toString()
    }

    function sendListening() {
      const win = iframe!.contentWindow
      if (!win) return
      win.postMessage(
        JSON.stringify({ event: 'listening', id: iframeIdRef.current, channel: 'widget' }),
        YT_ORIGIN
      )
      win.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'addEventListener',
          args: ['onStateChange'],
          id: iframeIdRef.current,
          channel: 'widget',
        }),
        YT_ORIGIN
      )
    }

    const onLoad = () => {
      setTimeout(sendListening, 300)
      setTimeout(sendListening, 1200)
    }
    iframe.addEventListener('load', onLoad)

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== YT_ORIGIN) return
      if (event.source !== iframe!.contentWindow) return

      let msg: any
      try {
        msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      } catch { return }
      if (!msg || typeof msg !== 'object') return

      const state =
        msg.event === 'onStateChange' ? msg.info :
        msg.event === 'infoDelivery' && msg.info && 'playerState' in msg.info ? msg.info.playerState :
        null
      if (state === null || state === undefined) return

      const ctl = window.__bgMusicControl
      if (!ctl) return
      if (state === PLAYING) ctl.pauseForExternal()
      else if (state === PAUSED || state === ENDED) ctl.resumeAfterExternal()
    }
    window.addEventListener('message', onMessage)

    return () => {
      iframe.removeEventListener('load', onLoad)
      window.removeEventListener('message', onMessage)
    }
  }, [iframeRef, youtubeUrl])
}
