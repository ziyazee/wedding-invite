import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Create from './pages/Create'
import Preview from './pages/Preview'
import PublicInvite from './pages/PublicInvite'
import Design2 from './pages/Design2'
import Design3 from './pages/Design3'
import Design4 from './pages/Design4'
import Design5 from './pages/Design5'
import Design6 from './pages/Design6'
import Design7 from './pages/Design7'
import Design8 from './pages/Design8'
import Design9 from './pages/Design9'
import Design10 from './pages/Design10'
import Design11 from './pages/Design11'
import Design12 from './pages/Design12'
import Design13 from './pages/Design13'
import Design14 from './pages/Design14'
import Design15 from './pages/Design15'
import Design16 from './pages/Design16'
import Design17 from './pages/Design17'
import Design18 from './pages/Design18'
import MohadRahma from './pages/MohadRahma'
import Dashboard from './pages/Dashboard'
import GeneratedInvitation from './pages/GeneratedInvitation'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<Create />} />
      <Route path="/preview/:id" element={<Preview />} />
      <Route path="/invite/:slug" element={<PublicInvite />} />
      <Route path="/newDesign" element={<Navigate to="/dashboard" replace />} />
      <Route path="/design2" element={<Design2 />} />
      <Route path="/design3" element={<Design3 />} />
      <Route path="/design4" element={<Design4 />} />
      <Route path="/design5" element={<Design5 />} />
      <Route path="/design6" element={<Design6 />} />
      <Route path="/design7" element={<Design7 />} />
      <Route path="/design8" element={<Design8 />} />
      <Route path="/design9" element={<Design9 />} />
      <Route path="/design10" element={<Design10 />} />
      <Route path="/design11" element={<Design11 />} />
      <Route path="/design12" element={<Design12 />} />
      <Route path="/design13" element={<Design13 />} />
      <Route path="/design14" element={<Design14 />} />
      <Route path="/design15" element={<Design15 />} />
      <Route path="/design16" element={<Design16 />} />
      <Route path="/design17" element={<Design17 />} />
      <Route path="/design18" element={<Design18 />} />
      <Route path="/mohadrahm" element={<Navigate to="/mohadrahma" replace />} />
      <Route path="/mohadrahma" element={<MohadRahma />} />
      <Route path="/:slug" element={<GeneratedInvitation />} />
    </Routes>
  )
}
