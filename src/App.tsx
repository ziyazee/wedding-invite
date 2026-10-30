import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import { lazySitePage } from './SiteFonts'
import InvitationViewport from './invitations/InvitationViewport'
import { isSupabaseConfigured, supabase } from './lib/supabase'

// Route boundaries keep dashboards, editor tools and unrelated designs out of
// the initial guest-page dependency graph.
const Landing = lazySitePage(() => import('./pages/Landing'))
const Create = lazySitePage(() => import('./pages/Create'))
const Preview = lazySitePage(() => import('./pages/Preview'))
const PublicInvite = lazySitePage(() => import('./pages/PublicInvite'))
// Active templates
const EmbroideredGardenPreview = lazySitePage(() => import('./pages/EmbroideredGardenPreview'))
const SecretGardenPreview = lazySitePage(() => import('./pages/SecretGardenPreview'))
const MajesticPreview = lazySitePage(() => import('./pages/MajesticPreview'))
const BloomPreview = lazySitePage(() => import('./pages/BloomPreview'))
const ArtfulLoveStoryPreview = lazySitePage(() => import('./pages/ArtfulLoveStoryPreview'))
const ATimelessUnion = lazySitePage(() => import('./pages/ATimelessUnion'))
const ATimelessUnionPreview = lazySitePage(() => import('./pages/ATimelessUnionPreview'))
const CelebrationsEmbed = lazySitePage(() => import('./pages/a-timeless-union/CelebrationsEmbed'))
const MandapAtDuskPreview = lazySitePage(() => import('./pages/MandapAtDuskPreview'))
// Testing templates
const MaroonLetter = lazySitePage(() => import('./pages/MaroonLetter'))
const EmeraldParchment = lazySitePage(() => import('./pages/EmeraldParchment'))
const ShaadiPathT02 = lazySitePage(() => import('./pages/ShaadiPathT02'))
const DestinationWedding = lazySitePage(() => import('./pages/DestinationWedding'))
const Raabta = lazySitePage(() => import('./pages/Raabta'))
const Qubool = lazySitePage(() => import('./pages/Qubool'))
// Future use cases
const BirthdayInvite = lazySitePage(() => import('./pages/BirthdayInvite'))
const HousewarmingInvite = lazySitePage(() => import('./pages/HousewarmingInvite'))
// Deprecated templates
const Design4 = lazySitePage(() => import('./pages/Design4'))
const Design8 = lazySitePage(() => import('./pages/Design8'))
const Design9 = lazySitePage(() => import('./pages/Design9'))
const Design10 = lazySitePage(() => import('./pages/Design10'))
const Design11 = lazySitePage(() => import('./pages/Design11'))
const Design12 = lazySitePage(() => import('./pages/Design12'))
const Design15 = lazySitePage(() => import('./pages/Design15'))
const Design16 = lazySitePage(() => import('./pages/Design16'))
const Design17 = lazySitePage(() => import('./pages/Design17'))
const MohadRahma = lazy(() => import('./pages/MohadRahma'))
const GeneratedInvitation = lazy(() => import('./pages/GeneratedInvitation'))
const StoreLanding = lazy(() => import('./pages/StoreLanding'))
const Privacy = lazy(() => import('./pages/Privacy'))

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
const Edits = lazySitePage(() => import('./pages/Edits'))
const ClientLivePreview = lazy(() => import('./pages/ClientLivePreview'))
const AdminDashboard = lazySitePage(() => import('./pages/AdminDashboard'))
const OrderManagement = lazySitePage(() => import('./pages/OrderManagement'))

function SingleSegmentRoute() {
  const { slug = '' } = useParams()
  if (/^\d+-[A-Za-z0-9_-]{16}$/.test(slug)) return <OrderManagement />
  return <GeneratedInvitation />
}

const SUBDOMAIN_CACHE_KEY = 'si:subdomain:'

function SubdomainResolver({ slug }: { slug: string }) {
  const [target, setTarget] = useState<'store' | 'invitation' | null>(() => {
    try { return sessionStorage.getItem(SUBDOMAIN_CACHE_KEY + slug) as 'store' | 'invitation' | null } catch { return null }
  })

  useEffect(() => {
    if (target) return
    if (!supabase || !isSupabaseConfigured) { setTarget('invitation'); return }
    let cancelled = false
    supabase.rpc('resolve_subdomain', { p_slug: slug }).then(({ data, error }) => {
      if (cancelled) return
      const resolved = !error && data?.type === 'store' ? 'store' : 'invitation'
      try { sessionStorage.setItem(SUBDOMAIN_CACHE_KEY + slug, resolved) } catch {}
      setTarget(resolved as 'store' | 'invitation')
    })
    return () => { cancelled = true }
  }, [slug, target])

  if (!target) return <main role="status" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>Opening your invitation…</main>
  if (target === 'store') return <StoreLanding slug={slug} />
  return <GeneratedInvitation overrideSlug={slug} />
}

export default function App() {
  const inviteSlug = getInviteSlug()
  if (inviteSlug) {
    return (
      <InvitationViewport><Suspense fallback={<main role="status" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>Opening your invitation…</main>}>
        <SubdomainResolver slug={inviteSlug} />
      </Suspense></InvitationViewport>
    )
  }
  return (
    <InvitationViewport><Suspense fallback={<main role="status" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>Loading…</main>}><Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client/dashboard" element={<ClientDashboard />} />
      <Route path="/testing567" element={<ClientDashboardTesting />} />
      <Route path="/edits" element={<Edits />} />
      <Route path="/client/live-preview" element={<ClientLivePreview />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/create" element={<Create />} />
      <Route path="/preview/:id" element={<Preview />} />
      <Route path="/invite/:slug" element={<PublicInvite />} />
      <Route path="/newDesign" element={<Navigate to="/dashboard" replace />} />
      {/* Active templates */}
      <Route path="/embroidered-garden" element={<EmbroideredGardenPreview />} />
      <Route path="/secret-garden" element={<SecretGardenPreview />} />
      <Route path="/majestic" element={<MajesticPreview />} />
      <Route path="/bloom" element={<BloomPreview />} />
      <Route path="/the-artful-love-story" element={<ArtfulLoveStoryPreview />} />
      <Route path="/templates/a-timeless-union/celebrations" element={<CelebrationsEmbed />} />
      <Route path="/arjunbhavana" element={<ATimelessUnion />} />
      <Route path="/a-timeless-union" element={<ATimelessUnionPreview />} />
      <Route path="/mandap-at-dusk" element={<MandapAtDuskPreview />} />
      {/* Testing templates */}
      <Route path="/maroon-letter" element={<MaroonLetter />} />
      <Route path="/emerald-parchment" element={<EmeraldParchment />} />
      <Route path="/royal-jodhpur" element={<ShaadiPathT02 />} />
      <Route path="/destination-wedding" element={<DestinationWedding />} />
      <Route path="/raabta" element={<Raabta />} />
      <Route path="/qubool" element={<Qubool />} />
      {/* Future use cases */}
      <Route path="/birthday" element={<BirthdayInvite />} />
      <Route path="/housewarming" element={<HousewarmingInvite />} />
      {/* Deprecated templates (named routes only) */}
      <Route path="/blossom-and-oud" element={<Design4 />} />
      <Route path="/noor" element={<Design8 />} />
      <Route path="/sunehri" element={<Design9 />} />
      <Route path="/yasmin" element={<Design10 />} />
      <Route path="/maitri" element={<Design11 />} />
      <Route path="/kiran" element={<Design12 />} />
      <Route path="/ivory-arch" element={<Design15 />} />
      <Route path="/sacred-mandap" element={<Design16 />} />
      <Route path="/gulabi-mandap" element={<Design17 />} />
      <Route path="/royal-grace" element={<MohadRahma />} />
      <Route path="/mohadrahm" element={<Navigate to="/mohadrahma" replace />} />
      <Route path="/mohadrahma" element={<MohadRahma />} />
      <Route path="/:orderNumber/:slug" element={<GeneratedInvitation />} />
      <Route path="/:slug" element={<SingleSegmentRoute />} />
    </Routes></Suspense></InvitationViewport>
  )
}

