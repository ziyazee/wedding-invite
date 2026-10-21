import AnimatedInvitation from '../invitations/AnimatedInvitation'
import { InvitationContext } from '../invitations/context'
import { invitationExample } from '../invitations/templateData'

const sample = invitationExample(6)
const details = sample ? { ...sample, template: 3 } : undefined

export default function EmbroideredGardenPreview() {
  if (!details) return null
  return <InvitationContext.Provider value={details}><AnimatedInvitation details={details} /></InvitationContext.Provider>
}
