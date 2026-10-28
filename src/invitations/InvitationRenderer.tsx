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
const ArtfulLoveStory = lazy(() => import('../pages/ArtfulLoveStory'))
const ATimelessUnion = lazy(() => import('../pages/ATimelessUnion'))
const Design15 = lazy(() => import('../pages/Design15'))
const Design16 = lazy(() => import('../pages/Design16'))
const Design17 = lazy(() => import('../pages/Design17'))
const MandapAtDusk = lazy(() => import('../pages/MandapAtDusk'))
const TextLayoutLayer = lazy(() => import('./TextLayoutLayer'))
const OrderFrameInvitation = lazy(() => import('./OrderFrameInvitation'))

const templateComponent: Record<number, React.LazyExoticComponent<React.ComponentType<any>>> = {
  1: MohadRahma,
  3: ATimelessUnion,
  4: MandapAtDusk,
  8: ArtfulLoveStory,
  101: NewDesign,
  104: Design4,
  108: Design8,
  109: Design9,
  110: Design10,
  111: Design11,
  112: Design12,
  115: Design15,
  116: Design16,
  117: Design17,
}

const fallback = <div role="status" style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#fffaf2', color: '#75664c', font: '14px Arial,sans-serif' }}>Opening your invitation…</div>

export default function InvitationRenderer({ details, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const animatedDetails = useMemo(() => details, [details])

  return <InvitationContext.Provider value={details}><Suspense fallback={fallback}>
    {renderTemplate(details, animatedDetails, rsvpTarget)}
  </Suspense></InvitationContext.Provider>
}

function renderTemplate(details: InvitationData, animatedDetails: InvitationData, rsvpTarget: RsvpTarget | undefined) {
  const { template } = details

  // Iframe-based templates with text overlay editing
  if ([9, 10, 11, 12, 13, 14].includes(template)) {
    return <TextLayoutLayer details={details} layout={details.textOverrides}><OrderFrameInvitation key={template} details={details} rsvpTarget={rsvpTarget} /></TextLayoutLayer>
  }

  // Native React components with their own layout
  if (template === 2) return <Majestic details={details} rsvpTarget={rsvpTarget} />
  if (template === 5) return <SecretGarden details={details} rsvpTarget={rsvpTarget} />

  // Standalone page component (no SiteFonts or TextLayoutLayer)
  if (template === 1) return <MohadRahma />

  // Page components or AnimatedInvitation, wrapped in SiteFonts + TextLayoutLayer
  const Component = templateComponent[template]
  const content = Component
    ? <Component />
    : <InvitationContext.Provider value={animatedDetails}><AnimatedInvitation details={animatedDetails} rsvpTarget={rsvpTarget} /></InvitationContext.Provider>

  return <>
    {(template === 101 || template === 108) && details.music && <PersonalMusic src={details.music} />}
    <SiteFonts />
    <TextLayoutLayer details={details} layout={details.textOverrides}>{content}</TextLayoutLayer>
  </>
}
