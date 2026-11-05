import type { ReactNode } from 'react'

// The 9:16 portrait frame is rendered by main.tsx on all viewport sizes before React mounts.
// Inside that frame window.self !== window.top, so this component simply
// passes children through on every path.
export default function InvitationViewport({ children }: { children: ReactNode }) {
  return children
}
