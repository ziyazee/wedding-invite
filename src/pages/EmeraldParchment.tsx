import { useEffect } from 'react'

export default function EmeraldParchment() {
  useEffect(() => {
    const title = document.title
    document.title = 'Ayisha & Shafi — Nikkah Invitation'
    return () => { document.title = title }
  }, [])

  return <iframe
    src="/emerald-parchment/index.html"
    title="Ayisha and Shafi — Emerald Parchment Nikkah invitation"
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#0f1e16' }}
    allow="autoplay"
  />
}
