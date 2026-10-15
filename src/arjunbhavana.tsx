import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Design14 from './pages/Design14'

// Dedicated React entry keeps the shared invitation independent of dashboard assets.
createRoot(document.getElementById('root')!).render(
  <StrictMode><Design14 /></StrictMode>,
)
