import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const details = invitationExample(19)

export default function RubyHourPreview() {
  if (!details) return null
  return <InvitationRenderer details={details} />
}
