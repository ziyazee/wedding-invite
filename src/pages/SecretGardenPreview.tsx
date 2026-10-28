import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const details = invitationExample(5)

export default function SecretGardenPreview() {
  if (!details) return null
  return <InvitationRenderer details={details} />
}
