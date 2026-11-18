import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../supabase'
import { getUserRole } from './resolveRole'
import type { AppRole } from './resolveRole'
import { getCompanyByEmail } from './resolveCompany'
import type { Company } from './resolveCompany'

export type AuthState = {
  user: User | null
  role: AppRole
  company: Company | null
  isLoading: boolean
  signOut: () => Promise<void>
  refresh: () => void
}

const noop = async () => {}

export const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  company: null,
  isLoading: true,
  signOut: noop,
  refresh: noop,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    let active = true

    async function resolve() {
      const { data, error } = await supabase!.auth.getUser()
      if (!active) return
      if (error || !data.user) {
        setUser(null)
        setCompany(null)
        setIsLoading(false)
        return
      }
      setUser(data.user)
      const role = getUserRole(data.user)
      if (role === 'CLIENT' && data.user.email) {
        const resolved = await getCompanyByEmail(data.user.email)
        if (!active) return
        setCompany(resolved)
      } else {
        setCompany(null)
      }
      setIsLoading(false)
    }

    void resolve()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      if (!session?.user) {
        setUser(null)
        setCompany(null)
        return
      }
      setUser(session.user)
      if (getUserRole(session.user) === 'CLIENT' && session.user.email) {
        void getCompanyByEmail(session.user.email).then(resolved => {
          if (active) setCompany(resolved)
        })
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [tick])

  const role = getUserRole(user)

  const signOut = useMemo(() => async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setCompany(null)
  }, [])

  const refresh = useMemo(() => () => setTick(t => t + 1), [])

  const value = useMemo<AuthState>(
    () => ({ user, role, company, isLoading, signOut, refresh }),
    [user, role, company, isLoading, signOut, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
