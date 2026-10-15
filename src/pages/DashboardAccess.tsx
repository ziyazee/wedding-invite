import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function DashboardAccess({ role, children }: { role: 'CLIENT' | 'ADMIN'; children: ReactNode }) {
  const [state, setState] = useState<'loading' | 'allowed' | 'denied'>('loading')
  useEffect(() => {
    let alive = true
    async function check() {
      if (!supabase || !isSupabaseConfigured) { if (alive) setState('denied'); return }
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) { if (alive) setState('denied'); return }
      const isAdmin = String(user.app_metadata?.role || '').toUpperCase() === 'ADMIN'
      let isClient = false
      if (role === 'CLIENT' && user.email) {
        const { data: company } = await supabase.from('companies').select('id').ilike('email', user.email).maybeSingle()
        isClient = Boolean(company)
      }
      if (alive) setState(role === 'ADMIN' ? isAdmin ? 'allowed' : 'denied' : isClient ? 'allowed' : 'denied')
    }
    void check()
    return () => { alive = false }
  }, [role])
  if (state === 'loading') return <main className="dash-loading">Verifying your secure access…</main>
  if (state === 'denied') return <Navigate to="/login" replace />
  return <>{children}</>
}

export async function signOutToLogin() {
  if (supabase) await supabase.auth.signOut()
  window.location.assign('/login')
}
