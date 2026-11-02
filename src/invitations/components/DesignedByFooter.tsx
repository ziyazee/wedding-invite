import { useInvitationDetails } from '../context'
import './DesignedByFooter.css'

export default function DesignedByFooter() {
  const details = useInvitationDetails()
  const logo = details?.companyLogo
  const name = details?.companyName
  const phone = details?.companyPhone?.replace(/\D/g, '')
  const whatsappPhone = phone && (phone.length === 10 ? `91${phone}` : phone.length >= 11 && phone.length <= 15 ? phone : '')
  if (!logo && !name) return null
  if (details?.template === 13 || details?.template === 14 || details?.template === 15) return null
  return (
    <footer className="designed-by-footer">
      <span className="designed-by-label">Invitation by</span>
      {logo
        ? whatsappPhone
          ? <a className="designed-by-logo-link" href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noreferrer" aria-label={`Contact ${name || 'company'} on WhatsApp`}><img className="designed-by-logo" src={logo} alt={name || 'Company'} /></a>
          : <img className="designed-by-logo" src={logo} alt={name || 'Company'} />
        : <span className="designed-by-name">{name}</span>}
    </footer>
  )
}
