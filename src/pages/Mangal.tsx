import { useEffect } from 'react'

export default function Mangal() {
  useEffect(() => {
    const title = document.title
    document.title = 'Arjun & Priya — Wedding Invitation'
    return () => { document.title = title }
  }, [])
  return (
    <iframe
      src="/templates/mangal/index.html"
      title="Arjun and Priya — Mangal Wedding Invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#1A0A0A' }}
      allow="autoplay"
    />
  )
}
