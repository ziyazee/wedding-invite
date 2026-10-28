import { useEffect } from 'react'

export default function AamantranDestination() {
  useEffect(() => {
    const title = document.title
    document.title = 'Aastha & Adarsh — Wedding Invitation'
    return () => { document.title = title }
  }, [])
  return (
    <iframe
      src="/templates/destination-wedding/index.html"
      title="Aastha and Adarsh — Destination Wedding Invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#0a0a0a' }}
      allow="autoplay"
    />
  )
}
