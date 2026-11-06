// Native designs and legacy designs in same-origin frames share this observer.
// Only audio and frame changes trigger a scan; animation/text updates do not.
export function observeInvitationAudio(root: Document, attach: (audio: HTMLAudioElement) => () => void) {
  const documents = new Map<Document, MutationObserver>()
  const frames = new Set<HTMLIFrameElement>()
  const players = new Map<HTMLAudioElement, () => void>()
  let stopped = false
  function scan() {
    if (stopped) return
    const nextDocuments = new Set<Document>()
    const nextFrames = new Set<HTMLIFrameElement>()
    const nextPlayers = new Set<HTMLAudioElement>()
    function visit(doc: Document) {
      nextDocuments.add(doc)
      doc.querySelectorAll('audio').forEach(audio => nextPlayers.add(audio))
      doc.querySelectorAll('iframe').forEach(frame => {
        nextFrames.add(frame)
        try { if (frame.contentDocument) visit(frame.contentDocument) } catch { /* External embeds. */ }
      })
    }
    visit(root)
    documents.forEach((observer, doc) => { if (!nextDocuments.has(doc)) { observer.disconnect(); documents.delete(doc) } })
    frames.forEach(frame => { if (!nextFrames.has(frame)) { frame.removeEventListener('load', scan); frames.delete(frame) } })
    players.forEach((cleanup, player) => { if (!nextPlayers.has(player)) { cleanup(); players.delete(player) } })
    nextDocuments.forEach(doc => {
      if (documents.has(doc)) return
      const observer = new MutationObserver(records => {
        if (records.some(record => [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1 && ((node as Element).matches('audio,iframe') || (node as Element).querySelector('audio,iframe'))))) scan()
      })
      observer.observe(doc, { childList: true, subtree: true })
      documents.set(doc, observer)
    })
    nextFrames.forEach(frame => { if (!frames.has(frame)) { frames.add(frame); frame.addEventListener('load', scan) } })
    nextPlayers.forEach(player => { if (!players.has(player)) players.set(player, attach(player)) })
  }
  scan()
  return () => {
    stopped = true
    documents.forEach(observer => observer.disconnect())
    frames.forEach(frame => frame.removeEventListener('load', scan))
    players.forEach(cleanup => cleanup())
  }
}
