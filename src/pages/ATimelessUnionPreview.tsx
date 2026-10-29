import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const details = invitationExample(3)

export default function ATimelessUnionPreview() {
  if (!details) return null
  return <InvitationRenderer details={details} />
}
