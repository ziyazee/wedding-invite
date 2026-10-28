import type { ReactNode } from 'react'

// The desktop portrait frame is rendered by main.tsx before React mounts.
// Inside that frame window.self !== window.top, so this component simply
// passes children through on every path.
export default function InvitationViewport({ children }: { children: ReactNode }) {
  return children
}
