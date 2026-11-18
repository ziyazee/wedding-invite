import type { User } from '@supabase/supabase-js'

export type AppRole = 'ADMIN' | 'CLIENT' | null

export function getUserRole(user: User | null | undefined): AppRole {
  if (!user) return null
  const raw = String(user.app_metadata?.role || '').toUpperCase()
  if (raw === 'ADMIN') return 'ADMIN'
  if (raw === 'CLIENT' || user.email) return 'CLIENT'
  return null
}
