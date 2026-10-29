import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const details = invitationExample(4)

export default function MandapAtDuskPreview() {
  if (!details) return null
  return <InvitationRenderer details={details} />
}
