import { useEffect } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { invitationTemplateSrc } from '../invitations/templateFrame'

export default function Design14() {
  const details = useInvitationDetails()
  useEffect(() => {
    const previousTitle = document.title
    document.title = details ? `${details.groom} & ${details.bride} — Wedding Invitation` : 'Radha & Krishna — Wedding Invitation'
    return () => { document.title = previousTitle }
  }, [details])

  return (
    <iframe
      src={invitationTemplateSrc('/design14/index.html', 14, details)}
      title="Radha and Krishna wedding invitation"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#fffaf2' }}
      allow="autoplay"
    />
  )
}
