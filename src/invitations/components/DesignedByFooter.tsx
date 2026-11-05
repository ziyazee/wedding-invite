import { useState } from 'react'
import { useInvitationDetails } from '../context'
import { companyWhatsAppURL } from '../model'
import './DesignedByFooter.css'

export default function DesignedByFooter() {
  const details = useInvitationDetails()
  const [failedLogo, setFailedLogo] = useState<string>()
  const logo = details?.companyLogo !== failedLogo ? details?.companyLogo : undefined
  const name = details?.companyName
  const whatsappURL = companyWhatsAppURL(details?.companyPhone)
  if (!details?.companyLogo && !name) return null
  // Bloom renders its company branding inside the invitation iframe.
  if (details?.template === 7) return null
  if (details?.template === 13 || details?.template === 14 || details?.template === 15 || details?.template === 16) return null
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
