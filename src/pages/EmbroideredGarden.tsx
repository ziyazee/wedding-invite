import { useEffect } from 'react'

/** Isolates the invitation's original typography and layout from the builder UI. */
export default function Design3() {
  useEffect(() => {
    const title = document.title
    document.title = 'Camille & Antoine — Embroidered Garden'
    return () => { document.title = title }
  }, [])

  return <iframe
    src="/templates/embroidered-garden/index.html"
    title="Camille and Antoine — Embroidered Garden wedding invitation"
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#f6f3ee' }}
    allow="autoplay"
  />
}
