import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export function DashboardAccess({ role, children }: { role: 'CLIENT' | 'ADMIN'; children: ReactNode }) {
  const { user, role: userRole, company, isLoading } = useAuth()

  if (isLoading) return <main className="dash-loading">Verifying your secure access…</main>
  if (!user) return <Navigate to="/login" replace />

  if (role === 'ADMIN' && userRole !== 'ADMIN') return <Navigate to="/login" replace />
  if (role === 'CLIENT' && !company) return <Navigate to="/login" replace />

  return <>{children}</>
}

export async function signOutToLogin() {
  const { supabase } = await import('../../lib/supabase')
  if (supabase) await supabase.auth.signOut()
  window.location.assign('/login')
}
