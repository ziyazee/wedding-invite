import { useEffect } from 'react'

export default function Viah() {
  useEffect(() => {
    const title = document.title
    document.title = 'Navneet & Jasleen — Wedding Invitation'
    return () => { document.title = title }
  }, [])
  return (
    <iframe
      src="/templates/viah/index.html"
      title="Navneet and Jasleen — Viah Wedding Invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#1A0510' }}
      allow="autoplay"
    />
  )
}
