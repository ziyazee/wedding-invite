import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const details = invitationExample(2)

export default function MajesticPreview() {
  if (!details) return null
  return <InvitationRenderer details={details} />
}
