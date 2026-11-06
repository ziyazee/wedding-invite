import { flushSync } from 'react-dom'

// Only installed by the dashboard editor. Use each design's existing opening
// action so its animation and music controls keep their normal behaviour.
const openingControls = [
  '.mj-cover:not([aria-hidden="true"]) .mj-open-btn',
  '.secret-garden:not(.sg-opened) .sg-open-btn',
  '.eg-cover:not([aria-hidden="true"])', '.rg-open', '.d14-entry-play',
  '.d18-enter:not(:disabled)', '.d15-enter', '.d16-enter', '.d17-enter',
  '.tajmahal-template__entry-trigger:has(.tajmahal-template__tap-prompt:not(.is-hidden))',
  '.kerala-template__entry-trigger:has(.kerala-template__tap-prompt:not(.is-hidden))',
  '#open-invitation', '#tap-to-open', '#tap-btn', '#gate-btn', '#gateOverlay',
].join(',')

export function createPreviewSongPlayback(root: Document) {
  const opened = new WeakSet<HTMLElement>()
  let cancel = () => {}

  function play(song: string, start = 0) {
    cancel()
    let disposed = false
    const documents = new Set<Document>()
    const attempted = new WeakMap<HTMLAudioElement, string>()
    const cleanups: (() => void)[] = []

    function visit(doc: Document) {
      if (disposed || !doc.documentElement) return
      if (!documents.has(doc)) {
        documents.add(doc)
        const observer = new MutationObserver(() => visit(doc))
        observer.observe(doc.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'disabled', 'hidden', 'style'] })
        const onLoad = () => visit(doc)
        doc.addEventListener('load', onLoad, true)
        cleanups.push(() => { observer.disconnect(); doc.removeEventListener('load', onLoad, true) })
      }
      // Legacy designs contain their own same-origin invitation document.
      for (const frame of doc.querySelectorAll('iframe')) {
        try { if (frame.contentDocument) visit(frame.contentDocument) } catch { /* Maps and other external embeds are not invitation controls. */ }
      }
      if (doc.readyState === 'loading') return
      const audio = doc.querySelector<HTMLAudioElement>('audio')
      const source = audio?.src || audio?.querySelector('source')?.src || ''
      // An iframe adapter may still be applying the new song. Wait for its src
      // change before opening, instead of briefly playing the previous track.
      if (song && audio && source !== new URL(song, root.baseURI).href) return
      const opener = doc.querySelector<HTMLElement>(openingControls)
        ?? Array.from(doc.querySelectorAll<HTMLElement>('button,[role="button"]')).find(element => /^(tap to open|open (the |your )?invitation)$/i.test(element.textContent?.trim() || element.getAttribute('aria-label') || ''))
      if (opener && !opened.has(opener) && !opener.matches(':disabled') && !opener.closest('[aria-hidden="true"]') && opener.getClientRects().length) {
        opened.add(opener)
        flushSync(() => opener.click())
      }
      // Opening Secret Garden mounts its player, so read it again after click.
      const player = doc.querySelector<HTMLAudioElement>('audio')
      const playerSource = player?.src || player?.querySelector('source')?.src || ''
      if (!player || !playerSource || (song && playerSource !== new URL(song, root.baseURI).href) || attempted.get(player) === playerSource) return
      attempted.set(player, playerSource)
      // Replay from the chosen range's start, including repeated song taps.
      player.currentTime = start
      player.muted = false
      if (!player.volume) player.volume = .4
      void player.play().catch(() => {
        if (disposed) return
        // A fresh source may interrupt an in-flight play; retry on readiness.
        const retry = () => { if (!disposed && player.isConnected) void player.play().catch(() => {}) }
        player.addEventListener('canplay', retry, { once: true })
        cleanups.push(() => player.removeEventListener('canplay', retry))
      })
    }

    const timeout = window.setTimeout(() => cancel(), 12000)
    cancel = () => {
      disposed = true
      window.clearTimeout(timeout)
      cleanups.forEach(cleanup => cleanup())
    }
    visit(root)
  }

  return { play, dispose: () => cancel() }
}
