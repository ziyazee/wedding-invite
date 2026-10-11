import { useEffect } from 'react'

export default function Design5() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Clara & Nour — Secret Garden'
    return () => { document.title = previousTitle }
  }, [])

  return <iframe
    src="/design5/index.html"
    title="Clara and Nour — Secret Garden wedding invitation"
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#f6f3ea' }}
    allow="autoplay"
  />
}
