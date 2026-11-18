import { describe, it, expect } from 'vitest'
import { getUserRole } from '../../src/lib/auth/resolveRole'
import type { User } from '@supabase/supabase-js'

function fakeUser(overrides: Partial<User> & { app_metadata?: Record<string, unknown> }): User {
  return {
    id: 'u-1',
    aud: 'authenticated',
    created_at: '2026-01-01',
    app_metadata: {},
    user_metadata: {},
    ...overrides,
  } as User
}

describe('getUserRole', () => {
  it('returns null for null/undefined user', () => {
    expect(getUserRole(null)).toBe(null)
    expect(getUserRole(undefined)).toBe(null)
  })

  it('returns ADMIN when app_metadata.role is ADMIN', () => {
    expect(getUserRole(fakeUser({ app_metadata: { role: 'ADMIN' } }))).toBe('ADMIN')
  })

  it('returns ADMIN case-insensitively', () => {
    expect(getUserRole(fakeUser({ app_metadata: { role: 'admin' } }))).toBe('ADMIN')
    expect(getUserRole(fakeUser({ app_metadata: { role: 'Admin' } }))).toBe('ADMIN')
  })

  it('returns CLIENT when role is CLIENT', () => {
    expect(getUserRole(fakeUser({ app_metadata: { role: 'CLIENT' }, email: 'a@b.com' }))).toBe('CLIENT')
  })

  it('returns CLIENT when no role but user has email', () => {
    expect(getUserRole(fakeUser({ app_metadata: {}, email: 'store@company.com' }))).toBe('CLIENT')
  })

  it('returns CLIENT when role is empty string but user has email', () => {
    expect(getUserRole(fakeUser({ app_metadata: { role: '' }, email: 'store@company.com' }))).toBe('CLIENT')
  })

  it('returns null when no role and no email', () => {
    expect(getUserRole(fakeUser({ app_metadata: {} }))).toBe(null)
  })
})
