import { useEffect } from 'react'

export default function ShaadiPathT02() {
  useEffect(() => {
    const title = document.title
    document.title = 'Priya & Arjun — Wedding Invitation'
    return () => { document.title = title }
  }, [])
  return (
    <iframe
      src="/templates/shaadipath-t02/index.html"
      title="Priya and Arjun — Royal Jodhpur Wedding Invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#0D1B3E' }}
      allow="autoplay"
    />
  )
}
