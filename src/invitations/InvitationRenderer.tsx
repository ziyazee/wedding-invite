import { lazy, Suspense, useMemo } from 'react'
import type { InvitationData } from './model'
import type { RsvpTarget } from './rsvp'
import { InvitationContext } from './context'
import SiteFonts from '../SiteFonts'
const PersonalMusic = lazy(() => import('./PersonalMusic'))
const AnimatedInvitation = lazy(() => import('./AnimatedInvitation'))
const NewDesign = lazy(() => import('../pages/NewDesign'))
const Design4 = lazy(() => import('../pages/Design4'))
const MohadRahma = lazy(() => import('../pages/MohadRahma'))
const Majestic = lazy(() => import('../pages/majestic/Majestic'))
const SecretGarden = lazy(() => import('../pages/secret-garden/SecretGarden'))
const Design8 = lazy(() => import('../pages/Design8'))
const Design9 = lazy(() => import('../pages/Design9'))
const Design10 = lazy(() => import('../pages/Design10'))
const Design11 = lazy(() => import('../pages/Design11'))
const Design12 = lazy(() => import('../pages/Design12'))
const Design13 = lazy(() => import('../pages/Design13'))
const Design14 = lazy(() => import('../pages/Design14'))
const Design15 = lazy(() => import('../pages/Design15'))
const Design16 = lazy(() => import('../pages/Design16'))
const Design17 = lazy(() => import('../pages/Design17'))
const Design18 = lazy(() => import('../pages/Design18'))
const TextLayoutLayer = lazy(() => import('./TextLayoutLayer'))
const OrderFrameInvitation = lazy(() => import('./OrderFrameInvitation'))

export default function InvitationRenderer({ details, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const animatedTemplateId = details.template === 2 ? 6 : details.template === 6 ? 3 : details.template
  const animatedDetails = useMemo(() => ({ ...details, template: animatedTemplateId }), [details, animatedTemplateId])
  const content = <>
    {(details.template === 101 || details.template === 108) && details.music && <PersonalMusic src={details.music} />}
    {details.template === 1 ? <MohadRahma /> : details.template === 3 ? <Design14 /> : details.template === 4 ? <Design18 /> : details.template === 8 ? <Design13 /> : details.template === 101 ? <NewDesign /> : details.template === 104 ? <Design4 /> : details.template === 108 ? <Design8 /> : details.template === 109 ? <Design9 /> : details.template === 110 ? <Design10 /> : details.template === 111 ? <Design11 /> : details.template === 112 ? <Design12 /> : details.template === 115 ? <Design15 /> : details.template === 116 ? <Design16 /> : details.template === 117 ? <Design17 /> : <InvitationContext.Provider value={animatedDetails}><AnimatedInvitation details={animatedDetails} rsvpTarget={rsvpTarget} /></InvitationContext.Provider>}
  </>
  return <InvitationContext.Provider value={details}><Suspense fallback={<div role="status" style={{minHeight:'100svh',display:'grid',placeItems:'center',background:'#fffaf2',color:'#75664c',font:'14px Arial,sans-serif'}}>Opening your invitation…</div>}>
    {[9, 10, 11, 12, 13, 14].includes(details.template) ? <TextLayoutLayer details={details} layout={details.textOverrides}><OrderFrameInvitation key={details.template} details={details} rsvpTarget={rsvpTarget}/></TextLayoutLayer> : details.template === 2 ? <Majestic details={details} rsvpTarget={rsvpTarget}/> : details.template === 5 ? <SecretGarden details={details} rsvpTarget={rsvpTarget}/> : details.template === 1 ? content : <><SiteFonts/><TextLayoutLayer details={details} layout={details.textOverrides}>{content}</TextLayoutLayer></>}
  </Suspense></InvitationContext.Provider>
}
