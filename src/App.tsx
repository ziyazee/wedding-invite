import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { lazySitePage } from './SiteFonts'
import InvitationViewport from './invitations/InvitationViewport'

// Route boundaries keep dashboards, editor tools and unrelated designs out of
// the initial guest-page dependency graph.
const Landing = lazySitePage(() => import('./pages/Landing'))
const Create = lazySitePage(() => import('./pages/Create'))
const Preview = lazySitePage(() => import('./pages/Preview'))
const PublicInvite = lazySitePage(() => import('./pages/PublicInvite'))
const Design2 = lazySitePage(() => import('./pages/Design2'))
const Design3 = lazySitePage(() => import('./pages/Design3'))
const EmbroideredGardenPreview = lazySitePage(() => import('./pages/EmbroideredGardenPreview'))
const Design4 = lazySitePage(() => import('./pages/Design4'))
const Design5 = lazySitePage(() => import('./pages/Design5'))
const SecretGardenPreview = lazySitePage(() => import('./pages/SecretGardenPreview'))
const Design6 = lazy(() => import('./pages/Design6'))
const Design7 = lazySitePage(() => import('./pages/Design7'))
const BloomPreview = lazySitePage(() => import('./pages/BloomPreview'))
const Design8 = lazySitePage(() => import('./pages/Design8'))
const Design9 = lazySitePage(() => import('./pages/Design9'))
const Design10 = lazySitePage(() => import('./pages/Design10'))
const Design11 = lazySitePage(() => import('./pages/Design11'))
const Design12 = lazySitePage(() => import('./pages/Design12'))
const Design13 = lazySitePage(() => import('./pages/Design13'))
const Design14 = lazySitePage(() => import('./pages/Design14'))
const CelebrationsEmbed = lazySitePage(() => import('./pages/design14/CelebrationsEmbed'))
const Design15 = lazySitePage(() => import('./pages/Design15'))
const Design16 = lazySitePage(() => import('./pages/Design16'))
const Design17 = lazySitePage(() => import('./pages/Design17'))
const Design18 = lazySitePage(() => import('./pages/Design18'))
const MaroonLetter = lazySitePage(() => import('./pages/MaroonLetter'))
const EmeraldParchment = lazySitePage(() => import('./pages/EmeraldParchment'))
const ShaadiPathT02 = lazySitePage(() => import('./pages/ShaadiPathT02'))
const AamantranDestination = lazySitePage(() => import('./pages/AamantranDestination'))
const AamantranRaabta = lazySitePage(() => import('./pages/AamantranRaabta'))
const AamantranQubool = lazySitePage(() => import('./pages/AamantranQubool'))
const BirthdayInvite = lazySitePage(() => import('./pages/BirthdayInvite'))
const HousewarmingInvite = lazySitePage(() => import('./pages/HousewarmingInvite'))
const Design3D = lazySitePage(() => import('./pages/Design3D'))
const MohadRahma = lazy(() => import('./pages/MohadRahma'))
const GeneratedInvitation = lazy(() => import('./pages/GeneratedInvitation'))

function getInviteSlug(): string | null {
  const host = window.location.hostname
  if (host.endsWith('.shaadiinvites.in') && host !== 'www.shaadiinvites.in') {
    return host.slice(0, -'.shaadiinvites.in'.length) || null
  }
  return new URLSearchParams(window.location.search).get('invite')
}
const Login = lazySitePage(() => import('./pages/Login'))
const ClientDashboard = lazySitePage(() => import('./pages/ClientDashboard'))
const ClientDashboardTesting = lazySitePage(() => import('./pages/ClientDashboard').then(m => ({ default: m.ClientDashboardTesting })))
const ClientLivePreview = lazy(() => import('./pages/ClientLivePreview'))
const AdminDashboard = lazySitePage(() => import('./pages/AdminDashboard'))
const OrderManagement = lazySitePage(() => import('./pages/OrderManagement'))

function SingleSegmentRoute() {
  const { slug = '' } = useParams()
  if (/^\d+-[A-Za-z0-9_-]{16}$/.test(slug)) return <OrderManagement />
  return <GeneratedInvitation />
}

export default function App() {
  const inviteSlug = getInviteSlug()
  if (inviteSlug) {
    return (
      <InvitationViewport><Suspense fallback={<main role="status" style={{minHeight:'100svh',display:'grid',placeItems:'center',background:'#fffaf2',color:'#75664c',font:'14px Arial,sans-serif'}}>Loading…</main>}>
        <GeneratedInvitation overrideSlug={inviteSlug} />
      </Suspense></InvitationViewport>
    )
  }
  return (
    <InvitationViewport><Suspense fallback={<main role="status" style={{minHeight:'100svh',display:'grid',placeItems:'center',background:'#fffaf2',color:'#75664c',font:'14px Arial,sans-serif'}}>Loading…</main>}><Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client/dashboard" element={<ClientDashboard />} />
      <Route path="/testing567" element={<ClientDashboardTesting />} />
      <Route path="/client/live-preview" element={<ClientLivePreview />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/create" element={<Create />} />
      <Route path="/preview/:id" element={<Preview />} />
      <Route path="/invite/:slug" element={<PublicInvite />} />
      <Route path="/newDesign" element={<Navigate to="/dashboard" replace />} />
      <Route path="/design2" element={<Design2 />} />
      <Route path="/design3" element={<Design3 />} />
      <Route path="/embroidered-garden" element={<EmbroideredGardenPreview />} />
      <Route path="/design4" element={<Design4 />} />
      <Route path="/blossom-and-oud" element={<Design4 />} />
      <Route path="/design8" element={<Design8 />} />
      <Route path="/noor" element={<Design8 />} />
      <Route path="/design9" element={<Design9 />} />
      <Route path="/sunehri" element={<Design9 />} />
      <Route path="/design10" element={<Design10 />} />
      <Route path="/yasmin" element={<Design10 />} />
      <Route path="/design11" element={<Design11 />} />
      <Route path="/maitri" element={<Design11 />} />
      <Route path="/design12" element={<Design12 />} />
      <Route path="/kiran" element={<Design12 />} />
      <Route path="/design4" element={<Design4 />} />
      <Route path="/design5" element={<Design5 />} />
      <Route path="/secret-garden" element={<SecretGardenPreview />} />
      <Route path="/design6" element={<Design6 />} />
      <Route path="/majestic" element={<Design6 />} />
      <Route path="/design7" element={<Design7 />} />
      <Route path="/bloom" element={<BloomPreview />} />
      <Route path="/design8" element={<Design8 />} />
      <Route path="/design9" element={<Design9 />} />
      <Route path="/design10" element={<Design10 />} />
      <Route path="/design11" element={<Design11 />} />
      <Route path="/design12" element={<Design12 />} />
      <Route path="/design13" element={<Design13 />} />
      <Route path="/the-artful-love-story" element={<Design13 />} />
      <Route path="/design14/celebrations" element={<CelebrationsEmbed />} />
      <Route path="/design14" element={<Navigate to="/arjunbhavana" replace />} />
      <Route path="/arjunbhavana" element={<Design14 />} />
      <Route path="/a-timeless-union" element={<Design14 />} />
      <Route path="/design15" element={<Design15 />} />
      <Route path="/ivory-arch" element={<Design15 />} />
      <Route path="/design16" element={<Design16 />} />
      <Route path="/sacred-mandap" element={<Design16 />} />
      <Route path="/design17" element={<Design17 />} />
      <Route path="/gulabi-mandap" element={<Design17 />} />
      <Route path="/design18" element={<Design18 />} />
      <Route path="/mandap-at-dusk" element={<Design18 />} />
      <Route path="/design19" element={<MaroonLetter />} />
      <Route path="/maroon-letter" element={<MaroonLetter />} />
      <Route path="/design20" element={<EmeraldParchment />} />
      <Route path="/emerald-parchment" element={<EmeraldParchment />} />
      <Route path="/design21" element={<ShaadiPathT02 />} />
      <Route path="/royal-jodhpur" element={<ShaadiPathT02 />} />
      <Route path="/design22" element={<AamantranDestination />} />
      <Route path="/destination-wedding" element={<AamantranDestination />} />
      <Route path="/design23" element={<AamantranRaabta />} />
      <Route path="/raabta" element={<AamantranRaabta />} />
      <Route path="/design24" element={<AamantranQubool />} />
      <Route path="/qubool" element={<AamantranQubool />} />
      <Route path="/3d-invite" element={<Design3D />} />
      <Route path="/clay-invite" element={<Design3D />} />
      <Route path="/birthday" element={<BirthdayInvite />} />
      <Route path="/housewarming" element={<HousewarmingInvite />} />
      <Route path="/royal-grace" element={<MohadRahma />} />
      <Route path="/mohadrahm" element={<Navigate to="/mohadrahma" replace />} />
      <Route path="/mohadrahma" element={<MohadRahma />} />
      <Route path="/:orderNumber/:slug" element={<GeneratedInvitation />} />
      <Route path="/:slug" element={<SingleSegmentRoute />} />
    </Routes></Suspense></InvitationViewport>
  )
}

