import type { InvitationData } from './model'
import type { RsvpTarget } from './rsvp'
import { InvitationContext } from './context'
import PersonalMusic from './PersonalMusic'
import AnimatedInvitation from './AnimatedInvitation'
import NewDesign from '../pages/NewDesign'
import Design4 from '../pages/Design4'
import MohadRahma from '../pages/MohadRahma'
import Design8 from '../pages/Design8'
import Design9 from '../pages/Design9'
import Design10 from '../pages/Design10'
import Design11 from '../pages/Design11'
import Design12 from '../pages/Design12'
import Design13 from '../pages/Design13'
import Design14 from '../pages/Design14'
import Design15 from '../pages/Design15'
import Design16 from '../pages/Design16'
import Design17 from '../pages/Design17'
import Design18 from '../pages/Design18'
import TextLayoutLayer from './TextLayoutLayer'

export default function InvitationRenderer({ details, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const animatedTemplateId = details.template === 2 ? 6 : details.template === 6 ? 3 : details.template
  const animatedDetails = { ...details, template: animatedTemplateId }
  return <InvitationContext.Provider value={details}><TextLayoutLayer layout={details.textOverrides}>
    {(details.template === 101 || details.template === 108) && details.music && <PersonalMusic src={details.music} />}
    {details.template === 1 ? <MohadRahma /> : details.template === 3 ? <Design14 /> : details.template === 4 ? <Design18 /> : details.template === 8 ? <Design13 /> : details.template === 101 ? <NewDesign /> : details.template === 104 ? <Design4 /> : details.template === 108 ? <Design8 /> : details.template === 109 ? <Design9 /> : details.template === 110 ? <Design10 /> : details.template === 111 ? <Design11 /> : details.template === 112 ? <Design12 /> : details.template === 115 ? <Design15 /> : details.template === 116 ? <Design16 /> : details.template === 117 ? <Design17 /> : <InvitationContext.Provider value={animatedDetails}><AnimatedInvitation details={animatedDetails} rsvpTarget={rsvpTarget} /></InvitationContext.Provider>}
  </TextLayoutLayer></InvitationContext.Provider>
}
