import Majestic from './majestic/Majestic'
import { invitationExample } from '../invitations/templateData'
import { useInvitationDetails } from '../invitations/context'

export default function Design6() {
  const details = useInvitationDetails() || invitationExample(2)!
  return <Majestic details={details} />
}
