import { useEffect } from 'react'

export default function Design6() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Elisa & Jhon — Majestic'
    return () => { document.title = previousTitle }
  }, [])

  return <iframe
    src="/design6/index.html"
    title="Elisa and Jhon — Majestic wedding invitation"
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#f6f3ea' }}
    allow="autoplay"
  />
}
