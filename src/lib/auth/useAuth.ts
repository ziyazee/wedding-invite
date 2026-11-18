import { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import type { AuthState } from './AuthProvider'

export function useAuth(): AuthState {
  return useContext(AuthContext)
}
