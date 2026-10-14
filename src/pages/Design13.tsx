import { useEffect } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { invitationTemplateSrc } from '../invitations/templateFrame'

export default function Design13() {
  const details = useInvitationDetails()
  useEffect(() => {
    const previousTitle = document.title
    document.title = details ? `${details.groom} & ${details.bride} — Wedding Invitation` : 'KIRAN WEDS RAHUL'
    return () => { document.title = previousTitle }
  }, [details])

  return (
    <iframe
      src={invitationTemplateSrc('/design13/index.html', 13, details)}
      title="Kiran and Rahul wedding invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#fffaf2' }}
      allow="autoplay"
    />
  )
}
