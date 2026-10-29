import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const details = invitationExample(8)

export default function ArtfulLoveStoryPreview() {
  if (!details) return null
  return <InvitationRenderer details={details} />
}
