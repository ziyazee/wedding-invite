import { useInvitationDetails } from '../context'
import { companyWhatsAppURL } from '../model'
import './DesignedByFooter.css'

export default function DesignedByFooter() {
  const details = useInvitationDetails()
  const logo = details?.companyLogo
  const name = details?.companyName
  const whatsappURL = companyWhatsAppURL(details?.companyPhone)
  if (!logo && !name) return null
  if (details?.template === 13 || details?.template === 14 || details?.template === 15) return null
  return (
    <footer className="designed-by-footer">
      <span className="designed-by-label">Invitation by</span>
      {logo
        ? whatsappURL
          ? <a className="designed-by-logo-link" href={whatsappURL} target="_blank" rel="noreferrer" aria-label={`Contact ${name || 'company'} on WhatsApp`}><img className="designed-by-logo" src={logo} alt={name || 'Company'} /></a>
          : <img className="designed-by-logo" src={logo} alt={name || 'Company'} />
        : <span className="designed-by-name">{name}</span>}
    </footer>
  )
}
