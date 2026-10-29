import { useInvitationDetails } from '../context'
import './DesignedByFooter.css'

export default function DesignedByFooter() {
  const details = useInvitationDetails()
  const logo = details?.companyLogo
  const name = details?.companyName
  if (!logo && !name) return null
  return (
    <footer className="designed-by-footer">
      <span className="designed-by-label">Designed by</span>
      {logo
        ? <img className="designed-by-logo" src={logo} alt={name || 'Company'} />
        : <span className="designed-by-name">{name}</span>}
    </footer>
  )
}
