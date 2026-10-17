import { useEffect, useState } from 'react'
import type { InvitationData } from '../invitations/model'
import InvitationRenderer from '../invitations/InvitationRenderer'

const previewKey = 'shaadi-client-live-preview'

function readPreview(): InvitationData | null {
  try {
    const value = sessionStorage.getItem(previewKey)
    return value ? JSON.parse(value) as InvitationData : null
  } catch {
    return null
  }
}

export default function ClientLivePreview() {
  const [details, setDetails] = useState<InvitationData | null>(readPreview)

  useEffect(() => {
    const syncPreview = (event: StorageEvent) => {
      if (event.key === previewKey) setDetails(readPreview())
    }
    window.addEventListener('storage', syncPreview)
    return () => window.removeEventListener('storage', syncPreview)
  }, [])

  if (!details) return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#69746d', font: '14px Arial, sans-serif' }}>Preparing live invitation…</main>
  return <InvitationRenderer details={details} />
}
