import { useState } from 'react'
import { useInvitationDetails } from '../context'
import { companyWhatsAppURL } from '../model'
import type { InvitationData } from '../model'
import './DesignedByFooter.css'

export default function DesignedByFooter({ details: suppliedDetails }: { details?: InvitationData } = {}) {
  const contextDetails = useInvitationDetails()
  const details = suppliedDetails ?? contextDetails
  const [failedLogo, setFailedLogo] = useState<string>()
  const logo = details?.companyLogo !== failedLogo ? details?.companyLogo : undefined
  const name = details?.companyName
  const whatsappURL = companyWhatsAppURL(details?.companyPhone)
  if (!details?.companyLogo && !name) return null
  const branding = logo
    ? <img className="designed-by-logo" src={logo} alt={name || 'Company'} onError={() => setFailedLogo(logo)} />
    : <span className="designed-by-name">{name || 'Company'}</span>
  return (
    <footer className="designed-by-footer">
      <span className="designed-by-label">Invitation by</span>
      {whatsappURL
        ? <a className="designed-by-logo-link" href={whatsappURL} target="_blank" rel="noreferrer" aria-label={`Contact ${name || 'company'} on WhatsApp`}>{branding}</a>
        : branding}
    </footer>
  )
}
