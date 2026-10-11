import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Create from './pages/Create'
import Preview from './pages/Preview'
import PublicInvite from './pages/PublicInvite'
import NewDesign from './pages/NewDesign'
import Design2 from './pages/Design2'
import Design3 from './pages/Design3'
import Design4 from './pages/Design4'
import Design5 from './pages/Design5'
import Design6 from './pages/Design6'
import Design7 from './pages/Design7'
import Design8 from './pages/Design8'
import MohadRahma from './pages/MohadRahma'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create" element={<Create />} />
      <Route path="/preview/:id" element={<Preview />} />
      <Route path="/invite/:slug" element={<PublicInvite />} />
      <Route path="/newDesign" element={<NewDesign />} />
      <Route path="/design2" element={<Design2 />} />
      <Route path="/design3" element={<Design3 />} />
      <Route path="/design4" element={<Design4 />} />
      <Route path="/design5" element={<Design5 />} />
      <Route path="/design6" element={<Design6 />} />
      <Route path="/design7" element={<Design7 />} />
      <Route path="/design8" element={<Design8 />} />
      <Route path="/mohadrahma" element={<MohadRahma />} />
    </Routes>
  )
}
