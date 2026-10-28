import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const details = invitationExample(7)

export default function BloomPreview() {
  if (!details) return null
  return <InvitationRenderer details={details} />
}
