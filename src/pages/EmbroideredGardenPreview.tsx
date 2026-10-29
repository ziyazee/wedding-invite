import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const details = invitationExample(6)

export default function EmbroideredGardenPreview() {
  if (!details) return null
  return <InvitationRenderer details={details} />
}
