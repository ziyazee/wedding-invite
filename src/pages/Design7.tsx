import { useEffect } from 'react'

export default function Design7() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Martina & Javier — Bloom'
    return () => { document.title = previousTitle }
  }, [])

  return <iframe
    src="/design7/index.html"
    title="Martina and Javier — Bloom wedding invitation"
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#f6f3ea' }}
    allow="autoplay"
  />
}
