import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Landing from './pages/Landing'
import Create from './pages/Create'
import Preview from './pages/Preview'
import PublicInvite from './pages/PublicInvite'
import Design2 from './pages/Design2'
import Design3 from './pages/Design3'
import EmbroideredGardenPreview from './pages/EmbroideredGardenPreview'
import Design4 from './pages/Design4'
import Design5 from './pages/Design5'
import SecretGardenPreview from './pages/SecretGardenPreview'
import Design6 from './pages/Design6'
import Design7 from './pages/Design7'
import BloomPreview from './pages/BloomPreview'
import Design8 from './pages/Design8'
import Design9 from './pages/Design9'
import Design10 from './pages/Design10'
import Design11 from './pages/Design11'
import Design12 from './pages/Design12'
import Design13 from './pages/Design13'
import Design14 from './pages/Design14'
import CelebrationsEmbed from './pages/design14/CelebrationsEmbed'
import Design15 from './pages/Design15'
import Design16 from './pages/Design16'
import Design17 from './pages/Design17'
import Design18 from './pages/Design18'
import MaroonLetter from './pages/MaroonLetter'
import EmeraldParchment from './pages/EmeraldParchment'
import ShaadiPathT02 from './pages/ShaadiPathT02'
import MohadRahma from './pages/MohadRahma'
import GeneratedInvitation from './pages/GeneratedInvitation'
import Login from './pages/Login'
import ClientDashboard from './pages/ClientDashboard'
import ClientLivePreview from './pages/ClientLivePreview'
import AdminDashboard from './pages/AdminDashboard'
import OrderManagement from './pages/OrderManagement'

function SingleSegmentRoute() {
  const { slug = '' } = useParams()
  if (/^\d+-[A-Za-z0-9_-]{16}$/.test(slug)) return <OrderManagement />
  return <GeneratedInvitation />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client/dashboard" element={<ClientDashboard />} />
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
      <Route path="/royal-grace" element={<MohadRahma />} />
      <Route path="/mohadrahm" element={<Navigate to="/mohadrahma" replace />} />
      <Route path="/mohadrahma" element={<MohadRahma />} />
      <Route path="/:orderNumber/:slug" element={<GeneratedInvitation />} />
      <Route path="/:slug" element={<SingleSegmentRoute />} />
    </Routes>
  )
}
