import { useEffect } from 'react'

export default function AamantranQubool() {
  useEffect(() => {
    const title = document.title
    document.title = 'Zayan & Alishba — Nikah Invitation'
    return () => { document.title = title }
  }, [])
  return (
    <iframe
      src="/templates/qubool/index.html"
      title="Zayan and Alishba — Qubool Nikah Invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#0a0810' }}
      allow="autoplay"
    />
  )
}
