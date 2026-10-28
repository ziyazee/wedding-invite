import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ATimelessUnion from './pages/ATimelessUnion'

// Dedicated React entry keeps the shared invitation independent of dashboard assets.
createRoot(document.getElementById('root')!).render(
  <StrictMode><ATimelessUnion /></StrictMode>,
)
