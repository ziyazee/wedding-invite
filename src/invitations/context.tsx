import { createContext, useContext } from 'react'
import type { InvitationData } from './model'
export const InvitationContext = createContext<InvitationData | null>(null)
export const useInvitationDetails = () => useContext(InvitationContext)
