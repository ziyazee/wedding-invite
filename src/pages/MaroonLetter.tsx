import { useEffect } from 'react'

export default function MaroonLetter() {
  useEffect(() => {
    const title = document.title
    document.title = 'Ayisha & Shafi — Nikkah Invitation'
    return () => { document.title = title }
  }, [])

  return <iframe
    src="/maroon-letter/index.html"
    title="Ayisha and Shafi — Maroon Letter Nikkah invitation"
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#0f0405' }}
    allow="autoplay"
  />
}
