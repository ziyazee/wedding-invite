import type { InvitationData } from './model'
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

export default function InvitationRenderer({ details }: { details: InvitationData }) {
  return <InvitationContext.Provider value={details}>
    {(details.template === 1 || details.template === 8) && details.music && <PersonalMusic src={details.music} />}
    {details.template === 1 ? <NewDesign /> : details.template === 2 ? <MohadRahma /> : details.template === 4 ? <Design4 /> : details.template === 8 ? <Design8 /> : details.template === 9 ? <Design9 /> : details.template === 10 ? <Design10 /> : details.template === 11 ? <Design11 /> : details.template === 12 ? <Design12 /> : details.template === 13 ? <Design13 /> : details.template === 14 ? <Design14 /> : details.template === 15 ? <Design15 /> : details.template === 16 ? <Design16 /> : details.template === 17 ? <Design17 /> : details.template === 18 ? <Design18 /> : <AnimatedInvitation details={details} />}
  </InvitationContext.Provider>
}
