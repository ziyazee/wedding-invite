import { useEffect } from 'react'

export default function BirthdayInvite() {
  useEffect(() => {
    const title = document.title
    document.title = 'Aarya turns One! 🎈'
    return () => { document.title = title }
  }, [])
  return (
    <iframe
      src="/birthday/index.html"
      title="Aarya's First Birthday Invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#FFF6EE' }}
      allow="autoplay"
    />
  )
}
