import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Create from './pages/Create'
import Preview from './pages/Preview'
import PublicInvite from './pages/PublicInvite'
import NewDesign from './pages/NewDesign'
import Design2 from './pages/Design2'
import Design3 from './pages/Design3'

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
    </Routes>
  )
}
