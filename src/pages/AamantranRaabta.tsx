import { useEffect } from 'react'

export default function AamantranRaabta() {
  useEffect(() => {
    const title = document.title
    document.title = 'Mustafa & Zoya — Wedding Invitation'
    return () => { document.title = title }
  }, [])
  return (
    <iframe
      src="/aamantran-raabta/index.html"
      title="Mustafa and Zoya — Raabta Wedding Invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#0d0a1a' }}
      allow="autoplay"
    />
  )
}
