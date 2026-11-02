import InvitationRenderer from '../invitations/InvitationRenderer'
import { invitationExample } from '../invitations/templateData'

const example = invitationExample(7)
const details = example ? {
  ...example,
  companyName: 'Shaadi Invites',
  companyLogo: '/logo.png',
} : undefined

export default function BloomPreview() {
  if (!details) return null
  return <InvitationRenderer details={details} />
}
